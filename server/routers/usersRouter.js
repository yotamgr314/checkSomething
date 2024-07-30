// Path: server/routers/usersRouter.js

const Router = require('express').Router;
const { usersController } = require('../controllers/usersControllers');
const usersRouter = Router();

usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getUserById);
usersRouter.post('/', usersController.createUser);
usersRouter.put('/:id', usersController.updateUser);
usersRouter.delete('/:id', usersController.deleteUser);

module.exports = { usersRouter };
