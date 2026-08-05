const Job = require('../models/Job');
const Application = require('../models/Application');

// @route GET /api/jobs
// supports ?search=&location=&type=&page=&limit=
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type, category, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (category) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/jobs  (employer only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, type, category, level, salaryMin, salaryMax, skills } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'title, description, company and location are required' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      type,
      category,
      level,
      salaryMin,
      salaryMax,
      skills,
      postedBy: req.user._id,
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/jobs/:id (employer, owner only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own job postings' });
    }

    const allowedFields = [
      'title', 'description', 'company', 'location', 'type', 'category', 'level',
      'salaryMin', 'salaryMax', 'skills', 'isActive',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/jobs/:id (employer, owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own job postings' });
    }

    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/meta/stats
exports.getStats = async (req, res) => {
  try {
    const [totalJobs, companies, categories] = await Promise.all([
      Job.countDocuments({ isActive: true }),
      Job.distinct('company', { isActive: true }),
      Job.distinct('category', { isActive: true }),
    ]);
    res.json({
      totalJobs,
      totalCompanies: companies.length,
      totalCategories: categories.filter(Boolean).length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/jobs/employer/mine (employer only)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
