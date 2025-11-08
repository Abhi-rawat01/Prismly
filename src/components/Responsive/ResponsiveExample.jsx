import React, { useState } from 'react';
import { useResponsive, useBreakpoint } from '../../hooks';
import { AdaptiveGrid, AdaptiveText, AdaptiveStack, AdaptiveModal } from './index';

/**
 * Example component demonstrating responsive features
 * This can be used as a reference or removed in production
 */
const ResponsiveExample = () => {
  const { 
    viewport, 
    device, 
    orientation,
    isMobile,
    isTouch,
    networkSpeed,
    shouldUseSimplifiedUI 
  } = useResponsive();
  
  const breakpoint = useBreakpoint();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <AdaptiveText variant="h1" as="h1">
        Responsive System Demo
      </AdaptiveText>

      {/* Device Info Card */}
      <div style={{ 
        background: '#f3f4f6', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginTop: '1rem'
      }}>
        <AdaptiveText variant="h3" as="h2">
          Current Device Info
        </AdaptiveText>
        <ul style={{ marginTop: '1rem' }}>
          <li>Viewport: {viewport.width}x{viewport.height}</li>
          <li>Device: {device}</li>
          <li>Breakpoint: {breakpoint}</li>
          <li>Orientation: {orientation}</li>
          <li>Is Mobile: {isMobile() ? 'Yes' : 'No'}</li>
          <li>Is Touch: {isTouch() ? 'Yes' : 'No'}</li>
          <li>Network: {networkSpeed}</li>
          <li>Simplified UI: {shouldUseSimplifiedUI() ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      {/* Adaptive Stack Example */}
      <div style={{ marginTop: '2rem' }}>
        <AdaptiveText variant="h3" as="h2">
          Adaptive Stack (Column on mobile, Row on desktop)
        </AdaptiveText>
        <AdaptiveStack breakpoint="desktop" gap="1rem" style={{ marginTop: '1rem' }}>
          <div style={{ flex: 1, background: '#dbeafe', padding: '1rem', borderRadius: '0.5rem' }}>
            Box 1
          </div>
          <div style={{ flex: 1, background: '#fce7f3', padding: '1rem', borderRadius: '0.5rem' }}>
            Box 2
          </div>
          <div style={{ flex: 1, background: '#fef3c7', padding: '1rem', borderRadius: '0.5rem' }}>
            Box 3
          </div>
        </AdaptiveStack>
      </div>

      {/* Adaptive Grid Example */}
      <div style={{ marginTop: '2rem' }}>
        <AdaptiveText variant="h3" as="h2">
          Adaptive Grid (Auto-adjusts columns)
        </AdaptiveText>
        <AdaptiveGrid minCardWidth={200} gap="1rem" style={{ marginTop: '1rem' }}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div 
              key={num}
              style={{ 
                background: '#e0e7ff', 
                padding: '2rem', 
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}
            >
              Card {num}
            </div>
          ))}
        </AdaptiveGrid>
      </div>

      {/* Adaptive Modal Example */}
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            minHeight: isTouch() ? '44px' : 'auto',
          }}
        >
          Open Adaptive Modal
        </button>
      </div>

      <AdaptiveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Adaptive Modal"
      >
        <p>
          This modal adapts to your device:
        </p>
        <ul>
          <li>Mobile: Full-screen, slides up from bottom, swipe to close</li>
          <li>Tablet: 90% width, centered</li>
          <li>Desktop: Fixed width, centered, click outside to close</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Current device: <strong>{device}</strong>
        </p>
      </AdaptiveModal>

      {/* Responsive Text Examples */}
      <div style={{ marginTop: '2rem' }}>
        <AdaptiveText variant="h3" as="h2">
          Fluid Typography
        </AdaptiveText>
        <div style={{ marginTop: '1rem' }}>
          <AdaptiveText variant="h1">Heading 1 - Scales automatically</AdaptiveText>
          <AdaptiveText variant="h2">Heading 2 - Scales automatically</AdaptiveText>
          <AdaptiveText variant="body">
            Body text that scales smoothly between breakpoints without jumps.
            Resize your browser to see the effect.
          </AdaptiveText>
          <AdaptiveText variant="caption">
            Caption text - smaller but still readable
          </AdaptiveText>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveExample;
