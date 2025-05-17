import React from 'react';

const navItems = [
  { label: 'Home', icon: 'bi-house', view: 'home' },
  { label: 'Recent', icon: 'bi-clock-history', view: 'recent' },
  { label: 'Extract', icon: 'bi-scissors', view: 'extract' },
  { label: 'Channel', icon: 'bi-person-circle', view: 'channel' },
];
function Sidebar({ onSelectView, currentView, collapsed, toggleCollapse }) {
  return (
    <div
      className="d-flex flex-column h-100"
      style={{
        width: '100%',
        paddingTop: '0.5rem',
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '0.9rem',
      }}
    >
      {/* Collapse button */}
      <div className="px-2 mb-2">
        <button
          className="btn btn-sm btn-outline-secondary w-100"
          onClick={toggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <i className="bi bi-chevron-right" />
          ) : (
            <i className="bi bi-chevron-left" />
          )}
        </button>
      </div>

      {/* Section title */}
      {!collapsed && (
        <div className="px-3 text-muted text-uppercase fw-semibold mb-2" style={{ fontSize: '0.75rem' }}>
          Navigation
        </div>
      )}

      {/* Navigation links */}
      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li key={item.view} className="nav-item">
            <a
              href="#"
              className="nav-link d-flex align-items-center gap-2 px-3 py-2"
              onClick={() => onSelectView(item.view)}
              title={collapsed ? item.label : ''}
              style={{
                color: '#000',
                backgroundColor: currentView === item.view ? '#f1f1f1' : 'transparent',
                fontWeight: currentView === item.view ? '600' : 'normal',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'background-color 0.2s',
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
              <i className={`bi ${item.icon}`} style={{ fontSize: '1rem' }} />
              {!collapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;