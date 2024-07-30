// Path: server/routers/authRouter.js

const Router = require('express').Router;
const { authController } = require('../controllers/authController');
const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

module.exports = { authRouter };
