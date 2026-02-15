import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn,
  FaTiktok,
  FaEnvelope,
  FaLink,
  FaShareAlt
} from 'react-icons/fa';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const { token, user } = useAuth();

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

  const deleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    setDeletingId(eventId);
    
    try {
      await axios.delete(
        `${API_URL}/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEvents(events.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
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
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)' }}>
          🎪 Upcoming Events
        </h1>
        
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
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
              <div className="event-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{event.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                    {/* Share Button */}
<div style={{ position: 'relative' }}>
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveShareId(activeShareId === event._id ? null : event._id);
    }}
    style={{
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'all 0.2s',
      color: 'var(--earth-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--earth-100)';
      e.currentTarget.style.color = 'var(--earth-800)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.color = 'var(--earth-600)';
    }}
    title="Share event"
  >
    <FaShareAlt size={18} />
  </button>
  
  {activeShareId === event._id && (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      zIndex: 50,
      minWidth: '280px',
      border: '1px solid var(--earth-200)',
      animation: 'slideDown 0.2s ease'
    }}>
      <p style={{ 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        color: 'var(--earth-700)',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--earth-200)'
      }}>
        Share this event
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem',
        marginBottom: '0.75rem'
      }}>
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(event.title)}%20${encodeURIComponent(window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 211, 102, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaWhatsapp size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #1877F2, #0E5EBD)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(24, 119, 242, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaFacebookF size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Facebook</span>
        </a>

        {/* Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #1DA1F2, #0C7ABF)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(29, 161, 242, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaTwitter size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Twitter</span>
        </a>

        {/* TikTok */}
        <a
          href={`https://www.tiktok.com/share?url=${encodeURIComponent(window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #000000, #333333)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaTiktok size={18} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>TikTok</span>
        </a>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem'
      }}>
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #0A66C2, #004182)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(10, 102, 194, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaLinkedinIn size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>LinkedIn</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent('Check out this event: ' + window.location.origin + '/app/events/' + event._id)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #EA4335, #B23121)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(234, 67, 53, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaEnvelope size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Email</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.origin + '/app/events/' + event._id);
            toast.success('Link copied!');
            setActiveShareId(null);
          }}
          style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, var(--earth-600), var(--earth-800))',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px var(--earth-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaLink size={24} />
          <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Copy Link</span>
        </button>
      </div>
    </div>
  )}
</div>
                    
                    {user?.role === 'creator' && (
                      <button
                        onClick={(e) => deleteEvent(event._id, e)}
                        disabled={deletingId === event._id}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.2rem',
                          cursor: deletingId === event._id ? 'not-allowed' : 'pointer',
                          padding: '8px',
                          borderRadius: '50%',
                          transition: 'all 0.2s',
                          color: '#ef4444',
                          opacity: deletingId === event._id ? 0.5 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== event._id) {
                            e.currentTarget.style.background = '#fee2e2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none';
                        }}
                        title="Delete event"
                      >
                        <TrashIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {event.description}
                </p>
                
                <div className="event-details" style={{ marginTop: 'auto' }}>
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