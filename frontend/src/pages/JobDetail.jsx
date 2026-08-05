import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import DOMPurify from 'dompurify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CompanyAvatar from '../components/CompanyAvatar';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const applyRef = useRef(null);
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [status, setStatus] = useState('');
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data.job));
  }, [id]);

  useEffect(() => {
    if (job && searchParams.get('apply') && applyRef.current) {
      applyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      applyRef.current.focus();
    }
  }, [job, searchParams]);

  useEffect(() => {
    if (user?.role === 'seeker') {
      api.get('/users/saved-jobs').then((res) => {
        setSaved(res.data.jobs.some((j) => j._id === id));
      }).catch(() => {});
    }
  }, [user, id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setApplied(true);
      setStatus('Application submitted successfully!');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to apply');
    }
  };

  const toggleSave = async () => {
    try {
      if (saved) await api.delete(`/users/saved-jobs/${id}`);
      else await api.post(`/users/saved-jobs/${id}`);
      setSaved(!saved);
    } catch {
      /* no-op */
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-detail-page">
      <Link to="/jobs" className="back-link"><ArrowLeft size={16} /> Back to jobs</Link>

      <div className="job-detail card">
        <div className="job-detail-header">
          <CompanyAvatar name={job.company} size={56} />
          <div className="job-detail-titles">
            <h2>{job.title}</h2>
            <p className="job-company"><MapPin size={14} /> {job.company} &middot; {job.location}</p>
          </div>
          {user?.role === 'seeker' && (
            <button className="bookmark-btn large" onClick={toggleSave}>
              {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          )}
        </div>

        <div className="job-badges">
          <span className="badge"><Briefcase size={12} /> {job.type}</span>
          {job.level && <span className="badge badge-alt">{job.level}</span>}
          {job.category && <span className="chip">{job.category}</span>}
        </div>

        {(job.salaryMin || job.salaryMax) && (
          <p className="job-salary">
            {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ''}
            {job.salaryMin && job.salaryMax ? ' - ' : ''}
            {job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ''}
            {job.salaryMin && !job.salaryMax ? '/yr' : ''}
          </p>
        )}

        <div className="job-skills">
          {job.skills?.map((s) => <span className="chip" key={s}>{s}</span>)}
        </div>

        <div
          className="job-desc-full"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description || '') }}
        />

        {user && user.role === 'seeker' && !applied && (
          <form onSubmit={handleApply} className="apply-form">
            <label>Cover Letter (optional)</label>
            <textarea
              ref={applyRef}
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit..."
            />
            <button type="submit" className="btn-primary">Apply Now</button>
          </form>
        )}

        {!user && <p>Please <Link to="/login">log in</Link> as a job seeker to apply.</p>}
        {status && <p className={applied ? 'success' : 'error'}>{status}</p>}
      </div>
    </div>
  );
}
