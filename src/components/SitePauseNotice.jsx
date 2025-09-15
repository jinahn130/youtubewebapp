import React from 'react';

function SitePauseNotice({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}
        >
          ⏸️
        </div>

        <h3
          style={{
            color: '#333',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}
        >
          Temporarily Paused
        </h3>

        <p
          style={{
            color: '#666',
            lineHeight: '1.6',
            marginBottom: '1.5rem',
            fontSize: '1rem',
          }}
        >
          We've temporarily stopped processing new videos due to LLM costs, but we'll be back soon!
          You can still browse our existing content from June to September 2025.
        </p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#0d6efd',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#0d6efd';
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default SitePauseNotice;