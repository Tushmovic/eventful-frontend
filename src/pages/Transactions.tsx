import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowPathIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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

export default function Transactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({
    totalCredits: 0,
    totalDebits: 0,
    totalRefunds: 0,
    netChange: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, [page, filter]);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/wallet/transactions?page=${page}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (page === 1) {
        setTransactions(data.data.transactions);
      } else {
        setTransactions(prev => [...prev, ...data.data.transactions]);
      }
      
      setHasMore(page < data.data.pagination.pages);
      calculateStats(data.data.transactions);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (txns: Transaction[]) => {
    const credits = txns.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const debits = txns.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const refunds = txns.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0);
    
    setStats({
      totalCredits: credits,
      totalDebits: debits,
      totalRefunds: refunds,
      netChange: credits + refunds - debits
    });
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    
    if (search) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
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

  const filteredTransactions = getFilteredTransactions();

  if (loading && page === 1) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <ArrowPathIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
          📊 Transaction History
        </h1>
        <p style={{ color: 'var(--earth-600)' }}>
          View all your wallet transactions, credits, debits, and refunds
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #10b98120, #10b98105)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #10b98130'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '0.5rem' }}>Total Credits</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
            ₦{stats.totalCredits.toLocaleString()}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ef444420, #ef444405)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #ef444430'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#ef4444', marginBottom: '0.5rem' }}>Total Debits</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
            ₦{stats.totalDebits.toLocaleString()}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f59e0b20, #f59e0b05)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #f59e0b30'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#f59e0b', marginBottom: '0.5rem' }}>Total Refunds</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
            ₦{stats.totalRefunds.toLocaleString()}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--earth-600)20, var(--earth-600)05)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--earth-600)30'
        }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--earth-600)', marginBottom: '0.5rem' }}>Net Change</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--earth-600)' }}>
            ₦{stats.netChange.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--earth-200)'
        }}>
          <MagnifyingGlassIcon style={{ width: '1.25rem', color: 'var(--earth-400)' }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.5rem 2rem 0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--earth-200)',
            background: 'white',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Transactions</option>
          <option value="credit">Credits Only</option>
          <option value="debit">Debits Only</option>
          <option value="refund">Refunds Only</option>
        </select>
      </div>

      {/* Transactions List */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--earth-500)' }}>
            <ClockIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
            <p>No transactions found</p>
            <Link
              to="/app/wallet"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                background: 'var(--earth-600)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px'
              }}
            >
              Go to Wallet
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTransactions.map((transaction) => (
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
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--earth-500)' }}>
                        <span>Ref: {transaction.reference.substring(0, 12)}...</span>
                        <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                      </div>
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
                onClick={() => setPage(p => p + 1)}
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
                Load More Transactions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}