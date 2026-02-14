import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');

  useEffect(() => {
    // Auto-redirect to my-tickets after 3 seconds
    const timer = setTimeout(() => {
      navigate('/app/my-tickets');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

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
        <CheckCircleIcon style={{ 
          width: '4rem', 
          height: '4rem', 
          color: '#10b981',
          margin: '0 auto 1.5rem'
        }} />
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' }}>
          Payment Successful! 🎉
        </h1>
        <p style={{ color: 'var(--earth-600)', marginBottom: '2rem' }}>
          Your ticket has been confirmed. Reference: {reference}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--earth-500)' }}>
          Redirecting to your tickets...
        </p>
      </div>
    </div>
  );
}