import { useState, useEffect } from 'react'; // 🔥 FIX: Added useEffect import
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowPathIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Account {
  _id: string;
  name: string;
  email: string;
  role: 'creator' | 'eventee';
  profileImage: string;
  isActive: boolean;
}

export default function SwitchAccount() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  // 🔥 FIX: Changed useState to useEffect
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/accounts/my-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(data.data);
    } catch (error) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const switchToAccount = async (accountId: string, role: string) => {
    setSwitching(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/accounts/switch`,
        { accountId, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the user in context with the new role
      if (user) {
        updateUser({ ...user, role: role as 'creator' | 'eventee' });
      }

      toast.success(`Switched to ${role} account`);
      navigate('/app/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to switch account');
    } finally {
      setSwitching(false);
    }
  };

  const createNewAccount = async (role: 'creator' | 'eventee') => {
    setSwitching(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/accounts/create`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`New ${role} account created`);
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '4rem' }}>
          <ArrowPathIcon style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p>Loading your accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
        Switch Account
      </h1>
      <p style={{ color: 'var(--earth-600)', marginBottom: '2rem' }}>
        Manage your creator and attendee accounts
      </p>

      {/* Current Active Account */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-800))',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
          Current Active Account
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={user?.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
            alt={user?.name}
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--earth-400)'
            }}
          />
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.25rem' }}>{user?.name}</div>
            <div style={{ color: 'var(--earth-300)' }}>{user?.email}</div>
            <span style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.25rem 1rem',
              background: 'var(--earth-600)',
              borderRadius: '9999px',
              fontSize: '0.875rem'
            }}>
              {user?.role === 'creator' ? '🎪 Creator' : '🎟️ Attendee'}
            </span>
          </div>
        </div>
      </div>

      {/* Other Accounts */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
        Your Other Accounts
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {accounts
          .filter(acc => acc._id !== user?._id)
          .map(account => (
            <div
              key={account._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--earth-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={account.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
                  alt={account.name}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{account.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--earth-500)' }}>{account.email}</div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '0.25rem',
                    padding: '0.125rem 0.75rem',
                    background: account.role === 'creator' ? 'var(--earth-100)' : 'var(--sage-100)',
                    color: account.role === 'creator' ? 'var(--earth-700)' : 'var(--sage-700)',
                    borderRadius: '9999px',
                    fontSize: '0.75rem'
                  }}>
                    {account.role === 'creator' ? '🎪 Creator' : '🎟️ Attendee'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => switchToAccount(account._id, account.role)}
                disabled={switching}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: 'var(--earth-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: switching ? 'not-allowed' : 'pointer',
                  opacity: switching ? 0.5 : 1
                }}
              >
                Switch
              </button>
            </div>
          ))}

        {accounts.filter(acc => acc._id !== user?._id).length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--earth-50)',
            borderRadius: '12px'
          }}>
            <UserCircleIcon style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: 'var(--earth-400)' }} />
            <p style={{ color: 'var(--earth-600)' }}>You don't have any other accounts yet.</p>
          </div>
        )}
      </div>

      {/* Create New Account */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--earth-200)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--earth-800)' }}>
          Create New Account
        </h3>
        <p style={{ color: 'var(--earth-600)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          You can have both a creator and an attendee account with the same email.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => createNewAccount('creator')}
            disabled={switching || accounts.some(acc => acc.role === 'creator')}
            style={{
              flex: 1,
              padding: '1rem',
              background: accounts.some(acc => acc.role === 'creator') ? 'var(--earth-100)' : 'var(--earth-600)',
              color: accounts.some(acc => acc.role === 'creator') ? 'var(--earth-400)' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: accounts.some(acc => acc.role === 'creator') || switching ? 'not-allowed' : 'pointer',
              opacity: accounts.some(acc => acc.role === 'creator') ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <SparklesIcon style={{ width: '1.25rem' }} />
            Create Creator Account
          </button>
          <button
            onClick={() => createNewAccount('eventee')}
            disabled={switching || accounts.some(acc => acc.role === 'eventee')}
            style={{
              flex: 1,
              padding: '1rem',
              background: accounts.some(acc => acc.role === 'eventee') ? 'var(--earth-100)' : 'var(--sage-600)',
              color: accounts.some(acc => acc.role === 'eventee') ? 'var(--earth-400)' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: accounts.some(acc => acc.role === 'eventee') || switching ? 'not-allowed' : 'pointer',
              opacity: accounts.some(acc => acc.role === 'eventee') ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <UserCircleIcon style={{ width: '1.25rem' }} />
            Create Attendee Account
          </button>
        </div>
      </div>
    </div>
  );
}