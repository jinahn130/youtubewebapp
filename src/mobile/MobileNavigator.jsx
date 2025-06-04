import React from 'react';

function MobileNavigator({ currentView, setView }) {
  const options = [
    { label: 'Recents', key: 'recent' },
    { label: 'Extract', key: 'extract' },
    { label: 'Channels', key: 'channel' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #dee2e6',
        background: '#fff',
        padding: '0.5rem 0',
        fontSize: '0.9rem',
      }}
    >
      {options.map((opt) => (
        <div
          key={opt.key}
          onClick={() => setView(opt.key)}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: currentView === opt.key ? '#0d6efd' : '#f8f9fa',
            color: currentView === opt.key ? '#fff' : '#000',
            fontWeight: currentView === opt.key ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}

export default MobileNavigator;
