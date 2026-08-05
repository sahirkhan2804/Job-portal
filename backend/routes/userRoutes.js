const express = require('express');
const router = express.Router();
const { getSavedJobs, saveJob, unsaveJob } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/saved-jobs', protect, authorize('seeker'), getSavedJobs);
router.post('/saved-jobs/:jobId', protect, authorize('seeker'), saveJob);
router.delete('/saved-jobs/:jobId', protect, authorize('seeker'), unsaveJob);

module.exports = router;
