import React from 'react';
import { FaClock, FaChartLine, FaList } from 'react-icons/fa';

function MobileNavigator({ currentView, setView }) {
  const options = [
    { key: 'recent', label: 'Recents', icon: <FaClock size={18} /> },
    { key: 'extract', label: 'Extract', icon: <FaChartLine size={18} /> },
    { key: 'channel', label: 'Channels', icon: <FaList size={18} /> },
  ];

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 99,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #dee2e6',
        background: '#fff',
        padding: '0.5rem 0',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
        fontSize: '0.8rem',
        boxShadow: '0 -1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {options.map((opt) => {
        const isActive = currentView === opt.key;
        return (
          <div
            key={opt.key}
            onClick={() => setView(opt.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isActive ? '#0d6efd' : '#666',
              fontWeight: isActive ? 600 : 400,
              transition: 'color 0.2s ease',
              borderRadius: '12px',
              padding: '0.2rem 0.4rem',
            }}
          >
            {opt.icon}
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              {opt.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MobileNavigator;
