import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';

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
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowUrlInput(false);
      setImageUrl('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleUrlSubmit = async () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
      setImageFile(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setShowUrlInput(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create event - send price in kobo (multiply Naira amount by 100)
      const eventResponse = await axios.post(
        `${API_URL}/events`,
        {
          ...formData,
          ticketPrice: Math.round(formData.ticketPrice * 100)
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
      } else if (imagePreview && imageUrl) {
        // If using URL, we need to download and upload or save URL directly
        // For now, we'll assume the backend handles URL images
        await axios.post(
          `${API_URL}/events/${eventId}/images`,
          { imageUrl },
          { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--earth-800)', marginBottom: '0.5rem' }}>
          🎪 Create New Event
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--earth-600)' }}>
          Fill in the details below to create your event
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Image Upload Section - Professional Drag & Drop */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--earth-800)' }}>
              📸 Event Image
            </h3>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--earth-100)',
                border: '1px solid var(--earth-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <LinkIcon style={{ width: '1rem' }} />
              {showUrlInput ? 'Use File Upload' : 'Use Image URL'}
            </button>
          </div>

          {!showUrlInput ? (
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--earth-600)' : 'var(--earth-300)'}`,
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                background: isDragActive ? 'var(--earth-50)' : imagePreview ? 'none' : 'var(--earth-50)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative'
              }}
            >
              <input {...getInputProps()} />
              
              {imagePreview ? (
                <div>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid var(--earth-300)',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <XMarkIcon style={{ width: '1.25rem' }} />
                  </button>
                </div>
              ) : (
                <div>
                  <CloudArrowUpIcon style={{ width: '3rem', height: '3rem', color: 'var(--earth-400)', margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '1.125rem', color: 'var(--earth-700)', marginBottom: '0.5rem' }}>
                    {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                  </p>
                  <p style={{ color: 'var(--earth-500)' }}>or click to browse</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--earth-400)', marginTop: '1rem' }}>
                    Supports: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              border: '2px solid var(--earth-300)',
              borderRadius: '12px',
              padding: '2rem',
              background: 'var(--earth-50)'
            }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Image URL
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--earth-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Load
                </button>
              </div>
              {imagePreview && imageUrl && (
                <div style={{ marginTop: '1rem', position: 'relative' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      padding: '0.25rem',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid var(--earth-300)',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    <XMarkIcon style={{ width: '1rem' }} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event Information */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--earth-800)' }}>
            📋 Event Information
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Ramadan Night Market 2026"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Tell people about your event..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
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
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--earth-800)' }}>
            📍 Location Details
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Venue Name
              </label>
              <input
                type="text"
                name="location.venue"
                value={formData.location.venue}
                onChange={handleChange}
                required
                placeholder="e.g., Lagos Central Mosque"
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
                Address
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                placeholder="Street address"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  placeholder="Lagos"
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
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  required
                  placeholder="Lagos"
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
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                  placeholder="Nigeria"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ticket & Pricing */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--earth-800)' }}>
            🎫 Ticket & Pricing
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Ticket Price (₦)
              </label>
              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                required
                min="0"
                placeholder="5000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <small style={{ color: 'var(--earth-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Enter price in Naira (e.g., 5000 for ₦5,000)
              </small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Total Tickets
              </label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                required
                min="1"
                placeholder="100"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Organizer Information */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--earth-800)' }}>
            📞 Organizer Information
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Organizer Name
              </label>
              <input
                type="text"
                name="organizer.name"
                value={formData.organizer.name}
                onChange={handleChange}
                required
                placeholder="Your name or company"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Organizer Email
                </label>
                <input
                  type="email"
                  name="organizer.email"
                  value={formData.organizer.email}
                  onChange={handleChange}
                  required
                  placeholder="contact@example.com"
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
                  Organizer Phone
                </label>
                <input
                  type="tel"
                  name="organizer.phone"
                  value={formData.organizer.phone}
                  onChange={handleChange}
                  required
                  placeholder="08012345678"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--earth-300)',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/app/events')}
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              background: 'white',
              border: '1px solid var(--earth-300)',
              borderRadius: '8px',
              color: 'var(--earth-700)',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--earth-600)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Event 🎉'}
          </button>
        </div>
      </form>
    </div>
  );
}