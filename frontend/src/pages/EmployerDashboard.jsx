import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/axios';

const STATUS_COLORS = {
  Pending: '#d97706',
  Reviewed: '#2563eb',
  Shortlisted: '#7c3aed',
  Rejected: '#dc2626',
  Hired: '#16a34a',
};

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [allCounts, setAllCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    const res = await api.get('/jobs/employer/mine');
    setJobs(res.data.jobs);

    // fetch applicant counts per job for the chart
    const counts = {};
    await Promise.all(
      res.data.jobs.map(async (job) => {
        try {
          const appRes = await api.get(`/applications/job/${job._id}`);
          counts[job.title] = appRes.data.applications.length;
        } catch {
          counts[job.title] = 0;
        }
      })
    );
    setAllCounts(counts);
    setLoading(false);
  };

  useEffect(() => { loadJobs(); }, []);

  const viewApplications = (job) => {
    setSelectedJob(job);
    api.get(`/applications/job/${job._id}`).then((res) => setApplications(res.data.applications));
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    await api.delete(`/jobs/${jobId}`);
    loadJobs();
    if (selectedJob?._id === jobId) {
      setSelectedJob(null);
      setApplications([]);
    }
  };

  const handleStatusChange = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
  };

  const totalApplicants = useMemo(() => Object.values(allCounts).reduce((a, b) => a + b, 0), [allCounts]);

  const barData = useMemo(
    () => jobs.map((job) => ({ name: job.title.length > 14 ? job.title.slice(0, 14) + '…' : job.title, applicants: allCounts[job.title] || 0 })),
    [jobs, allCounts]
  );

  const statusPieData = useMemo(() => {
    const counts = {};
    applications.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Employer Dashboard</h2>
        <Link to="/employer/post-job" className="btn-primary"><Plus size={16} /> Post a Job</Link>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <Briefcase size={22} />
          <div><strong>{jobs.length}</strong><span>Active Postings</span></div>
        </div>
        <div className="stat-card">
          <Users size={22} />
          <div><strong>{totalApplicants}</strong><span>Total Applicants</span></div>
        </div>
        <div className="stat-card">
          <TrendingUp size={22} />
          <div><strong>{jobs.length ? Math.round((totalApplicants / jobs.length) * 10) / 10 : 0}</strong><span>Avg. Applicants / Job</span></div>
        </div>
      </div>

      {barData.length > 0 && (
        <div className="card chart-card">
          <h3>Applicants per Job</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applicants" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 className="section-title">Your Job Postings</h3>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Location</th><th>Type</th><th>Applicants</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.type}</td>
                <td>{allCounts[job.title] ?? '—'}</td>
                <td>{job.isActive ? 'Active' : 'Closed'}</td>
                <td>
                  <button className="btn-outline" onClick={() => viewApplications(job)}>Applicants</button>
                  <button className="btn-outline danger" onClick={() => handleDelete(job._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedJob && (
        <div className="applications-panel card">
          <div className="dashboard-header">
            <h3>Applicants for: {selectedJob.title}</h3>
          </div>

          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <>
              <div className="applicants-layout">
                <table className="table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Cover Letter</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td>{app.applicant?.name}</td>
                        <td>{app.applicant?.email}</td>
                        <td>{app.coverLetter?.slice(0, 80) || '-'}</td>
                        <td>
                          <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}>
                            <option>Pending</option>
                            <option>Reviewed</option>
                            <option>Shortlisted</option>
                            <option>Rejected</option>
                            <option>Hired</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={statusPieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {statusPieData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
