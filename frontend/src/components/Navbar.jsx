import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Bookmark, LayoutDashboard, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand"><Briefcase size={20} /> JobPortal</Link>
      <div className="nav-links">
        <Link to="/jobs">Browse Jobs</Link>
        {user && user.role === 'employer' && (
          <>
            <Link to="/employer/dashboard"><LayoutDashboard size={15} /> Dashboard</Link>
            <Link to="/employer/post-job"><PlusCircle size={15} /> Post a Job</Link>
          </>
        )}
        {user && user.role === 'seeker' && (
          <>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/saved-jobs"><Bookmark size={15} /> Saved</Link>
          </>
        )}
        {user && <Link to="/profile"><User size={15} /> Profile</Link>}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-outline">Sign Up</Link>
          </>
        ) : (
          <button className="btn-outline" onClick={handleLogout}><LogOut size={14} /> Logout</button>
        )}
      </div>
    </nav>
  );
}
