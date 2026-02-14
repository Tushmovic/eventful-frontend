import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function VerifyTicket() {
  const [ticketCode, setTicketCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { token } = useAuth();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setResult(null);

    try {
      const { data } = await axios.get(
        `${API_URL}/tickets/verify-ticket/${ticketCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data.data);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
      setResult({ isValid: false, message: 'Invalid ticket' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>
        Verify Ticket 🔍
      </h1>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2rem'
      }}>
        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Enter Ticket Code or Scan QR
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="e.g., TKT-XXXX-XXXX"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
              <button
                type="submit"
                disabled={verifying}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'var(--earth-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <QrCodeIcon style={{ width: '1.25rem' }} />
                Verify
              </button>
            </div>
          </div>
        </form>

        {result && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '8px',
            background: result.isValid ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${result.isValid ? '#10b981' : '#ef4444'}`
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: result.isValid ? '#065f46' : '#991b1b',
              marginBottom: '0.5rem'
            }}>
              {result.isValid ? '✅ Valid Ticket' : '❌ Invalid Ticket'}
            </h3>
            <p style={{ color: result.isValid ? '#065f46' : '#991b1b' }}>
              {result.message}
            </p>
            {result.ticket && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                <p><strong>Ticket:</strong> {result.ticket.ticketNumber}</p>
                <p><strong>Event:</strong> {result.event?.title}</p>
                <p><strong>Attendee:</strong> {result.user?.name}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}