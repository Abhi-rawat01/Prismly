import React, { useEffect, useRef } from 'react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Modal that adapts presentation based on device
 */
const AdaptiveModal = ({ 
  isOpen,
  onClose,
  children,
  title,
  className = ''
}) => {
  const { isMobile, isTouch } = useResponsive();
  const modalRef = useRef(null);
  const startY = useRef(0);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle swipe to close on touch devices
  useEffect(() => {
    if (!isTouch() || !isOpen) return;

    const handleTouchStart = (e) => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      // Swipe down to close
      if (diff > 100) {
        onClose();
      }
    };

    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener('touchstart', handleTouchStart);
      modal.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (modal) {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isTouch, isOpen, onClose]);

  if (!isOpen) return null;

  const backdropStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: isMobile() ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 1300,
    animation: 'fadeIn 0.2s ease',
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: isMobile() ? '1rem 1rem 0 0' : '1rem',
    width: isMobile() ? '100%' : '90%',
    maxWidth: isMobile() ? '100%' : '600px',
    maxHeight: isMobile() ? '90vh' : '80vh',
    overflow: 'auto',
    position: 'relative',
    animation: isMobile() ? 'slideUp 0.3s ease' : 'scaleIn 0.2s ease',
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div 
        style={backdropStyle}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          ref={modalRef}
          style={modalStyle}
          className={className}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {title && (
            <div style={{ 
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 id="modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  minWidth: isTouch() ? '44px' : 'auto',
                  minHeight: isTouch() ? '44px' : 'auto',
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          )}
          <div style={{ padding: '1.5rem' }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdaptiveModal;
