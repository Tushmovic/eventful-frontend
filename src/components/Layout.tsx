import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  TicketIcon, 
  PlusCircleIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/events" className="navbar-brand">
            <span style={{ fontSize: '1.75rem' }}>🎭</span>
            <span>Alaya Eventful</span>
          </Link>
          
          <div className="navbar-menu">
            <Link to="/events" className="navbar-link">
              <CalendarIcon />
              <span>Events</span>
            </Link>
            <Link to="/my-tickets" className="navbar-link">
              <TicketIcon />
              <span>My Tickets</span>
            </Link>
            {user?.role === 'creator' && (
              <>
                <Link to="/create-event" className="navbar-link">
                  <PlusCircleIcon />
                  <span>Create Event</span>
                </Link>
                <Link to="/analytics" className="navbar-link">
                  <ChartBarIcon />
                  <span>Analytics</span>
                </Link>
              </>
            )}
          </div>

          <div className="navbar-user">
            <span className="user-info">
              👋 {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <ArrowRightOnRectangleIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <Outlet />
      </main>
    </div>
  );
}