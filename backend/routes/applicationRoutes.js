const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:jobId', protect, authorize('seeker'), applyToJob);
router.get('/mine', protect, authorize('seeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer'), getApplicationsForJob);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
