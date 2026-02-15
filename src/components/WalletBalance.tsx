import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { WalletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface WalletData {
  _id: string;
  balance: number;
  currency: string;
  lastTransactionAt: string;
}

export default function WalletBalance() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallet(data.data);
    } catch (err) {
      setError('Failed to load wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add animation style
  const spinAnimation = {
    animation: 'spin 1s linear infinite'
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-800))',
        borderRadius: '12px',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <ArrowPathIcon style={{ width: '1.25rem', ...spinAnimation }} />
        <span>Loading wallet...</span>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <Link to="/app/wallet" style={{ textDecoration: 'none' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--earth-700), var(--earth-800))',
          borderRadius: '12px',
          padding: '1rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <WalletIcon style={{ width: '1.5rem' }} />
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Wallet</div>
              <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>₦0.00</div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Create →</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/app/wallet" style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-800))',
        borderRadius: '12px',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <WalletIcon style={{ width: '1.5rem' }} />
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Wallet Balance</div>
            <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              ₦{wallet.balance.toLocaleString()}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>View →</span>
      </div>
    </Link>
  );
}