import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events/${id}?incrementViews=true`, {
        headers: { Authorization: `Bearer ${token}` } // 🔥 FIX: Add token to request
      });
      setEvent(data.data);
    } catch (error) {
      toast.error('Failed to load event');
      navigate('/app/events');
    } finally {
      setLoading(false);
    }
  };

  const purchaseTicket = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/tickets/purchase`,
        { eventId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      sessionStorage.setItem('paymentToken', token || '');
      sessionStorage.setItem('paymentReference', data.data.reference);
      
      if (data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎭</div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Hero Image */}
      <div style={{
        width: '100%',
        height: '300px',
        background: event.images?.[0] 
          ? `url(${event.images[0]}) center/cover`
          : 'linear-gradient(135deg, var(--earth-600), var(--earth-800))',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '2rem',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          {event.title}
        </h1>
      </div>

      {/* Event Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About This Event</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--earth-700)' }}>{event.description}</p>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Event Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CalendarIcon style={{ width: '1.5rem', color: 'var(--earth-600)' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Date & Time</div>
                  <div>{new Date(event.date).toLocaleDateString('en-NG', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}</div>
                  <div>{event.startTime} - {event.endTime}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <MapPinIcon style={{ width: '1.5rem', color: 'var(--earth-600)' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Location</div>
                  <div>{event.location.venue}</div>
                  <div>{event.location.address}, {event.location.city}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CurrencyDollarIcon style={{ width: '1.5rem', color: 'var(--earth-600)' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Ticket Price</div>
                  <div>₦{(event.ticketPrice / 100).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Get Tickets</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--earth-700)', marginBottom: '1rem' }}>
            ₦{(event.ticketPrice / 100).toLocaleString()}
          </div>
          <div style={{ marginBottom: '1rem', color: 'var(--earth-600)' }}>
            🎫 {event.availableTickets} tickets left
          </div>
          <button
            onClick={purchaseTicket}
            disabled={event.availableTickets === 0}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem' }}
          >
            {event.availableTickets === 0 ? 'Sold Out' : 'Buy Ticket'}
          </button>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--earth-500)' }}>
            Secure payment via Paystack
          </div>
        </div>
      </div>
    </div>
  );
}