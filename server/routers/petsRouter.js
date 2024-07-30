const { Router } = require('express');
const { petsController } = require('../controllers/petsControllers');
const petsRouter = Router();

petsRouter.get('/', petsController.getAllReports);
petsRouter.get('/innerJoinUsersLostPets', petsController.innerJoinUsersLostPets);
petsRouter.get('/innerJoinUsersDistressedPets', petsController.innerJoinUsersDistressedPets);
petsRouter.get('/:id', petsController.getReportById);
petsRouter.put('/:id', petsController.updateReport);
petsRouter.delete('/:id', petsController.deleteReport);

module.exports = { petsRouter };
