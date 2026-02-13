import { Link } from 'react-router-dom';
import { CalendarIcon, TicketIcon, QrCodeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={{
        background: 'var(--earth-800)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🎭</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Alaya Eventful</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{
            padding: '0.5rem 1.5rem',
            background: 'transparent',
            border: '1px solid var(--earth-300)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}>Login</Link>
          <Link to="/register" style={{
            padding: '0.5rem 1.5rem',
            background: 'var(--earth-600)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Your Gateway to Islamic Events 🕌
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--earth-200)' }}>
          Discover, book, and experience the best Islamic events, lectures, and gatherings in your community.
        </p>
        <Link to="/register" style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: 'var(--earth-500)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontSize: '1.125rem',
          fontWeight: 'bold'
        }}>Get Started →</Link>
      </div>

      {/* Features */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: 'var(--earth-800)' }}>
          Why Choose Alaya Eventful?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <CalendarIcon />, title: 'Discover Events', desc: 'Find upcoming Islamic events near you' },
            { icon: <TicketIcon />, title: 'Easy Booking', desc: 'Secure tickets with Paystack payments' },
            { icon: <QrCodeIcon />, title: 'QR Access', desc: 'Instant entry with digital QR tickets' },
            { icon: <ChartBarIcon />, title: 'For Organizers', desc: 'Track sales and attendance easily' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: 'var(--earth-600)' }}>
                {feature.icon}
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--earth-800)' }}>{feature.title}</h3>
              <p style={{ color: 'var(--earth-600)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}