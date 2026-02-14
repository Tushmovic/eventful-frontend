import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CameraIcon } from '@heroicons/react/24/outline';

interface ProfilePictureUploadProps {
  currentImage: string;
  onUploadSuccess: (imageUrl: string) => void;
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function ProfilePictureUpload({ currentImage, onUploadSuccess, token }: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await axios.post(
        `${API_URL}/auth/profile/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Profile picture updated!');
        onUploadSuccess(response.data.data.profileImage);
        setPreview(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid var(--earth-300)',
        position: 'relative',
        cursor: 'pointer'
      }}>
        <img
          src={preview || currentImage}
          alt="Profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        <label
          htmlFor="profile-upload"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '0.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
          }}
        >
          <CameraIcon style={{ width: '1.25rem', height: '1.25rem', margin: '0 auto' }} />
        </label>
        
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>
      
      {uploading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.9)',
          padding: '0.5rem',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--earth-600)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
    </div>
  );
}