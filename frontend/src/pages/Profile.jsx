import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    headline: user?.headline || '',
    skills: user?.skills?.join(', ') || '',
    resumeUrl: user?.resumeUrl || '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) };
      const res = await api.put('/auth/me', payload);
      setUser(res.data.user);
      setStatus('Profile updated!');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h2>My Profile</h2>
        {status && <p className="success">{status}</p>}

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        {user.role === 'employer' ? (
          <>
            <label>Company</label>
            <input name="company" value={form.company} onChange={handleChange} />
          </>
        ) : (
          <>
            <label>Headline</label>
            <input name="headline" value={form.headline} onChange={handleChange} />

            <label>Skills (comma-separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} />

            <label>Resume URL</label>
            <input name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="https://..." />
          </>
        )}

        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
