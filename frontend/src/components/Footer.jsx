import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col footer-brand-col">
          <span className="brand"><Briefcase size={20} /> JobPortal</span>
          <p>Connecting great people with great companies. Built end-to-end with the MERN stack.</p>
          <div className="footer-socials">
            <a href="#" aria-label="GitHub"><Github size={17} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={17} /></a>
            <a href="#" aria-label="Email"><Mail size={17} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>For Job Seekers</h4>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/saved-jobs">Saved Jobs</Link>
          <Link to="/my-applications">My Applications</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="footer-col">
          <h4>For Employers</h4>
          <Link to="/employer/post-job">Post a Job</Link>
          <Link to="/employer/dashboard">Employer Dashboard</Link>
          <Link to="/register">Create Company Account</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</span>
        <span>Built with MongoDB, Express, React &amp; Node.js</span>
      </div>
    </footer>
  );
}
