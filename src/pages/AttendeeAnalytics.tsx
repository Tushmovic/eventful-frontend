import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { CalendarIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const COLORS = ['#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

interface AttendeeStats {
  totalTicketsPurchased: number;
  totalSpent: number;
  activeTickets: number;
  usedTickets: number;
  cancelledTickets: number;
  expiredTickets: number;
  favoriteCategories: Array<{ category: string; count: number }>;
  monthlySpending: Array<{ month: string; amount: number }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    venue: string;
    ticketNumber: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    date: string;
    amount?: number;
  }>;
}

export default function AttendeeAnalytics() {
  const [stats, setStats] = useState<AttendeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const { token, user } = useAuth();

  useEffect(() => {
    fetchAttendeeAnalytics();
  }, [timeRange]);

  const fetchAttendeeAnalytics = async () => {
    try {
      // This endpoint would need to be created on the backend
      const { data } = await axios.get(`${API_URL}/analytics/attendee?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data.data);
    } catch (error) {
      // For now, use mock data since backend endpoint doesn't exist yet
      setStats(getMockData());
      toast.success('Analytics loaded (mock data)');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const getMockData = (): AttendeeStats => ({
    totalTicketsPurchased: 24,
    totalSpent: 12500000, // in kobo (₦125,000)
    activeTickets: 8,
    usedTickets: 12,
    cancelledTickets: 2,
    expiredTickets: 2,
    favoriteCategories: [
      { category: 'Music', count: 10 },
      { category: 'Technology', count: 6 },
      { category: 'Food', count: 4 },
      { category: 'Sports', count: 3 },
      { category: 'Arts', count: 1 },
    ],
    monthlySpending: [
      { month: 'Jan', amount: 1500000 },
      { month: 'Feb', amount: 2000000 },
      { month: 'Mar', amount: 1800000 },
      { month: 'Apr', amount: 2500000 },
      { month: 'May', amount: 2200000 },
      { month: 'Jun', amount: 2500000 },
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Afro Nation Lagos 2026',
        date: '2026-04-15',
        venue: 'Eko Atlantic',
        ticketNumber: 'TKT-ABC123',
      },
      {
        id: '2',
        title: 'Tech Summit Nigeria',
        date: '2026-05-20',
        venue: 'Landmark Centre',
        ticketNumber: 'TKT-XYZ789',
      },
    ],
    recentActivity: [
      {
        type: 'purchase',
        description: 'Purchased ticket for Afro Nation Lagos',
        date: '2026-02-10',
        amount: 3500000,
      },
      {
        type: 'used',
        description: 'Attended DevFest Lagos',
        date: '2026-02-05',
      },
      {
        type: 'refund',
        description: 'Refund for cancelled event',
        date: '2026-02-01',
        amount: 1500000,
      },
    ],
  });

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: 'var(--secondary-600)' }}>Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <h3>No analytics data available yet</h3>
          <p style={{ color: 'var(--secondary-600)', marginTop: '1rem' }}>
            Start attending events to see your analytics!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)' }}>
          📊 My Event Analytics
        </h1>
        <p style={{ color: 'var(--earth-600)' }}>
          Track your event attendance and spending
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid var(--earth-300)',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <option value="1month">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TicketIcon style={{ width: '2rem', height: '2rem', color: 'var(--primary-600)' }} />
            <div>
              <h3>Total Tickets</h3>
              <div className="stat-number">{stats.totalTicketsPurchased}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CurrencyDollarIcon style={{ width: '2rem', height: '2rem', color: 'var(--accent)' }} />
            <div>
              <h3>Total Spent</h3>
              <div className="stat-number">₦{(stats.totalSpent / 100).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CalendarIcon style={{ width: '2rem', height: '2rem', color: 'var(--sage-500)' }} />
            <div>
              <h3>Active Tickets</h3>
              <div className="stat-number">{stats.activeTickets}</div>
            </div>
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
        {/* Favorite Categories Pie Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            🎯 Favorite Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.favoriteCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const percentage = percent ? (percent * 100).toFixed(0) : '0';
                  return `${name} ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="category"
              >
                {stats.favoriteCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} tickets`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Spending Bar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            💰 Monthly Spending
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${value/100}K`} />
              <Tooltip 
                formatter={(value: any) => [`₦${(value/100).toLocaleString()}`, 'Amount']}
              />
              <Bar dataKey="amount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ticket Status Breakdown */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          🎫 Ticket Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.activeTickets}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>Active</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366f1' }}>{stats.usedTickets}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>Used</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{stats.expiredTickets}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>Expired</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{stats.cancelledTickets}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>Cancelled</div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {stats.upcomingEvents.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            📅 Upcoming Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.upcomingEvents.map(event => (
              <div key={event.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'var(--secondary-50)',
                borderRadius: '8px',
              }}>
                <div>
                  <h4 style={{ fontWeight: '600' }}>{event.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-600)' }}>
                    {new Date(event.date).toLocaleDateString()} • {event.venue}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--secondary-500)' }}>
                    Ticket: {event.ticketNumber}
                  </p>
                </div>
                <span className="status status-confirmed">Upcoming</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          📋 Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {stats.recentActivity.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              background: 'var(--secondary-50)',
              borderRadius: '8px',
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: activity.type === 'purchase' ? '#10b98120' : 
                           activity.type === 'used' ? '#6366f120' : '#ef444420',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activity.type === 'purchase' ? '#10b981' : 
                       activity.type === 'used' ? '#6366f1' : '#ef4444',
              }}>
                {activity.type === 'purchase' ? '🎫' : 
                 activity.type === 'used' ? '✓' : '↩'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '500' }}>{activity.description}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-500)' }}>
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              {activity.amount && (
                <div style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
                  ₦{(activity.amount / 100).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}