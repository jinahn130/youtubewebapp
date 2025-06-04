import React from 'react';
import { FaBars } from 'react-icons/fa';

function MobileHeader({ onMenuClick }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 py-2"
      style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6' }}
    >
      <button
        onClick={onMenuClick}
        className="btn btn-sm btn-outline-secondary"
        style={{ borderRadius: '8px' }}
      >
        <FaBars />
      </button>
      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>digestjutsu</div>
      <div style={{ width: '32px' }} />
    </div>
  );
}

export default MobileHeader;
