import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function RefundPolicy() {
  const { eventId } = useParams();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // For general refund policy (no event ID)
  const generalPolicy = {
    fullRefundDeadline: '7 days before event',
    halfRefundDeadline: '3 days before event',
    quarterRefundDeadline: '1 day before event',
    policy: `
      Full refund until 7 days before event
      50% refund until 3 days before event
      25% refund until 1 day before event
      No refunds within 24 hours of event
    `,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '1rem' }}>
          Refund Policy
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666' }}>
          Our commitment to fair and transparent refunds
        </p>
      </div>

      {/* Policy Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <ClockIcon style={{ width: '2rem', height: '2rem', color: 'var(--earth-600)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full Refund</h3>
          <p style={{ color: '#666' }}>Up to {generalPolicy.fullRefundDeadline}</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <ClockIcon style={{ width: '2rem', height: '2rem', color: 'var(--earth-600)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>50% Refund</h3>
          <p style={{ color: '#666' }}>Up to {generalPolicy.halfRefundDeadline}</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <ClockIcon style={{ width: '2rem', height: '2rem', color: 'var(--earth-600)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>25% Refund</h3>
          <p style={{ color: '#666' }}>Up to {generalPolicy.quarterRefundDeadline}</p>
        </div>
      </div>

      {/* Detailed Policy */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Detailed Refund Policy</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Full Refund Period</h3>
              <p style={{ color: '#666' }}>Cancel up to 7 days before the event for a 100% refund</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Partial Refund Period</h3>
              <p style={{ color: '#666' }}>Cancel between 3-7 days before the event for a 50% refund</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Limited Refund Period</h3>
              <p style={{ color: '#666' }}>Cancel between 1-3 days before the event for a 25% refund</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <XCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#ef4444', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No Refund Period</h3>
              <p style={{ color: '#666' }}>No refunds within 24 hours of the event start time</p>
            </div>
          </div>
        </div>

        {/* Event Cancellation by Organizer */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '8px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Event Cancellation by Organizer</h3>
          <p style={{ color: '#666' }}>
            If an event is cancelled by the organizer, you will receive a 100% refund to your wallet automatically within 24 hours.
          </p>
        </div>

        {/* How to Request a Refund */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>How to Request a Refund</h3>
          <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', color: '#666' }}>
            <li style={{ marginBottom: '0.5rem' }}>Go to "My Tickets" in your dashboard</li>
            <li style={{ marginBottom: '0.5rem' }}>Find the ticket you want to refund</li>
            <li style={{ marginBottom: '0.5rem' }}>Click on "Request Refund"</li>
            <li style={{ marginBottom: '0.5rem' }}>Confirm your request</li>
          </ol>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Refunds will be processed within 3-5 business days and credited to your Eventful wallet.
          </p>
        </div>
      </div>
    </div>
  );
}