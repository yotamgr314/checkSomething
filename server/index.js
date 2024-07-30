require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const server =app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log(socket.id);
})


app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    origin: ['https://project-web-alon-and-yotam.onrender.com','http://localhost:5502','http://127.0.0.1:5502'],
    credentials: true
}));

/* app.use(cors());
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const { usersRouter } = require('./routers/usersRouter');
const { petsRouter } = require('./routers/petsRouter');
const { formRouter } = require('./routers/formRouter');
const distressedPetFormRouter = require('./routers/distressedPetFormRouter');
const { authRouter } = require('./routers/authRouter');  // הוסף את authRouter
 
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/lostpetform', formRouter);
app.use('/api', distressedPetFormRouter);
app.use('/api/auth', authRouter);  // הוסף את authRouter