// Path: server/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbConnection } = require('../db_connection');

const table_name_users = "tbl_106_users";
const { JWT_SECRET } = process.env;

const authController = {
    async register(req, res) {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const connection = await dbConnection.createConnection();

            await connection.execute(
                `INSERT INTO ${table_name_users} (UserName, UserMail, UserPassword) VALUES (?, ?, ?)`,
                [username, email, hashedPassword]
            );

            connection.end();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const connection = await dbConnection.createConnection();

            const [userResult] = await connection.execute(
                `SELECT * FROM ${table_name_users} WHERE UserMail = ?`,
                [email]
            );

            connection.end();

            if (userResult.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const user = userResult[0];
            const isMatch = await bcrypt.compare(password, user.UserPassword);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.UserId, username: user.UserName, email: user.UserMail }, JWT_SECRET, {
                expiresIn: '1h',
            });

            res.json({ token });
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = { authController };
