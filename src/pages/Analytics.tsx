import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const COLORS = ['#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

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
  salesOverTime?: Array<{
    date: string;
    tickets: number;
    revenue: number;
  }>;
}

// Custom tooltip formatter to handle undefined values
const formatTooltipValue = (value: any): string => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return '0';
};

export default function Analytics() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('bar');
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

  // Prepare data for charts
  const getEventPerformanceData = () => {
    if (!dashboard?.topEvents) return [];
    return dashboard.topEvents.map(event => ({
      name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
      tickets: event.ticketsSold,
      revenue: event.revenue / 100,
      attendance: event.attendance
    }));
  };

  const getCategoryData = () => {
    // This would come from backend ideally
    return [
      { name: 'Music', value: 35 },
      { name: 'Tech', value: 25 },
      { name: 'Sports', value: 20 },
      { name: 'Food', value: 15 },
      { name: 'Arts', value: 5 },
    ];
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

  const eventData = getEventPerformanceData();
  const categoryData = getCategoryData();

  return (
    <div className="container">
      {/* Header with Controls */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)' }}>
          📊 Analytics Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
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

          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="form-select"
            style={{ width: '150px' }}
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
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

        <div className="stat-card">
          <h3>Avg. Ticket Price</h3>
          <div className="stat-number">
            ₦{dashboard.summary.totalTicketsSold > 0 
              ? ((dashboard.summary.totalRevenue / dashboard.summary.totalTicketsSold) / 100).toFixed(2) 
              : '0'}
          </div>
          <div style={{ marginTop: '0.5rem', color: 'var(--secondary-600)', fontSize: '0.75rem' }}>
            💵 Per ticket
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        margin: '2rem 0'
      }}>
        {/* Event Performance Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Top Events Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' && (
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatTooltipValue(value), '']}
                />
                <Legend />
                <Bar dataKey="tickets" fill="#8b5cf6" name="Tickets Sold" />
                <Bar dataKey="attendance" fill="#14b8a6" name="Attendance" />
              </BarChart>
            )}
            {chartType === 'line' && (
              <LineChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [formatTooltipValue(value), '']}
                />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#8b5cf6" name="Tickets Sold" />
                <Line type="monotone" dataKey="attendance" stroke="#14b8a6" name="Attendance" />
              </LineChart>
            )}
            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    // 🔥 FIX: Handle undefined values safely
                    const safeName = name || '';
                    const safePercent = typeof percent === 'number' ? percent : 0;
                    const percentage = (safePercent * 100).toFixed(0);
                    return `${safeName} ${percentage}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    return [`${numValue} events`, 'Count'];
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Revenue by Event
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  return [`₦${numValue.toLocaleString()}`, 'Revenue'];
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (₦)" />
            </BarChart>
          </ResponsiveContainer>
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
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-100)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--secondary-50)'}
              >
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
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
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