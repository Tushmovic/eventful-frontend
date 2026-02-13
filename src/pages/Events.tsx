import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
      
      sessionStorage.setItem('paymentToken', token || '');
      sessionStorage.setItem('paymentReference', data.data.reference);
      
      if (data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        toast.error('No payment URL received');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  const shareEvent = async (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await axios.post(`${API_URL}/events/${event._id}/share`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const eventUrl = `${window.location.origin}/app/events/${event._id}`;
      const encodedUrl = encodeURIComponent(eventUrl);
      const encodedTitle = encodeURIComponent(event.title);
      
      const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      };
      
      const shareWindow = window.open('', '_blank', 'width=600,height=400');
      if (shareWindow) {
        shareWindow.document.write(`
          <html>
            <head><title>Share Event</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px; background: var(--earth-50);">
              <h2 style="color: var(--earth-800);">Share this event</h2>
              <p><strong>${event.title}</strong></p>
              <div style="display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap;">
                <a href="${shareLinks.facebook}" target="_blank" style="padding: 10px 20px; background: #1877f2; color: white; text-decoration: none; border-radius: 5px;">Facebook</a>
                <a href="${shareLinks.twitter}" target="_blank" style="padding: 10px 20px; background: #1da1f2; color: white; text-decoration: none; border-radius: 5px;">Twitter</a>
                <a href="${shareLinks.whatsapp}" target="_blank" style="padding: 10px 20px; background: #25D366; color: white; text-decoration: none; border-radius: 5px;">WhatsApp</a>
                <a href="${shareLinks.linkedin}" target="_blank" style="padding: 10px 20px; background: #0a66c2; color: white; text-decoration: none; border-radius: 5px;">LinkedIn</a>
              </div>
              <p>Or copy this link: <input type="text" value="${eventUrl}" style="width: 300px; padding: 5px;" readonly /></p>
              <button onclick="window.close()" style="padding: 8px 16px; margin-top: 10px; background: var(--earth-600); color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </body>
          </html>
        `);
      }
      
      toast.success('Event shared! 🎉');
    } catch (error) {
      toast.error('Failed to share event');
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
            <Link 
              to={`/app/events/${event._id}`} 
              key={event._id} 
              style={{ textDecoration: 'none' }}
            >
              <div className="event-card">
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
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3>{event.title}</h3>
                  <button
                    onClick={(e) => shareEvent(event, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary-100)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    title="Share event"
                  >
                    🔗
                  </button>
                </div>
                
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
                  onClick={(e) => {
                    e.preventDefault();
                    purchaseTicket(event._id);
                  }}
                  disabled={event.availableTickets === 0}
                  style={{
                    opacity: event.availableTickets === 0 ? 0.5 : 1,
                    cursor: event.availableTickets === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {event.availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}