import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function PublicEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events/${id}?incrementViews=true`);
      setEvent(data.data);
    } catch (error) {
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
        <h2>Loading event details...</h2>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Event not found</h2>
        <Link to="/events" style={{ color: 'var(--earth-600)' }}>Browse other events</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--earth-200)',
        padding: '1rem 2rem'
      }}>
        <Link 
          to="/events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--earth-600)',
            textDecoration: 'none'
          }}
        >
          <ArrowLeftIcon style={{ width: '1rem' }} />
          Back to Events
        </Link>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Hero Image */}
        <div style={{
          width: '100%',
          height: '400px',
          background: event.images?.[0] 
            ? `url(${event.images[0]}) center/cover`
            : 'linear-gradient(135deg, var(--earth-600), var(--earth-800))',
          borderRadius: '16px',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '2rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
            borderRadius: '0 0 16px 16px'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {event.title}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--earth-200)' }}>
              Organized by {event.organizer?.name}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Left Column - Description */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
              About This Event
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--earth-700)' }}>
              {event.description}
            </p>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
                Event Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CalendarIcon style={{ width: '1.5rem', color: 'var(--earth-500)' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--earth-700)' }}>Date & Time</div>
                    <div style={{ color: 'var(--earth-600)' }}>
                      {new Date(event.date).toLocaleDateString('en-NG', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div style={{ color: 'var(--earth-600)' }}>
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MapPinIcon style={{ width: '1.5rem', color: 'var(--earth-500)' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--earth-700)' }}>Location</div>
                    <div style={{ color: 'var(--earth-600)' }}>{event.location.venue}</div>
                    <div style={{ color: 'var(--earth-600)' }}>
                      {event.location.address}, {event.location.city}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
                  About the Organizer
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <UserIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                    <span style={{ color: 'var(--earth-700)' }}>{event.organizer.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <EnvelopeIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                    <span style={{ color: 'var(--earth-700)' }}>{event.organizer.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <PhoneIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                    <span style={{ color: 'var(--earth-700)' }}>{event.organizer.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - CTA Card */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '1rem' }}>
                ₦{(event.ticketPrice / 100).toLocaleString()}
              </div>
              
              <div style={{ marginBottom: '1.5rem', color: 'var(--earth-600)' }}>
                🎫 {event.availableTickets} tickets available
              </div>

              <Link
                to="/register"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--earth-600)',
                  color: 'white',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--earth-700)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--earth-600)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Account to Book
              </Link>

              <Link
                to="/login"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  background: 'transparent',
                  color: 'var(--earth-600)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: '1px solid var(--earth-300)'
                }}
              >
                Already have an account? Login
              </Link>

              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--earth-500)', textAlign: 'center' }}>
                Secure payment via Paystack
              </div>
            </div>

            {/* Share Event */}
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--earth-600)', marginBottom: '0.5rem' }}>
                Share this event
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>🐦</button>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>📘</button>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>📱</button>
                <button style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>🔗</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}