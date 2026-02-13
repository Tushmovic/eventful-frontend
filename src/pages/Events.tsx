import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/v1';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    venue: string;
    city: string;
  };
  ticketPrice: number;
  availableTickets: number;
  totalTickets: number;
  category: string;
  images: string[];
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { token } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(data.data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

const purchaseTicket = async (eventId: string) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/tickets/purchase`,
      { eventId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Store the token in sessionStorage before redirecting
    sessionStorage.setItem('paymentToken', token);
    sessionStorage.setItem('paymentReference', data.data.reference);
    
    // Redirect to Paystack payment page
    window.location.href = data.data.paymentUrl;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Purchase failed');
  }
};

  const categories = ['All', ...new Set(events.map(e => e.category))];
  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎭</div>
          <p style={{ color: 'var(--secondary-600)' }}>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)' }}>
          🎪 Upcoming Events
        </h1>
        
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                background: selectedCategory === category ? 'var(--primary-600)' : 'var(--secondary-100)',
                color: selectedCategory === category ? 'white' : 'var(--secondary-700)',
                fontWeight: '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'var(--white)', 
          borderRadius: 'var(--border-radius)' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😢</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No events found</h3>
          <p style={{ color: 'var(--secondary-600)' }}>Check back later for new events!</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event._id} className="event-card">
              {event.images && event.images.length > 0 ? (
                <img 
                  src={event.images[0]} 
                  alt={event.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1rem' 
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
                }}>
                  🎪
                </div>
              )}
              
              <h3>{event.title}</h3>
              <p>{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</p>
              
              <div className="event-details">
                <p>📅 {new Date(event.date).toLocaleDateString('en-NG', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
                <p>📍 {event.location.venue}, {event.location.city}</p>
                <p>🎫 {event.availableTickets} / {event.totalTickets} tickets left</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                  ₦{(event.ticketPrice / 100).toLocaleString()}
                </p>
              </div>
              
              <button 
                className="btn btn-primary btn-block"
                onClick={() => purchaseTicket(event._id)}
                disabled={event.availableTickets === 0}
                style={{
                  opacity: event.availableTickets === 0 ? 0.5 : 1,
                  cursor: event.availableTickets === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {event.availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}