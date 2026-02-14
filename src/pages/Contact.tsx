import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { EnvelopeIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post(`${API_URL}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', color: 'var(--earth-200)' }}>
          Have questions about an event? Need help with your account? We're here for you.
        </p>
      </div>

      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Contact Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--earth-800)' }}>
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="">Select a topic</option>
                  <option value="event">Event Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Issue</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Please describe your question or concern in detail..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  padding: '1rem',
                  background: 'var(--earth-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.7 : 1
                }}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{
            background: 'linear-gradient(135deg, var(--earth-50), var(--earth-100))',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--earth-800)' }}>
              Other Ways to Reach Us
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'var(--earth-200)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <EnvelopeIcon style={{ width: '1.5rem', color: 'var(--earth-700)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Email</h3>
                  <p style={{ color: 'var(--earth-600)' }}>support@alayaeventful.com</p>
                  <p style={{ color: 'var(--earth-600)' }}>info@alayaeventful.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'var(--earth-200)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PhoneIcon style={{ width: '1.5rem', color: 'var(--earth-700)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Phone</h3>
                  <p style={{ color: 'var(--earth-600)' }}>+234 800 123 4567</p>
                  <p style={{ color: 'var(--earth-600)' }}>+234 800 765 4321</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'var(--earth-200)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserIcon style={{ width: '1.5rem', color: 'var(--earth-700)' }} />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Office</h3>
                  <p style={{ color: 'var(--earth-600)' }}>123 Adeola Odeku Street</p>
                  <p style={{ color: 'var(--earth-600)' }}>Victoria Island, Lagos</p>
                  <p style={{ color: 'var(--earth-600)' }}>Nigeria</p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'white',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Response Time</h3>
              <p style={{ color: 'var(--earth-600)' }}>
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}