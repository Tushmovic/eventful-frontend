import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  TicketIcon, 
  PlusCircleIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      display: 'flex'
    }}>
      {/* Sidebar - Earth Tones */}
      <aside style={{
        width: '260px',
        background: 'var(--earth-800)',
        color: 'white',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          marginBottom: '3rem',
          padding: '0 1rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🎭</span>
          <div>
            <div style={{ 
              fontWeight: '700', 
              fontSize: '1.25rem',
              color: 'var(--earth-200)'
            }}>
              Alaya
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: 'var(--earth-400)'
            }}>
              Eventful
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{
          background: 'var(--earth-700)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontWeight: '600', color: 'white' }}>{user?.name}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--earth-300)' }}>
            {user?.role === 'creator' ? '🎪 Event Creator' : '🎟️ Event Attendee'}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/events" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--earth-200)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--earth-700)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--earth-200)';
          }}>
            <HomeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Dashboard</span>
          </Link>

          <Link to="/events" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--earth-200)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--earth-700)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--earth-200)';
          }}>
            <CalendarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Events</span>
          </Link>

          <Link to="/my-tickets" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            color: 'var(--earth-200)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--earth-700)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--earth-200)';
          }}>
            <TicketIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>My Tickets</span>
          </Link>

          {user?.role === 'creator' && (
            <>
              <Link to="/create-event" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'var(--earth-200)',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--earth-700)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--earth-200)';
              }}>
                <PlusCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Create Event</span>
              </Link>

              <Link to="/analytics" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'var(--earth-200)',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--earth-700)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--earth-200)';
              }}>
                <ChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Analytics</span>
              </Link>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--earth-700)',
            border: 'none',
            color: 'var(--earth-200)',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '2rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--earth-700)';
            e.currentTarget.style.color = 'var(--earth-200)';
          }}
        >
          <ArrowRightOnRectangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <Outlet />
      </main>
    </div>
  );
}