import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Ticket {
  _id: string;
  ticketNumber: string;
  event: {
    _id: string;
    title: string;
    date: string;
    location: {
      venue: string;
      city: string;
    };
  } | null;  // 🔥 FIX: event can be null
  status: 'confirmed' | 'used' | 'cancelled' | 'expired';
  qrCode: string;
  purchaseDate: string;
  price: number;
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrErrors, setQrErrors] = useState<Record<string, boolean>>({});
  const { token } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tickets/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(data.data.tickets);
      
      // Log QR code URLs for debugging
      data.data.tickets.forEach((ticket: Ticket) => {
        if (ticket.qrCode) {
          console.log(`Ticket ${ticket.ticketNumber} QR URL:`, ticket.qrCode);
        }
        // 🔥 DEBUG: Check for null events
        if (!ticket.event) {
          console.warn(`⚠️ Ticket ${ticket.ticketNumber} has no event data!`);
        }
      });
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleQrError = (ticketId: string, qrUrl: string) => {
    console.error(`QR code failed to load for ticket ${ticketId}:`, qrUrl);
    setQrErrors(prev => ({ ...prev, [ticketId]: true }));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'used': return 'status-used';
      case 'cancelled': return 'status-cancelled';
      case 'expired': return 'status-expired';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return '✅ Valid';
      case 'used': return '✓ Used';
      case 'cancelled': return '❌ Cancelled';
      case 'expired': return '⏰ Expired';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎫</div>
          <p style={{ color: 'var(--secondary-600)' }}>Loading your tickets...</p>
        </div>
      </div>
    );
  }

  // Filter out tickets with null events or show a placeholder
  const validTickets = tickets.filter(ticket => ticket.event !== null);
  const orphanedTickets = tickets.filter(ticket => ticket.event === null);

  return (
    <div className="container">
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)', marginBottom: '2rem' }}>
        🎟️ My Tickets
      </h1>

      {/* Show orphaned tickets warning if any */}
      {orphanedTickets.length > 0 && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#856404'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            ⚠️ Some tickets are for events that have been cancelled or removed.
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            {orphanedTickets.length} ticket(s) affected. Refunds have been processed.
          </p>
        </div>
      )}

      {validTickets.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'var(--white)', 
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No tickets yet!
          </h3>
          <p style={{ color: 'var(--secondary-600)', marginBottom: '2rem' }}>
            Looks like you haven't purchased any tickets.
          </p>
          <a 
            href="/events"
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Browse Events
          </a>
        </div>
      ) : (
        <div className="tickets-grid">
          {validTickets.map(ticket => (
            <div key={ticket._id} className="ticket-card">
              <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                <h3>{ticket.event?.title || 'Unknown Event'}</h3>
                <span className={`status ${getStatusColor(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
              
              <div className="ticket-number">
                #{ticket.ticketNumber}
              </div>
              
              <div style={{ margin: '1rem 0', color: 'var(--secondary-600)', fontSize: '0.875rem' }}>
                <p>📅 {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString('en-NG') : 'Date unavailable'}</p>
                <p>📍 {ticket.event?.location?.venue || 'Venue unavailable'}, {ticket.event?.location?.city || ''}</p>
                <p>💰 ₦{(ticket.price / 100).toLocaleString()}</p>
                <p>🕐 Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
              </div>

              {ticket.qrCode && ticket.status === 'confirmed' && !qrErrors[ticket._id] && (
                <div className="qr-code">
                  <p style={{ fontSize: '0.75rem', color: 'var(--secondary-500)', marginBottom: '0.5rem' }}>
                    Scan at event entrance
                  </p>
                  <img 
                    src={ticket.qrCode} 
                    alt="Ticket QR Code"
                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                    onError={() => handleQrError(ticket._id, ticket.qrCode)}
                    onLoad={() => console.log(`QR code loaded for ticket ${ticket.ticketNumber}`)}
                  />
                </div>
              )}

              {ticket.qrCode && qrErrors[ticket._id] && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#fff3cd',
                  border: '1px solid #ffeeba',
                  borderRadius: '0.5rem',
                  color: '#856404',
                  textAlign: 'center'
                }}>
                  <p style={{ marginBottom: '0.5rem' }}>⚠️ QR code temporarily unavailable</p>
                  <p style={{ fontSize: '0.875rem' }}>Ticket ID: {ticket.ticketNumber}</p>
                  <button
                    onClick={() => {
                      setQrErrors(prev => ({ ...prev, [ticket._id]: false }));
                      setTimeout(() => {
                        setQrErrors(prev => ({ ...prev, [ticket._id]: false }));
                      }, 100);
                    }}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 1rem',
                      background: 'var(--earth-600)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {ticket.status === 'used' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: 'var(--secondary-100)', 
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  color: 'var(--secondary-600)',
                  fontSize: '0.875rem'
                }}>
                  ✓ Ticket scanned and verified
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}