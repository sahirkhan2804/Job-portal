import { Link } from 'react-router-dom';
import { MapPin, Bookmark, BookmarkCheck } from 'lucide-react';
import CompanyAvatar from './CompanyAvatar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function JobCard({ job, saved = false, onToggleSave }) {
  const { user } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'seeker') return;
    try {
      if (saved) {
        await api.delete(`/users/saved-jobs/${job._id}`);
      } else {
        await api.post(`/users/saved-jobs/${job._id}`);
      }
      onToggleSave && onToggleSave(job._id, !saved);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="card job-card">
      <div className="job-card-top">
        <CompanyAvatar name={job.company} />
        <div className="job-card-titles">
          <h3>{job.title}</h3>
          <p className="job-company"><MapPin size={13} /> {job.company} &middot; {job.location}</p>
        </div>
        {user?.role === 'seeker' && (
          <button className="bookmark-btn" onClick={handleSave} title={saved ? 'Remove from saved' : 'Save job'}>
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      <div className="job-badges">
        <span className="badge">{job.type}</span>
        {job.level && <span className="badge badge-alt">{job.level}</span>}
      </div>

      <p className="job-desc">{stripHtml(job.description).slice(0, 110)}...</p>

      {(job.salaryMin || job.salaryMax) && (
        <p className="job-salary">
          {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ''}
          {job.salaryMin && job.salaryMax ? ' - ' : ''}
          {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ''}
          {job.salaryMin && !job.salaryMax ? '/yr' : ''}
        </p>
      )}

      <div className="job-card-actions">
        <Link to={`/jobs/${job._id}?apply=1`} className="btn-primary">Apply Now</Link>
        <Link to={`/jobs/${job._id}`} className="btn-outline">Learn More</Link>
      </div>
    </div>
  );
}
