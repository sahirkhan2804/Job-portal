const User = require('../models/User');
const Job = require('../models/Job');

// @route GET /api/users/saved-jobs (seeker only)
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ jobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/users/saved-jobs/:jobId (seeker only)
exports.saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(req.user._id);
    if (!user.savedJobs.some((id) => id.toString() === req.params.jobId)) {
      user.savedJobs.push(req.params.jobId);
      await user.save();
    }
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/users/saved-jobs/:jobId (seeker only)
exports.unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== req.params.jobId);
    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
