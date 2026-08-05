import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/users/saved-jobs').then((res) => setJobs(res.data.jobs)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = (jobId, isSaved) => {
    if (!isSaved) setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2><Bookmark size={20} /> Saved Jobs</h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>You haven't saved any jobs yet. Browse jobs and tap the bookmark icon to save them here.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} saved onToggleSave={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
