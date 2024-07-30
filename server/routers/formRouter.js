const express = require('express');
const multer = require('multer');
const { formController } = require('../controllers/formPageController');
const formRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });
formRouter.get('/', formController.createLostPetReport);
formRouter.post('/submit', authMiddleware, upload.array('photos', 10), formController.submitLostPetReport);

module.exports = { formRouter };
