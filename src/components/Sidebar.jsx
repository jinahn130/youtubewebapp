import React from 'react';
import { FaChevronLeft, FaChevronRight, FaHome, FaChartLine, FaList, FaInfoCircle } from 'react-icons/fa';

const navItems = [
  { label: 'Recent', icon: <FaHome />, view: 'recent' },
  { label: 'Extract', icon: <FaChartLine />, view: 'extract' },
  { label: 'Channels', icon: <FaList />, view: 'channel' },
  { label: 'About', icon: <FaInfoCircle />, view: 'about' }
];

function Sidebar({ setView, currentView, collapsed, toggleCollapse }) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        borderRight: '1px solid #dee2e6',
        fontSize: '0.88rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Collapse toggle */}
      <div className="px-2 mb-2">
        <button
          className="btn btn-sm btn-outline-secondary w-100"
          onClick={toggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation Title */}
      {!collapsed && (
        <div
          className="px-3 text-muted text-uppercase fw-semibold mb-2"
          style={{ fontSize: '0.72rem' }}
        >
          Navigation
        </div>
      )}

      {/* Navigation Links */}
      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li key={item.view} className="nav-item">
            <a
              href="#"
              className="nav-link d-flex align-items-center gap-2 px-3 py-2"
              onClick={(e) => {
                e.preventDefault();
                setView(item.view);
              }}
              title={collapsed ? item.label : ''}
              style={{
                color: currentView === item.view ? '#0d6efd' : '#333',
                backgroundColor: currentView === item.view ? '#eef6ff' : 'transparent',
                fontWeight: currentView === item.view ? 600 : 500,
                borderLeft: currentView === item.view ? '4px solid #0d6efd' : '4px solid transparent',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.view) {
                  e.currentTarget.style.backgroundColor = '#f1f1f1';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.view) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Footer Logo */}
      <div className="mt-auto text-center p-3">
        <img
          src="/digestjutsu-logo.png"
          alt="DigestJutsu"
          style={{
            height: '120px',
            maxWidth: '100%',
            objectFit: 'contain',
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}

export default Sidebar;
