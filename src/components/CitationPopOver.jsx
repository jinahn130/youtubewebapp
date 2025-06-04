import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const popoverRoot = document.getElementById('popover-root') || (() => {
  const root = document.createElement('div');
  root.id = 'popover-root';
  document.body.appendChild(root);
  return root;
})();

const CitationPopover = ({
  anchorRef,
  videoIds,
  videoMetadata = [],
  onVideoClick,
  onMouseEnter,
  onMouseLeave,
  isMobile = false,
  onClose, // NEW: used for mobile tap-outside to close
}) => {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Position the popover
  useEffect(() => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const POP_WIDTH = 260;

    const top = rect.bottom + window.scrollY + 6;
    let left;

    if (isMobile) {
      // Center below citation
      left = rect.left + window.scrollX + rect.width / 2 - POP_WIDTH / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - POP_WIDTH - 8));
    } else {
      left = rect.right + 10 + window.scrollX;
    }

    setPosition({ top, left });
  }, [anchorRef, isMobile]);

  // Close on outside tap (mobile only)
  useEffect(() => {
    if (!isMobile || !popoverRef.current) return;

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onClose]);

  const getVideoMeta = (id) => videoMetadata.find((v) => v.video_id === id);
  const truncate = (str, max = 25) =>
    str.length > max ? str.slice(0, max - 3) + '...' : str;

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        width: '260px',
        maxWidth: '95vw',
        fontSize: '0.72rem',
        lineHeight: 1.25,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          backgroundColor: '#eee',
          padding: '0.35rem 0.55rem',
          fontWeight: 600,
          fontSize: '0.72rem',
          color: '#333',
          borderBottom: '1px solid #ccc',
        }}
      >
        Citations
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: '0.4rem 0.55rem',
          margin: 0,
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
        }}
      >
        {videoIds.map((id) => {
          const meta = getVideoMeta(id);
          if (!meta) return null;

          const label = `${truncate(meta.video_title)} | ${meta.channel_tag}`;

          return (
            <li key={id} style={{ marginBottom: '0.3rem' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onVideoClick) onVideoClick(id);
                }}
                style={{
                  color: '#0d6efd',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.3rem',
                  display: 'inline-block',
                  borderRadius: '4px',
                }}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>,
    popoverRoot
  );
};

export default CitationPopover;
