import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
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

interface Bookmark {
  _id: string;
  event: {
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
    creator: {
      name: string;
      email: string;
      profileImage: string;
    };
  };
  createdAt: string;
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bookmarks/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(data.data.bookmarks);
    } catch (error) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRemovingId(eventId);
    
    try {
      await axios.post(
        `${API_URL}/bookmarks/toggle/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBookmarks(bookmarks.filter(b => b.event._id !== eventId));
      toast.success('Removed from bookmarks');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove bookmark');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
          <p style={{ color: 'var(--secondary-600)' }}>Loading your saved events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
          ❤️ Saved Events
        </h1>
        <p style={{ color: 'var(--earth-600)' }}>
          You have {bookmarks.length} saved event{bookmarks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'var(--white)', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>❤️</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
            No saved events yet
          </h3>
          <p style={{ color: 'var(--earth-600)', marginBottom: '2rem' }}>
            When you bookmark events, they'll appear here for quick access.
          </p>
          <Link 
            to="/app/events"
            className="btn btn-primary"
            style={{ textDecoration: 'none', padding: '0.75rem 2rem' }}
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {bookmarks.map(bookmark => (
            <Link 
              to={`/app/events/${bookmark.event._id}`} 
              key={bookmark._id} 
              style={{ textDecoration: 'none' }}
            >
              <div className="event-card" style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Remove Bookmark Button */}
                <button
                  onClick={(e) => removeBookmark(bookmark.event._id, e)}
                  disabled={removingId === bookmark.event._id}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2.5rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: removingId === bookmark.event._id ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 5,
                    color: '#ef4444',
                    opacity: removingId === bookmark.event._id ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (removingId !== bookmark.event._id) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.background = '#fee2e2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (removingId !== bookmark.event._id) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                  title="Remove bookmark"
                >
                  <HeartSolid style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>

                {/* Event Image */}
                {bookmark.event.images && bookmark.event.images.length > 0 ? (
                  <img 
                    src={bookmark.event.images[0]} 
                    alt={bookmark.event.title}
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
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{bookmark.event.title}</h3>
                  
                  {/* Share Button */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveShareId(activeShareId === bookmark.event._id ? null : bookmark.event._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
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
                    
                    {activeShareId === bookmark.event._id && (
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
                            href={`https://wa.me/?text=${encodeURIComponent(bookmark.event.title)}%20${encodeURIComponent(window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaWhatsapp size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>WhatsApp</span>
                          </a>

                          {/* Facebook */}
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaFacebookF size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Facebook</span>
                          </a>

                          {/* Twitter */}
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(bookmark.event.title)}&url=${encodeURIComponent(window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaTwitter size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Twitter</span>
                          </a>

                          {/* TikTok */}
                          <a
                            href={`https://www.tiktok.com/share?url=${encodeURIComponent(window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaTiktok size={20} />
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
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaLinkedinIn size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>LinkedIn</span>
                          </a>

                          {/* Email */}
                          <a
                            href={`mailto:?subject=${encodeURIComponent(bookmark.event.title)}&body=${encodeURIComponent('Check out this event: ' + window.location.origin + '/app/events/' + bookmark.event._id)}`}
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
                            <FaEnvelope size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Email</span>
                          </a>

                          {/* Copy Link */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(window.location.origin + '/app/events/' + bookmark.event._id);
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
                            <FaLink size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: '500' }}>Copy Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <p style={{ 
                  flex: 1, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical',
                  color: 'var(--earth-600)',
                  margin: '0.5rem 0'
                }}>
                  {bookmark.event.description}
                </p>
                
                <div className="event-details" style={{ marginTop: 'auto' }}>
                  <p>📅 {new Date(bookmark.event.date).toLocaleDateString('en-NG', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</p>
                  <p>📍 {bookmark.event.location.venue}, {bookmark.event.location.city}</p>
                  <p>🎫 {bookmark.event.availableTickets} / {bookmark.event.totalTickets} tickets left</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                    ₦{bookmark.event.ticketPrice.toLocaleString()}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--earth-200)'
                }}>
                  <img
                    src={bookmark.event.creator?.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
                    alt={bookmark.event.creator?.name}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--earth-700)' }}>
                      {bookmark.event.creator?.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)' }}>
                      Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}