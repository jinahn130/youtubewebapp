import React from 'react';
import { MdHistory, MdBarChart, MdSubscriptions, MdInfo } from 'react-icons/md';

function MobileSidebar({ currentView, onSelectView }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '3rem',
        left: 0,
        width: '100vw',
        background: '#fff',
        zIndex: 999,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderTop: '1px solid #dee2e6',
        borderBottom: '1px solid #dee2e6',
      }}
    >
      <div className="d-flex flex-column">
        <button
          className={`btn btn-link text-start px-4 py-3 d-flex align-items-center gap-2 ${currentView === 'recent' ? 'fw-bold text-primary' : ''}`}
          onClick={() => onSelectView('recent')}
        >
          <MdHistory size={18} /> Recents
        </button>
        <button
          className={`btn btn-link text-start px-4 py-3 d-flex align-items-center gap-2 ${currentView === 'extract' ? 'fw-bold text-primary' : ''}`}
          onClick={() => onSelectView('extract')}
        >
          <MdBarChart size={18} /> Extract
        </button>
        <button
          className={`btn btn-link text-start px-4 py-3 d-flex align-items-center gap-2 ${currentView === 'channel' ? 'fw-bold text-primary' : ''}`}
          onClick={() => onSelectView('channel')}
        >
          <MdSubscriptions size={18} /> Channels
        </button>
        <button
          className={`btn btn-link text-start px-4 py-3 d-flex align-items-center gap-2 ${
            currentView === 'about' ? 'fw-bold text-primary' : ''
          }`}
          onClick={() => onSelectView('about')}
        >
          <MdInfo size={18} /> About
        </button>
        <button
          className="btn btn-outline-secondary mt-2 mx-4 mb-3"
          onClick={() => onSelectView('CLOSE_ONLY')}
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
}

export default MobileSidebar;
