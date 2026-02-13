import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const CATEGORIES = [
  'Religious', 'Education', 'Family', 'Charity', 'Youth',
  'Arts & Culture', 'Networking', 'Food & Drink', 'Music',
  'Technology', 'Sports', 'Business', 'Health & Wellness', 'Comedy'
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Religious',
    date: '',
    startTime: '10:00',
    endTime: '18:00',
    location: {
      venue: '',
      address: '',
      city: '',
      state: '',
      country: 'Nigeria'
    },
    organizer: {
      name: '',
      email: '',
      phone: ''
    },
    ticketPrice: 0,
    totalTickets: 100,
    status: 'published'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as any),
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create event - send price as Naira (backend will convert to kobo)
      const eventResponse = await axios.post(
        `${API_URL}/events`,
        {
          ...formData,
          ticketPrice: formData.ticketPrice // User enters 5000, backend stores as 500000
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const eventId = eventResponse.data.data._id;

      // Upload image if selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('images', imageFile);
        
        await axios.post(
          `${API_URL}/events/${eventId}/images`,
          imageFormData,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
      }
      
      toast.success('Event created successfully! 🎉');
      navigate('/app/events');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--secondary-900)', marginBottom: '0.5rem' }}>
            🎪 Create New Event
          </h1>
          <p style={{ color: 'var(--secondary-600)' }}>
            Fill in the details below to create your event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          {/* Image Upload Section */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-700)' }}>
              📸 Event Image
            </h3>
            
            <div style={{
              border: '2px dashed var(--earth-300)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: imagePreview ? 'none' : 'var(--earth-50)'
            }}>
              {imagePreview ? (
                <div>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    style={{ 
                      padding: '0.5rem 1rem',
                      background: 'var(--earth-100)',
                      border: '1px solid var(--earth-300)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                    <p style={{ color: 'var(--earth-600)' }}>Click to upload an event image</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--earth-400)' }}>PNG, JPG up to 5MB</p>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Event Information */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-700)' }}>
              📋 Event Information
            </h3>
            
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Ramadan Night Market 2026"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Tell people about your event..."
                rows={5}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className="form-control"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className="form-control"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-700)' }}>
              📍 Location Details
            </h3>

            <div className="form-group">
              <label>Venue Name</label>
              <input
                type="text"
                name="location.venue"
                className="form-control"
                value={formData.location.venue}
                onChange={handleChange}
                required
                placeholder="e.g., Lagos Central Mosque"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="location.address"
                className="form-control"
                value={formData.location.address}
                onChange={handleChange}
                required
                placeholder="Street address"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  className="form-control"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  placeholder="Lagos"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="location.state"
                  className="form-control"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  placeholder="Lagos"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="location.country"
                  className="form-control"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                  placeholder="Nigeria"
                />
              </div>
            </div>
          </div>

          {/* Ticket & Pricing */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-700)' }}>
              🎫 Ticket & Pricing
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Ticket Price (₦)</label>
                <input
                  type="number"
                  name="ticketPrice"
                  className="form-control"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="5000"
                />
                <small style={{ color: 'var(--earth-500)', fontSize: '0.75rem' }}>
                  Enter price in Naira (e.g., 5000 for ₦5,000)
                </small>
              </div>

              <div className="form-group">
                <label>Total Tickets</label>
                <input
                  type="number"
                  name="totalTickets"
                  className="form-control"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-700)' }}>
              📞 Organizer Information
            </h3>

            <div className="form-group">
              <label>Organizer Name</label>
              <input
                type="text"
                name="organizer.name"
                className="form-control"
                value={formData.organizer.name}
                onChange={handleChange}
                required
                placeholder="Your name or company"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Organizer Email</label>
                <input
                  type="email"
                  name="organizer.email"
                  className="form-control"
                  value={formData.organizer.email}
                  onChange={handleChange}
                  required
                  placeholder="contact@example.com"
                />
              </div>

              <div className="form-group">
                <label>Organizer Phone</label>
                <input
                  type="tel"
                  name="organizer.phone"
                  className="form-control"
                  value={formData.organizer.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/app/events')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event 🎉'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}