import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { JobCategories, JobTypes } from '../constants/data';

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: user?.company || '',
    location: '',
    type: 'Full-time',
    category: JobCategories[0],
    level: 'Intermediate Level',
    salaryMin: '',
    salaryMax: '',
    skills: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await api.post('/jobs', payload);
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>
        {error && <p className="error">{error}</p>}

        <label>Job Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <label>Job Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {JobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {JobCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <label>Experience Level</label>
        <select name="level" value={form.level} onChange={handleChange}>
          <option>Beginner Level</option>
          <option>Intermediate Level</option>
          <option>Senior Level</option>
        </select>

        <div className="form-row">
          <div>
            <label>Salary Min</label>
            <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} />
          </div>
          <div>
            <label>Salary Max</label>
            <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} />
          </div>
        </div>

        <label>Skills (comma-separated)</label>
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />

        <label>Description</label>
        <textarea rows={6} name="description" value={form.description} onChange={handleChange} required />

        <button type="submit" className="btn-primary">Post Job</button>
      </form>
    </div>
  );
}
