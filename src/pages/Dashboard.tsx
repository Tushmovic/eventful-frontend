import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  TicketIcon, 
  PlusCircleIcon, 
  ChartBarIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Create a new event and start selling tickets',
      icon: <PlusCircleIcon style={{ width: '2rem', height: '2rem' }} />,
      link: '/create-event',
      color: 'var(--earth-600)',
      forCreator: true
    },
    {
      title: 'My Events',
      description: 'View and manage your created events',
      icon: <CalendarIcon style={{ width: '2rem', height: '2rem' }} />,
      link: '/events',
      color: 'var(--sage-500)',
      forCreator: true
    },
    {
      title: 'Verify Tickets',
      description: 'Scan QR codes and verify your event tickets',
      icon: <QrCodeIcon style={{ width: '2rem', height: '2rem' }} />,
      link: '/verify',
      color: 'var(--terracotta-500)',
      forCreator: true
    },
    {
      title: 'Browse Events',
      description: 'Discover and book upcoming events',
      icon: <CalendarIcon style={{ width: '2rem', height: '2rem' }} />,
      link: '/events',
      color: 'var(--earth-600)',
      forCreator: false
    },
    {
      title: 'My Tickets',
      description: 'View your purchased tickets and QR codes',
      icon: <TicketIcon style={{ width: '2rem', height: '2rem' }} />,
      link: '/my-tickets',
      color: 'var(--sage-500)',
      forCreator: false
    }
  ];

  const filteredActions = user?.role === 'creator' 
    ? quickActions.filter(a => a.forCreator)
    : quickActions.filter(a => !a.forCreator);

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          color: 'var(--earth-800)',
          marginBottom: '0.5rem'
        }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--earth-600)' }}>
          {user?.role === 'creator' 
            ? 'Manage your events and track your success' 
            : 'Discover amazing events and get your tickets'}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {filteredActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            style={{
              textDecoration: 'none',
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--earth-200)',
              transition: 'all 0.3s ease',
              display: 'flex',
              gap: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = action.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--earth-200)';
            }}
          >
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '12px',
              background: `${action.color}20`,
              color: action.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {action.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: 'var(--earth-800)',
                marginBottom: '0.25rem'
              }}>
                {action.title}
              </h3>
              <p style={{ 
                fontSize: '0.875rem',
                color: 'var(--earth-600)',
                lineHeight: '1.4'
              }}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-800))',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <ChartBarIcon style={{ width: '2rem', height: '2rem', color: 'var(--earth-300)' }} />
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Quick Stats</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--earth-300)' }}>
              Visit Analytics to see your event performance metrics
            </p>
          </div>
        </div>
        <Link 
          to="/analytics"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          View Analytics →
        </Link>
      </div>
    </div>
  );
}