import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { JobCategories } from '../constants/data';
import JobCard from '../components/JobCard';
import TrustedBy from '../components/TrustedBy';

const CATEGORY_ICONS = {
  Programming: '💻',
  'Data Science': '📊',
  Designing: '🎨',
  Networking: '🌐',
  Management: '📋',
  Marketing: '📣',
  Cybersecurity: '🔒',
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/meta/stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/jobs', { params: { limit: 6 } }).then((res) => setFeatured(res.data.jobs)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-content">
          <h1>Over {stats?.totalJobs ?? '10,000'}+ jobs to apply</h1>
          <p>Your next big career move starts right here — explore the best opportunities and take the first step toward your future.</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search for jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <MapPin size={18} />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary search-btn">Search</button>
          </form>
        </div>
      </section>

      <TrustedBy />

      <section className="section">
        <div className="section-header">
          <h2>Browse by Category</h2>
        </div>
        <div className="category-grid">
          {JobCategories.map((cat) => (
            <Link key={cat} to={`/jobs?category=${encodeURIComponent(cat)}`} className="category-card">
              <span className="category-emoji">{CATEGORY_ICONS[cat] || '💼'}</span>
              <span>{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Latest Jobs</h2>
              <p className="section-subtitle">Get your desired job from top companies</p>
            </div>
            <Link to="/jobs" className="see-all">See all jobs <ArrowRight size={16} /></Link>
          </div>
          <div className="job-grid">
            {featured.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        </section>
      )}

      <section className="cta-band">
        <div>
          <h2>Hiring? Post a job in minutes.</h2>
          <p>Reach job seekers actively looking for their next role.</p>
        </div>
        <Link to="/register" className="btn-primary">Post a Job Free</Link>
      </section>
    </div>
  );
}
