import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  TicketIcon, 
  QrCodeIcon, 
  ChartBarIcon,
  UserGroupIcon,
  CreditCardIcon,
  BellIcon,
  ShareIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaGithub 
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(0);
  
  const partners = [
    { name: 'Paystack', logo: 'https://cdn.worldvectorlogo.com/logos/paystack-2.svg' },
    { name: 'Cloudinary', logo: 'https://cdn.worldvectorlogo.com/logos/cloudinary-2.svg' },
    { name: 'MongoDB', logo: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg' },
    { name: 'Redis', logo: 'https://cdn.worldvectorlogo.com/logos/redis.svg' },
    { name: 'Render', logo: 'https://cdn.worldvectorlogo.com/logos/render.svg' },
    { name: 'Vite', logo: 'https://cdn.worldvectorlogo.com/logos/vitejs.svg' },
  ];

  // Auto-slide partners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPartner((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const tools = [
    {
      icon: '🎪',
      title: 'Event Management',
      description: 'Create, manage, and publish events with ease. Set ticket prices, capacity, and event details.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: '🎟️',
      title: 'Ticket Sales',
      description: 'Sell tickets securely with Paystack integration. Track sales in real-time.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: '📱',
      title: 'QR Code Check-in',
      description: 'Generate unique QR codes for every ticket. Scan and verify at the door instantly.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track attendance, revenue, and event performance with beautiful charts.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '👥',
      title: 'Attendee Management',
      description: 'View and manage all attendees. Send notifications and updates.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Process payments securely with Paystack. Multiple payment methods supported.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔔',
      title: 'Automated Reminders',
      description: 'Send automatic reminders to attendees before events start.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '📤',
      title: 'Social Sharing',
      description: 'Share events on social media with one click. Increase your reach.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Account',
      description: 'Sign up as an event creator or attendee in seconds. No credit card required.',
      icon: '📝'
    },
    {
      step: '2',
      title: 'Create or Explore Events',
      description: 'Creators can set up events with details, pricing, and images. Attendees can browse and discover.',
      icon: '🔍'
    },
    {
      step: '3',
      title: 'Get Your Tickets',
      description: 'Purchase tickets securely and receive instant QR codes via email.',
      icon: '🎟️'
    },
    {
      step: '4',
      title: 'Attend & Enjoy',
      description: 'Scan your QR code at the event for quick check-in. Share your experience!',
      icon: '🎉'
    }
  ];

  const footerLinks = {
    product: ['Features', 'Pricing', 'FAQ', 'Blog'],
    company: ['About Us', 'Careers', 'Press', 'Contact'],
    legal: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Security'],
    support: ['Help Center', 'Documentation', 'API Status', 'Community']
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    
    try {
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      setSubscribed(true);
      setEmail('');
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={{
        background: 'var(--earth-800)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>🎭</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Alaya Eventful</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--earth-200)', textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--earth-200)', textDecoration: 'none' }}>How It Works</a>
          <a href="#partners" style={{ color: 'var(--earth-200)', textDecoration: 'none' }}>Partners</a>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{
              padding: '0.5rem 1.5rem',
              background: 'var(--earth-600)',
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
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <h1 className="hero-title">
          Your Gateway to <span style={{ color: 'var(--earth-300)' }}>Islamic Events</span> 🕌
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          maxWidth: '700px', 
          margin: '0 auto 2rem', 
          color: 'var(--earth-200)',
          lineHeight: '1.8'
        }}>
          Discover, book, and experience the best Islamic events, lectures, and gatherings in your community. 
          From Ramadan markets to educational seminars, we bring the Ummah together.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn" style={{
            background: 'var(--earth-500)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            padding: '1rem 2rem'
          }}>Get Started →</Link>
          <a href="#features" className="btn" style={{
            background: 'transparent',
            border: '2px solid var(--earth-400)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            padding: '1rem 2rem'
          }}>Learn More</a>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: 'var(--earth-800)',
            marginBottom: '1rem'
          }}>
            Everything You Need to Run <span style={{ color: 'var(--earth-600)' }}>Successful Events</span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--earth-600)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Powerful tools designed to make event management seamless, from creation to check-in.
          </p>
        </div>

        <div className="features-grid">
          {tools.map((tool, index) => (
            <div key={index} className="feature-card">
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>
                {tool.icon}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--earth-800)' }}>
                {tool.title}
              </h3>
              <p style={{ color: 'var(--earth-600)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" style={{
        background: 'linear-gradient(135deg, var(--earth-50), var(--earth-100))',
        padding: '5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'var(--earth-800)',
              marginBottom: '1rem'
            }}>
              Get Started in <span style={{ color: 'var(--earth-600)' }}>Four Simple Steps</span>
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--earth-600)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Whether you're organizing or attending, Eventful makes it easy.
            </p>
          </div>

          <div className="how-it-works-grid">
            {howItWorks.map((step, index) => (
              <div key={index} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  background: 'var(--earth-600)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 1.5rem',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {step.icon}
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="step-connector" />
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--earth-800)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--earth-600)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-800), var(--earth-900))',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ fontSize: '1.125rem', color: 'var(--earth-300)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join thousands of event organizers and attendees who trust Eventful for their Islamic events.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn" style={{
            padding: '1rem 2.5rem',
            background: 'var(--earth-500)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}>Create Your Account</Link>
          <Link to="/app/events" className="btn" style={{
            padding: '1rem 2.5rem',
            background: 'transparent',
            border: '2px solid var(--earth-400)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '1.125rem',
            fontWeight: 'bold'
          }}>Browse Events</Link>
        </div>
      </div>

      {/* Partners Sliding Section */}
      <div id="partners" style={{ padding: '4rem 2rem', background: 'white', overflow: 'hidden' }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2rem', 
          fontWeight: '600', 
          color: 'var(--earth-800)',
          marginBottom: '3rem'
        }}>
          Trusted By Industry Leaders
        </h2>
        
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '2rem 0'
        }}>
          <div style={{
            display: 'flex',
            gap: '4rem',
            animation: 'slide 20s linear infinite',
            width: 'fit-content'
          }}>
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '150px'
                }}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  style={{ 
                    height: '40px', 
                    width: 'auto',
                    filter: 'grayscale(100%)',
                    opacity: '0.7',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(100%)';
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--earth-900)',
        color: 'white',
        padding: '4rem 2rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Newsletter Signup */}
          <div style={{
            background: 'var(--earth-800)',
            borderRadius: '16px',
            padding: '3rem',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Subscribe to Our Newsletter
            </h3>
            <p style={{ color: 'var(--earth-300)', marginBottom: '2rem' }}>
              Get the latest updates on events and features
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexDirection: 'column' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--earth-600)',
                  background: 'var(--earth-700)',
                  color: 'white'
                }}
              />
              <button 
                type="submit"
                disabled={subscribing}
                style={{
                  padding: '1rem 2rem',
                  background: 'var(--earth-500)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: subscribing ? 'not-allowed' : 'pointer',
                  opacity: subscribing ? 0.7 : 1
                }}
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {footerLinks.product.map((link, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--earth-300)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {footerLinks.company.map((link, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--earth-300)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {footerLinks.legal.map((link, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--earth-300)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {footerLinks.support.map((link, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--earth-300)', textDecoration: 'none' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Social */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '2rem',
            borderTop: '1px solid var(--earth-700)',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EnvelopeIcon style={{ width: '1.25rem', color: 'var(--earth-400)' }} />
                <span style={{ color: 'var(--earth-300)' }}>support@alayaeventful.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneIcon style={{ width: '1.25rem', color: 'var(--earth-400)' }} />
                <span style={{ color: 'var(--earth-300)' }}>+234 800 123 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPinIcon style={{ width: '1.25rem', color: 'var(--earth-400)' }} />
                <span style={{ color: 'var(--earth-300)' }}>Lagos, Nigeria</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaTwitter size={24} />
              </a>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaFacebook size={24} />
              </a>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaInstagram size={24} />
              </a>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaLinkedin size={24} />
              </a>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaYoutube size={24} />
              </a>
              <a href="#" style={{ color: 'var(--earth-300)', transition: 'color 0.3s' }}>
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Signature */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--earth-800)',
            color: 'var(--earth-400)',
            fontSize: '0.875rem'
          }}>
            Built with ❤️ by Alaya Ibrahim @ AltSchool Africa
          </div>
        </div>
      </footer>
    </div>
  );
}