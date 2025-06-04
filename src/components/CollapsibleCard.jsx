import React, { useState } from 'react';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

function CollapsibleCard({ title, badge, icon, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mb-3 p-3 rounded"
      style={{
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #eee'
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="d-flex justify-content-between align-items-center w-100 mb-2"
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center gap-2">
          {icon}
          <span style={{ fontWeight: 600 }}>{title}</span>
          {badge && (
            <span
              className="badge bg-secondary"
              style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}
            >
              {badge}
            </span>
          )}
        </div>
        <div>{open ? <BsChevronDown /> : <BsChevronRight />}</div>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default CollapsibleCard;