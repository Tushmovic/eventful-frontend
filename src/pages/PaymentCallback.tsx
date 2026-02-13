import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      
      console.log('🔍 Payment callback received:', { reference, trxref });
      console.log('Full URL:', window.location.href);
      
      const paymentReference = reference || trxref;
      
      if (!paymentReference) {
        toast.error('No payment reference found');
        navigate('/app/events');
        return;
      }
      
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast.error('Please login again');
          navigate('/login');
          return;
        }

        console.log('Verifying payment:', paymentReference);
        console.log('API URL:', `${API_URL}/tickets/verify/${paymentReference}`);

        const { data } = await axios.get(
          `${API_URL}/tickets/verify/${paymentReference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('Verification response:', data);
        
        if (data.success) {
          toast.success('Payment successful! 🎉');
          navigate('/app/my-tickets');
        } else {
          toast.error(data.message || 'Verification failed');
          navigate('/app/events');
        }
      } catch (error: any) {
        console.error('❌ Verification error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        // Special handling for 401
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Payment verification failed');
          navigate('/app/events');
        }
      }
    };
    
    verifyPayment();
  }, [searchParams, navigate]);
  
  return (
    <div className="container">
      <div className="text-center" style={{ padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
        <h3>Verifying your payment...</h3>
        <p style={{ color: 'var(--earth-600)', marginTop: '1rem' }}>
          Please do not close this window.
        </p>
      </div>
    </div>
  );
}