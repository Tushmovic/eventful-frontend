import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    venue: string;
    city: string;
  };
  ticketPrice: number;
  availableTickets: number;
  totalTickets: number;
  category: string;
  images: string[];
  organizer: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function PublicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events`);
      setEvents(data.data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(events.map(e => e.category))];
  
  const filteredEvents = events
    .filter(e => selectedCategory === 'All' || e.category === selectedCategory)
    .filter(e => 
      searchTerm === '' || 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
        <h2>Loading amazing events...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Discover Islamic Events 🕌
        </h1>
        <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', color: 'var(--earth-200)' }}>
          Browse through upcoming Islamic events, lectures, and gatherings in your community
        </p>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--earth-300)',
              fontSize: '1rem',
              width: '100%'
            }}
          />
          
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: selectedCategory === category ? 'var(--earth-600)' : 'var(--earth-100)',
                  color: selectedCategory === category ? 'white' : 'var(--earth-700)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😢</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No events found</h3>
            <p style={{ color: 'var(--earth-600)' }}>Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="event-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: 'linear-gradient(135deg, var(--earth-100), var(--earth-200))',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      🕌
                    </div>
                  )}
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--earth-800)' }}>
                    {event.title}
                  </h3>
                  
                  <p style={{
                    color: 'var(--earth-600)',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CalendarIcon style={{ width: '1rem', color: 'var(--earth-500)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--earth-600)' }}>
                        {new Date(event.date).toLocaleDateString('en-NG', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <MapPinIcon style={{ width: '1rem', color: 'var(--earth-500)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--earth-600)' }}>
                        {event.location.venue}, {event.location.city}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CurrencyDollarIcon style={{ width: '1rem', color: 'var(--earth-500)' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--earth-700)' }}>
                        ₦{event.ticketPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--earth-50)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--earth-600)',
                    fontSize: '0.875rem'
                  }}>
                    {event.availableTickets} tickets left
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, var(--earth-50), var(--earth-100))',
          borderRadius: '16px'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--earth-800)' }}>
            Want to host your own events?
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--earth-600)', marginBottom: '2rem' }}>
            Join thousands of organizers who use Alaya Eventful to manage and sell tickets
          </p>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              textDecoration: 'none'
            }}
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  );
}