import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  phoneNumber?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  eventsCreated?: any[];
  ticketsBought?: any[];
}

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bio: '',
    website: '',
    socialMedia: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name || '',
        phoneNumber: response.data.data.phoneNumber || '',
        bio: response.data.data.bio || '',
        website: response.data.data.website || '',
        socialMedia: response.data.data.socialMedia || {
          twitter: '',
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const cleanedData: any = {};
      
      if (formData.name !== profile?.name) {
        cleanedData.name = formData.name;
      }
      
      if (formData.phoneNumber !== profile?.phoneNumber) {
        cleanedData.phoneNumber = formData.phoneNumber || '';
      }
      
      if (formData.bio !== profile?.bio) {
        cleanedData.bio = formData.bio || '';
      }
      
      if (formData.website !== profile?.website) {
        cleanedData.website = formData.website || '';
      }
      
      const socialMedia: any = {};
      let hasSocialMedia = false;
      
      if (formData.socialMedia.twitter !== profile?.socialMedia?.twitter) {
        socialMedia.twitter = formData.socialMedia.twitter || '';
        hasSocialMedia = true;
      }
      if (formData.socialMedia.facebook !== profile?.socialMedia?.facebook) {
        socialMedia.facebook = formData.socialMedia.facebook || '';
        hasSocialMedia = true;
      }
      if (formData.socialMedia.instagram !== profile?.socialMedia?.instagram) {
        socialMedia.instagram = formData.socialMedia.instagram || '';
        hasSocialMedia = true;
      }
      if (formData.socialMedia.linkedin !== profile?.socialMedia?.linkedin) {
        socialMedia.linkedin = formData.socialMedia.linkedin || '';
        hasSocialMedia = true;
      }
      
      if (hasSocialMedia) {
        cleanedData.socialMedia = socialMedia;
      }

      if (Object.keys(cleanedData).length === 0) {
        toast.success('No changes to save');
        setEditing(false);
        return;
      }

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        cleanedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProfile(response.data.data);
      if (user && response.data.data.name) {
        updateUser({ ...user, name: response.data.data.name });
      }
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleImageUploadSuccess = (imageUrl: string) => {
    if (profile) {
      setProfile({ ...profile, profileImage: imageUrl });
      if (user) {
        updateUser({ ...user, profileImage: imageUrl });
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎭</div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Profile not found</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--earth-700), var(--earth-900))',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <ProfilePictureUpload
            currentImage={profile.profileImage}
            onUploadSuccess={handleImageUploadSuccess}
            token={token || ''}
          />
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {profile.name}
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--earth-200)' }}>
              {profile.role === 'creator' ? '🎪 Event Creator' : '🎟️ Event Attendee'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--earth-300)', marginTop: '0.5rem' }}>
              Member since {new Date(profile._id.substring(0, 8)).toLocaleDateString()}
            </p>
          </div>
          
          <button
            onClick={() => setEditing(!editing)}
            style={{
              padding: '0.5rem 1rem',
              background: editing ? 'var(--earth-600)' : 'white',
              color: editing ? 'white' : 'var(--earth-800)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {editing ? <XMarkIcon style={{ width: '1.25rem' }} /> : <PencilIcon style={{ width: '1.25rem' }} />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {editing ? (
          // Edit Mode
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-control"
                placeholder="+234 800 000 0000"
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Bio
              </label>
              {/* 🔥 FIX: Bio textarea now matches Create Event description box */}
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={6}
                placeholder="Tell us about yourself..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--earth-300)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  minHeight: '150px',
                  backgroundColor: 'var(--cream)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--sage-500)';
                  e.target.style.boxShadow = '0 0 0 3px var(--sage-100)';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--earth-300)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = 'var(--cream)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://example.com"
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
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Social Media Links
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Twitter</label>
                  <input
                    type="url"
                    value={formData.socialMedia?.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    className="form-control"
                    placeholder="https://twitter.com/username"
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
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Facebook</label>
                  <input
                    type="url"
                    value={formData.socialMedia?.facebook}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="form-control"
                    placeholder="https://facebook.com/username"
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
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Instagram</label>
                  <input
                    type="url"
                    value={formData.socialMedia?.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="form-control"
                    placeholder="https://instagram.com/username"
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
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialMedia?.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    className="form-control"
                    placeholder="https://linkedin.com/in/username"
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

            <button
              onClick={handleSubmit}
              style={{
                padding: '1rem',
                background: 'var(--earth-600)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--earth-700)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--earth-600)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <CheckIcon style={{ width: '1.25rem' }} />
              Save Changes
            </button>
          </div>
        ) : (
          // View Mode
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <UserIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                  <span style={{ fontWeight: '600' }}>Full Name</span>
                </div>
                <p style={{ color: 'var(--earth-700)' }}>{profile.name}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <EnvelopeIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                  <span style={{ fontWeight: '600' }}>Email</span>
                </div>
                <p style={{ color: 'var(--earth-700)' }}>{profile.email}</p>
              </div>

              {profile.phoneNumber && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <PhoneIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                    <span style={{ fontWeight: '600' }}>Phone</span>
                  </div>
                  <p style={{ color: 'var(--earth-700)' }}>{profile.phoneNumber}</p>
                </div>
              )}

              {profile.website && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <GlobeAltIcon style={{ width: '1.25rem', color: 'var(--earth-500)' }} />
                    <span style={{ fontWeight: '600' }}>Website</span>
                  </div>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--earth-600)' }}
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>

            {profile.bio && (
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>About</h3>
                <p style={{ 
                  color: 'var(--earth-700)', 
                  lineHeight: '1.8',
                  padding: '1rem',
                  background: 'var(--earth-50)',
                  borderRadius: '8px',
                  border: '1px solid var(--earth-200)'
                }}>{profile.bio}</p>
              </div>
            )}

            {profile.socialMedia && Object.values(profile.socialMedia).some(v => v) && (
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Social Media</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {profile.socialMedia.twitter && (
                    <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>🐦 Twitter</a>
                  )}
                  {profile.socialMedia.facebook && (
                    <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2' }}>📘 Facebook</a>
                  )}
                  {profile.socialMedia.instagram && (
                    <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#E4405F' }}>📷 Instagram</a>
                  )}
                  {profile.socialMedia.linkedin && (
                    <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2' }}>🔗 LinkedIn</a>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'var(--earth-50)',
              borderRadius: '12px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-700)' }}>
                  {profile.eventsCreated?.length || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--earth-600)' }}>Events Created</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--earth-700)' }}>
                  {profile.ticketsBought?.length || 0}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--earth-600)' }}>Tickets Purchased</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}