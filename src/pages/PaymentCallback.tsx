import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/v1';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');
      
      console.log('🔍 Payment callback received:', { reference, trxref });
      
      const paymentReference = reference || trxref;
      
      if (!paymentReference) {
        toast.error('No payment reference found');
        navigate('/events');
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

        const { data } = await axios.get(
          `${API_URL}/tickets/verify/${paymentReference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (data.success) {
          toast.success('Payment successful! 🎉');
          navigate('/my-tickets');
        } else {
          toast.error(data.message || 'Verification failed');
          navigate('/events');
        }
      } catch (error: any) {
        console.error('❌ Verification error:', error.response?.data);
        toast.error(error.response?.data?.message || 'Payment verification failed');
        navigate('/events');
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