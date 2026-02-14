import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        <GlobeAltIcon style={{ width: '1.25rem' }} />
        <span>{i18n.language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.5rem',
          zIndex: 50,
          minWidth: '120px'
        }}>
          <button
            onClick={() => changeLanguage('en')}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => changeLanguage('ha')}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            🇳🇬 Hausa
          </button>
          <button
            onClick={() => changeLanguage('yo')}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            🇳🇬 Yorùbá
          </button>
        </div>
      )}
    </div>
  );
}