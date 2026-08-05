import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine').then((res) => setApplications(res.data.applications)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Job Title</th><th>Company</th><th>Location</th><th>Status</th></tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job?.title}</td>
                <td>{app.job?.company}</td>
                <td>{app.job?.location}</td>
                <td><span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
