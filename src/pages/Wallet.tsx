import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  WalletIcon, 
  ArrowPathIcon, 
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface WalletData {
  _id: string;
  balance: number;
  currency: string;
  lastTransactionAt: string;
}

interface Transaction {
  _id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  balance: number;
  description: string;
  reference: string;
  status: string;
  createdAt: string;
}

export default function Wallet() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallet(data.data);
    } catch (error) {
      toast.error('Failed to load wallet');
    }
  };

  const fetchTransactions = async (pageNum = 1) => {
    try {
      const { data } = await axios.get(`${API_URL}/wallet/transactions?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (pageNum === 1) {
        setTransactions(data.data.transactions);
      } else {
        setTransactions(prev => [...prev, ...data.data.transactions]);
      }
      
      setHasMore(pageNum < data.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFundWallet = async () => {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount < 100) {
      toast.error('Minimum funding amount is ₦100');
      return;
    }

    setProcessing(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/wallet/fund/initialize`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Paystack
      window.location.href = data.data.authorization_url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize funding');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownIcon style={{ width: '1.25rem', color: '#10b981' }} />;
      case 'debit':
        return <ArrowUpIcon style={{ width: '1.25rem', color: '#ef4444' }} />;
      case 'refund':
        return <ArrowPathIcon style={{ width: '1.25rem', color: '#f59e0b' }} />;
      default:
        return <ClockIcon style={{ width: '1.25rem', color: '#6b7280' }} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit': return '#10b981';
      case 'debit': return '#ef4444';
      case 'refund': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <ArrowPathIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
        <p>Loading your wallet...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
          💰 My Wallet
        </h1>
        <p style={{ color: 'var(--earth-600)' }}>
          Manage your funds, view transactions, and recharge your wallet
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '2rem',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          fontSize: '8rem'
        }}>
          ₦
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <WalletIcon style={{ width: '2rem' }} />
            <span style={{ fontSize: '1.125rem', opacity: 0.9 }}>Current Balance</span>
          </div>
          
          <div style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            ₦{wallet?.balance.toLocaleString() || '0'}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowFundModal(true)}
              style={{
                padding: '0.75rem 2rem',
                background: 'var(--earth-500)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--earth-600)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--earth-500)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <PlusIcon style={{ width: '1.25rem' }} />
              Fund Wallet
            </button>
            
            <Link
              to="/app/refund-policy"
              style={{
                padding: '0.75rem 2rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <CreditCardIcon style={{ width: '1.25rem' }} />
              Refund Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--earth-700)' }}>
            {transactions.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--earth-500)' }}>Transactions</div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
            {transactions.filter(t => t.type === 'credit').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--earth-500)' }}>Credits</div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
            {transactions.filter(t => t.type === 'debit').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--earth-500)' }}>Debits</div>
        </div>
      </div>

      {/* Transaction History */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          📋 Transaction History
        </h3>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--earth-500)' }}>
            <ClockIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
            <p>No transactions yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Fund your wallet to get started
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--earth-50)',
                  borderRadius: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-100)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--earth-50)'}
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: `${getTransactionColor(transaction.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTransactionIcon(transaction.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {transaction.description}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)' }}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontWeight: '700',
                        color: getTransactionColor(transaction.type)
                      }}>
                        {transaction.type === 'debit' ? '-' : '+'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)' }}>
                        Bal: ₦{transaction.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchTransactions(nextPage);
                }}
                style={{
                  padding: '0.75rem',
                  background: 'none',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  color: 'var(--earth-600)',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            animation: 'slideUp 0.3s ease'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              Fund Your Wallet
            </h3>
            
            <p style={{ color: 'var(--earth-600)', marginBottom: '1.5rem' }}>
              Enter the amount you want to add to your wallet (Minimum ₦100)
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Amount (₦)
              </label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="e.g., 5000"
                min="100"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowFundModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  color: 'var(--earth-700)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleFundWallet}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--earth-600)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Processing...' : 'Fund Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}