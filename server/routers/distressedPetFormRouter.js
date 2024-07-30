const express = require('express');
const router = express.Router();
const { distressedPetFormController } = require('../controllers/distressedPetFormController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new distressed pet report
router.post('/distressedpetreport', authMiddleware, distressedPetFormController.createDistressedPetReport);

// Route to submit a distressed pet report
router.post('/submitdistressedpetreport', distressedPetFormController.submitDistressedPetReport);

// Route to get all distressed pet reports
router.get('/distressedpetreports', distressedPetFormController.getDistressedPetReports);

// Route to get distressed pet reports by user
router.get('/distressedpetreport/user/:userId', distressedPetFormController.getDistressedPetReportsByUser);

// Route to delete a distressed pet report
router.delete('/distressedpetreport/:reportId', distressedPetFormController.deleteDistressedPetReport);

module.exports = router;
