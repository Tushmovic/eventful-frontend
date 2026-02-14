import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  TicketIcon, 
  PlusCircleIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}>
        {/* Top Bar with Logo and Auth Buttons */}
        <div style={{
          background: scrolled ? 'var(--earth-800)' : 'var(--earth-800)',
          color: 'white',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleMobileMenu}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? (
                <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
              ) : (
                <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} />
              )}
            </button>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>🎭</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>Alaya Eventful</span>
            </Link>
          </div>
          
          {/* Auth Buttons - Always Visible on Scroll */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link 
              to="/login" 
              style={{
                padding: '0.4rem 1rem',
                background: scrolled ? 'var(--earth-600)' : 'transparent',
                border: '1px solid var(--earth-300)',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                padding: '0.4rem 1rem',
                background: 'var(--earth-500)',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--earth-700)',
            borderTop: '1px solid var(--earth-600)',
            padding: '1rem',
            animation: 'slideDown 0.3s ease'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href="#features" 
                onClick={closeMobileMenu}
                style={{
                  color: 'var(--earth-200)',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-600)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={closeMobileMenu}
                style={{
                  color: 'var(--earth-200)',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-600)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                How It Works
              </a>
              <a 
                href="#partners" 
                onClick={closeMobileMenu}
                style={{
                  color: 'var(--earth-200)',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--earth-600)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Partners
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar for Authenticated Users */}
      {user && (
        <>
          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div
              onClick={closeMobileMenu}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 45
              }}
            />
          )}

          {/* Sidebar - Desktop & Mobile */}
          <aside style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: mobileMenuOpen ? '280px' : '0',
            background: 'var(--earth-800)',
            color: 'white',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: mobileMenuOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
          }}>
            <div style={{
              padding: '2rem 1rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '280px'
            }}>
              {/* Logo */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '2rem',
                padding: '0 1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>🎭</span>
                <div>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '1.25rem',
                    color: 'var(--earth-200)'
                  }}>
                    Alaya
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: 'var(--earth-400)'
                  }}>
                    Eventful
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div style={{
                background: 'var(--earth-700)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{ fontWeight: '600', color: 'white' }}>{user?.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--earth-300)' }}>
                  {user?.role === 'creator' ? '🎪 Event Creator' : '🎟️ Event Attendee'}
                </div>
              </div>

              {/* Navigation */}
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link 
                  to="/app/dashboard" 
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--earth-200)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--earth-700)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--earth-200)';
                  }}
                >
                  <HomeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/app/events" 
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--earth-200)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--earth-700)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--earth-200)';
                  }}
                >
                  <CalendarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>Events</span>
                </Link>

                <Link 
                  to="/app/my-tickets" 
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    color: 'var(--earth-200)',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--earth-700)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--earth-200)';
                  }}
                >
                  <TicketIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                  <span>My Tickets</span>
                </Link>

                {user?.role === 'creator' && (
                  <>
                    <Link 
                      to="/app/create-event" 
                      onClick={closeMobileMenu}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'var(--earth-200)',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--earth-700)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--earth-200)';
                      }}
                    >
                      <PlusCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Create Event</span>
                    </Link>

                    <Link 
                      to="/app/analytics" 
                      onClick={closeMobileMenu}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: 'var(--earth-200)',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--earth-700)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--earth-200)';
                      }}
                    >
                      <ChartBarIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span>Analytics</span>
                    </Link>
                  </>
                )}
              </nav>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--earth-700)',
                  border: 'none',
                  color: 'var(--earth-200)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '2rem',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--earth-700)';
                  e.currentTarget.style.color = 'var(--earth-200)';
                }}
              >
                <ArrowRightOnRectangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main style={{ 
        padding: '1rem',
        transition: 'margin-left 0.3s ease',
        marginLeft: 0
      }}>
        <Outlet />
      </main>
    </div>
  );
}