import { XMarkIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
  isDeleting: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  isDeleting
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        position: 'relative',
        animation: 'slideUp 0.3s ease'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--earth-500)'
          }}
        >
          <XMarkIcon style={{ width: '1.5rem' }} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🗑️</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--earth-800)' }}>
            Delete Event
          </h2>

          <p style={{ color: 'var(--earth-600)', marginBottom: '1.5rem' }}>
            Are you sure you want to delete <strong>"{eventTitle}"</strong>?
          </p>

          <p style={{
            fontSize: '0.875rem',
            color: '#dc2626',
            background: '#fee2e2',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            This action cannot be undone. All tickets for this event will be cancelled and refunds will be processed.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={onClose}
              disabled={isDeleting}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'white',
                border: '1px solid var(--earth-300)',
                borderRadius: '8px',
                color: 'var(--earth-700)',
                fontWeight: '600',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                opacity: isDeleting ? 0.5 : 1
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                opacity: isDeleting ? 0.5 : 1
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these animations to index.css
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;