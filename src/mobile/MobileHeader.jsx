import React from 'react';
import { FaBars } from 'react-icons/fa';

function MobileHeader({ onMenuClick }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between px-3 py-2"
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #dee2e6',
        height: '48px',
      }}
    >
      <button
        onClick={onMenuClick}
        className="btn btn-sm btn-outline-secondary"
        style={{ borderRadius: '8px' }}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <img
        src="/digestjutsu-logo.png"
        alt="DigestJutsu"
        style={{ height: '28px', objectFit: 'contain' }}
      />

      {/* Right side spacer to balance layout */}
      <div style={{ width: '32px' }} />
    </div>
  );
}

export default MobileHeader;
