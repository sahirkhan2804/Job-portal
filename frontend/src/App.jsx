import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import EmployerDashboard from './pages/EmployerDashboard';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route
            path="/employer/post-job"
            element={<PrivateRoute role="employer"><PostJob /></PrivateRoute>}
          />
          <Route
            path="/employer/dashboard"
            element={<PrivateRoute role="employer"><EmployerDashboard /></PrivateRoute>}
          />
          <Route
            path="/my-applications"
            element={<PrivateRoute role="seeker"><MyApplications /></PrivateRoute>}
          />
          <Route
            path="/saved-jobs"
            element={<PrivateRoute role="seeker"><SavedJobs /></PrivateRoute>}
          />
          <Route
            path="/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
