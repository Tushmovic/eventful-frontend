import { useSearchParams, Link } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') || 'Payment failed';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--earth-50), var(--earth-100))'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <XCircleIcon style={{ 
          width: '4rem', 
          height: '4rem', 
          color: '#ef4444',
          margin: '0 auto 1.5rem'
        }} />
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' }}>
          Payment Failed
        </h1>
        <p style={{ color: 'var(--earth-600)', marginBottom: '2rem' }}>
          {error}
        </p>
        <Link 
          to="/app/events"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: 'var(--earth-600)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}