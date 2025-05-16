import React from 'react';

const navItems = [
  { label: 'Home', icon: 'bi-house', view: 'home' },
  { label: 'Recent', icon: 'bi-clock-history', view: 'recent' },
  { label: 'Extract', icon: 'bi-scissors', view: 'extract' },
  { label: 'Channel', icon: 'bi-person-circle', view: 'channel' },
];

function Sidebar({ onSelectView, collapsed, toggleCollapse }) {
  return (
    <div className="d-flex flex-column h-100">
      {/* Collapse button */}
      <button
        className="btn btn-sm btn-outline-light mb-3 align-self-end"
        onClick={toggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <i className="bi bi-chevron-double-right"></i>
        ) : (
          <i className="bi bi-chevron-double-left"></i>
        )}
      </button>

      <h6
        className="text-uppercase fw-bold mb-3"
        style={{ display: collapsed ? 'none' : 'block' }}
      >
        Navigation
      </h6>

      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li key={item.view} className="nav-item">
            <a
              href="#"
              className={`nav-link d-flex align-items-center gap-2 px-2 py-2 rounded text-white`}
              onClick={() => onSelectView(item.view)}
              title={collapsed ? item.label : ''}
            >
              <i className={`bi ${item.icon}`}></i>
              {!collapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
