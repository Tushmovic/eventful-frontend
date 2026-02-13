import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/v1';

interface DashboardData {
  summary: {
    totalEvents: number;
    publishedEvents: number;
    draftEvents: number;
    completedEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    ticketsSold: number;
    totalTickets: number;
  }>;
  topEvents: Array<{
    id: string;
    title: string;
    ticketsSold: number;
    revenue: number;
    attendance: number;
  }>;
}

export default function Analytics() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(data.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: 'var(--secondary-600)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <h3>No analytics data available</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)' }}>
          📊 Analytics Dashboard
        </h1>
        
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="form-select"
          style={{ width: '150px' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <div className="stat-number">{dashboard.summary.totalEvents}</div>
          <div className="flex gap-2" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--primary-600)' }}>📢 {dashboard.summary.publishedEvents} published</span>
            <span style={{ color: 'var(--secondary-600)' }}>📝 {dashboard.summary.draftEvents} draft</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Tickets Sold</h3>
          <div className="stat-number">{dashboard.summary.totalTicketsSold}</div>
          <div style={{ marginTop: '0.5rem', color: 'var(--secondary-600)', fontSize: '0.75rem' }}>
            🎫 Across all events
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-number">₦{(dashboard.summary.totalRevenue / 100).toLocaleString()}</div>
          <div style={{ marginTop: '0.5rem', color: 'var(--accent)', fontSize: '0.75rem' }}>
            💰 From ticket sales
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div style={{ 
        background: 'var(--white)', 
        borderRadius: 'var(--border-radius)', 
        padding: '1.5rem', 
        marginTop: '2rem', 
        boxShadow: 'var(--shadow-md)' 
      }}>
        <h2 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📅</span> Upcoming Events
        </h2>
        
        {dashboard.upcomingEvents.length === 0 ? (
          <p style={{ color: 'var(--secondary-500)', textAlign: 'center', padding: '2rem' }}>
            No upcoming events scheduled
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboard.upcomingEvents.map(event => (
              <div key={event.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: 'var(--secondary-50)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{event.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>
                    {new Date(event.date).toLocaleDateString('en-NG')} • {event.location}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary-700)' }}>
                    {event.ticketsSold} / {event.totalTickets}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-500)' }}>
                    tickets sold
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Performing Events */}
      {dashboard.topEvents && dashboard.topEvents.length > 0 && (
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: 'var(--border-radius)', 
          padding: '1.5rem', 
          marginTop: '2rem', 
          boxShadow: 'var(--shadow-md)' 
        }}>
          <h2 className="flex items-center gap-2" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span> Top Performing Events
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboard.topEvents.map((event, index) => (
              <div key={event.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: index === 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : 'var(--secondary-50)',
                borderRadius: '0.5rem'
              }}>
                <div className="flex items-center gap-4">
                  <span style={{ 
                    width: '2rem', 
                    height: '2rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: index === 0 ? 'var(--primary-600)' : 'var(--secondary-400)',
                    color: 'white',
                    borderRadius: '9999px',
                    fontWeight: '700'
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <h4 style={{ fontWeight: '600' }}>{event.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>
                      {event.ticketsSold} tickets • ₦{(event.revenue / 100).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status ${event.attendance > 0 ? 'status-confirmed' : 'status-used'}`}>
                    {event.attendance} checked in
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}