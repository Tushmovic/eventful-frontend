import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
// import { useTheme } from '../context/ThemeContext'; // Comment out until ThemeContext is created

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // const { theme, toggleTheme } = useTheme(); // Comment out until ThemeContext is created
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Temporary theme state
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
    }}>
      {/* Top Bar */}
      <div style={{
        background: scrolled ? 'var(--earth-800)' : 'var(--earth-800)',
        color: 'white',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Logo and Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        {/* Desktop Navigation - Using media query in a style tag approach */}
        <div style={{
          display: 'none',
          gap: '2rem',
          alignItems: 'center'
        }} className="desktop-nav">
          <Link to="/" style={{ color: 'var(--earth-200)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HomeIcon style={{ width: '1.25rem' }} />
            <span>Home</span>
          </Link>
          
          <Link to="/events" style={{ color: 'var(--earth-200)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MagnifyingGlassIcon style={{ width: '1.25rem' }} />
            <span>Browse Events</span>
          </Link>
          
          <Link to="/contact" style={{ color: 'var(--earth-200)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <EnvelopeIcon style={{ width: '1.25rem' }} />
            <span>Contact</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {theme === 'dark' ? <SunIcon style={{ width: '1.25rem' }} /> : <MoonIcon style={{ width: '1.25rem' }} />}
          </button>

          <Link to="/login" style={{
            padding: '0.4rem 1rem',
            background: 'transparent',
            border: '1px solid var(--earth-300)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Login
          </Link>
          
          <Link to="/register" style={{
            padding: '0.4rem 1rem',
            background: 'var(--earth-500)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--earth-700)',
          borderTop: '1px solid var(--earth-600)',
          padding: '1rem',
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--earth-200)',
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <HomeIcon style={{ width: '1.25rem' }} />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/events" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--earth-200)',
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <MagnifyingGlassIcon style={{ width: '1.25rem' }} />
              <span>Browse Events</span>
            </Link>
            
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--earth-200)',
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <EnvelopeIcon style={{ width: '1.25rem' }} />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      )}

      {/* Add CSS for desktop navigation */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}