// Populates the database with demo employer accounts and real job listings.
// Run with: npm run seed  (from the backend directory)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const jobsSeedData = require('./seedData/jobs');

const DEMO_PASSWORD = 'Password123!';

// Rotating set of demo employer companies so listings look varied
const companies = [
  { name: 'Slack', email: 'hr@slack.demo' },
  { name: 'Microsoft', email: 'hr@microsoft.demo' },
  { name: 'Walmart', email: 'hr@walmart.demo' },
  { name: 'Accenture', email: 'hr@accenture.demo' },
  { name: 'Samsung', email: 'hr@samsung.demo' },
  { name: 'Adobe', email: 'hr@adobe.demo' },
  { name: 'Amazon', email: 'hr@amazon.demo' },
];

const run = async () => {
  await connectDB();

  console.log('Clearing existing jobs, demo employers, and applications...');
  await Application.deleteMany({});
  await Job.deleteMany({});
  await User.deleteMany({ email: { $in: [...companies.map((c) => c.email), 'seeker@demo.com'] } });

  console.log('Creating demo employer accounts...');
  const employers = [];
  for (const c of companies) {
    const employer = await User.create({
      name: `${c.name} Recruiting`,
      email: c.email,
      password: DEMO_PASSWORD,
      role: 'employer',
      company: c.name,
    });
    employers.push(employer);
  }

  console.log('Creating a demo job seeker account...');
  await User.create({
    name: 'Demo Seeker',
    email: 'seeker@demo.com',
    password: DEMO_PASSWORD,
    role: 'seeker',
    headline: 'Aspiring Full Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
  });

  console.log(`Seeding ${jobsSeedData.length} jobs...`);
  const jobs = jobsSeedData.map((job, i) => {
    const employer = employers[i % employers.length];
    return {
      ...job,
      company: employer.company,
      postedBy: employer._id,
    };
  });
  await Job.insertMany(jobs);

  console.log('Done! Demo employer login: hr@<company>.demo / ' + DEMO_PASSWORD);
  console.log('Demo seeker login: seeker@demo.com / ' + DEMO_PASSWORD);
  console.log('Companies seeded: ' + companies.map((c) => c.name).join(', '));

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
