import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());
  const { user } = useAuth();

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    api
      .get('/jobs', { params: { search, location, category, page, limit: 9 } })
      .then((res) => {
        setJobs(res.data.jobs);
        setPages(res.data.pages);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, location, category, page]);

  useEffect(() => {
    if (user?.role === 'seeker') {
      api.get('/users/saved-jobs').then((res) => {
        setSavedIds(new Set(res.data.jobs.map((j) => j._id)));
      }).catch(() => {});
    }
  }, [user]);

  const toggleSave = (jobId, isSaved) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
  };

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setPage(1);
  };

  return (
    <div className="jobs-page-layout">
      <FilterSidebar
        category={category}
        location={location}
        onChangeCategory={(v) => updateFilter('category', v)}
        onChangeLocation={(v) => updateFilter('location', v)}
      />

      <div className="jobs-main">
        <div className="jobs-page-header">
          <div>
            <h1>Latest Jobs</h1>
            <p>{loading ? 'Loading...' : `${total} open role${total === 1 ? '' : 's'} matching your search`}</p>
          </div>
          <div className="jobs-search-inline">
            <Search size={16} />
            <input
              placeholder="Search title, company, skill..."
              defaultValue={search}
              onBlur={(e) => updateFilter('search', e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found matching your criteria.</p>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} saved={savedIds.has(job._id)} onToggleSave={toggleSave} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? 'btn-primary' : 'btn-outline'}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
