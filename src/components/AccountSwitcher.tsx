import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function AccountSwitcher() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [otherAccounts, setOtherAccounts] = useState<any[]>([]);

  const fetchOtherAccounts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/accounts/my-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOtherAccounts(data.data.filter((acc: any) => acc._id !== user?._id));
    } catch (error) {
      console.error('Failed to fetch accounts');
    }
  };

  const toggleDropdown = async () => {
    if (!isOpen) {
      await fetchOtherAccounts();
    }
    setIsOpen(!isOpen);
  };

  const switchToAccount = async (accountId: string, role: string) => {
    setSwitching(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/accounts/switch`,
        { accountId, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (user) {
        updateUser({ ...user, role: role as 'creator' | 'eventee' });
      }

      toast.success(`Switched to ${role} account`);
      setIsOpen(false);
      navigate('/app/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to switch account');
    } finally {
      setSwitching(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--earth-700)',
          border: 'none',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <img
          src={user.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
          alt={user.name}
          style={{
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <span style={{ fontSize: '0.875rem' }}>{user.role}</span>
        <ChevronDownIcon style={{ width: '1rem', marginLeft: 'auto' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--earth-200)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          {switching ? (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <ArrowPathIcon style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--earth-200)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)', marginBottom: '0.25rem' }}>Current</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={user.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
                    alt={user.name}
                    style={{ width: '2rem', height: '2rem', borderRadius: '50%' }}
                  />
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)' }}>{user.role}</p>
                  </div>
                </div>
              </div>

              {otherAccounts.length > 0 && (
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)', marginBottom: '0.5rem' }}>Switch to</p>
                  {otherAccounts.map(account => (
                    <button
                      key={account._id}
                      onClick={() => switchToAccount(account._id, account.role)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-50)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <img
                        src={account.profileImage || 'https://res.cloudinary.com/demo/image/upload/v1674576809/default-avatar.png'}
                        alt={account.name}
                        style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{account.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--earth-500)' }}>{account.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div style={{ padding: '0.75rem', borderTop: '1px solid var(--earth-200)' }}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/app/switch-account');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'var(--earth-100)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--earth-700)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Manage Accounts
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}