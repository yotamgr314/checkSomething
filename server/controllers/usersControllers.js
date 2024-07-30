// Path: server/controllers/usersControllers.js

const { dbConnection } = require('../db_connection');

const table_name_users = "tbl_106_users";

const usersController = {
    async getAllUsers(req, res) {
        const connection = await dbConnection.createConnection();
        const [users] = await connection.execute(`SELECT * FROM ${table_name_users}`);
        connection.end();
        res.json(users);
    },
    async getUserById(req, res) {
        const connection = await dbConnection.createConnection();
        const [user] = await connection.execute(`SELECT * FROM ${table_name_users} WHERE UserId = ?`, [req.params.id]);
        connection.end();
        res.json(user);
    },
    async createUser(req, res) {
        const connection = await dbConnection.createConnection();
        const { username, email, password } = req.body;
        await connection.execute(`INSERT INTO ${table_name_users} (UserName, UserMail, UserPassword) VALUES (?, ?, ?)`, [username, email, password]);
        connection.end();
        res.json({ message: "User created successfully" });
    },
    async updateUser(req, res) {
        const connection = await dbConnection.createConnection();
        const { username, email, password } = req.body;
        await connection.execute(`UPDATE ${table_name_users} SET UserName = ?, UserMail = ?, UserPassword = ? WHERE UserId = ?`, [username, email, password, req.params.id]);
        connection.end();
        res.json({ message: "User updated successfully" });
    },
    async deleteUser(req, res) {
        const connection = await dbConnection.createConnection();
        await connection.execute(`DELETE FROM ${table_name_users} WHERE UserId = ?`, [req.params.id]);
        connection.end();
        res.json({ message: "User deleted successfully" });
    }
}

module.exports = { usersController };
