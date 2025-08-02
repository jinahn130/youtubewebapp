import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const popoverRoot = document.getElementById('popover-root') || (() => {
  const div = document.createElement('div');
  div.id = 'popover-root';
  document.body.appendChild(div);
  return div;
})();

function formatSubs(n) {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const MChannelPopover = ({
  anchorRef,
  channel,
  isMobile = false,
  onClose
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [expanded, setExpanded] = useState(false);

    useEffect(() => {
    if (!anchorRef?.current) return;
    const popWidth = 260;
    const popHeight = 180;

    if (isMobile) {
        const top = Math.max(16, window.innerHeight / 2 - popHeight / 2 + window.scrollY);
        const left = Math.max(8, (window.innerWidth - popWidth) / 2 + window.scrollX);
        setPosition({ top, left });
    } else {
        const rect = anchorRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        let top = rect.top + scrollY;
        let left = rect.right + 10 + scrollX;

        if (top + popHeight > window.innerHeight + scrollY) {
        top = window.innerHeight + scrollY - popHeight - 12;
        }

        setPosition({ top, left });
    }
    }, [anchorRef, isMobile]);

  useEffect(() => {
    if (!isMobile || !ref.current) return;
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onClose]);

  const { channel_tag, profile_picture, subscriber_count, video_count, title, description } = channel || {};

  return ReactDOM.createPortal(
    <div
      ref={ref}
      onMouseEnter={() => !isMobile && clearTimeout(ref.current?.hideTimer)}
      onMouseLeave={() => {
        if (!isMobile) {
          ref.current.hideTimer = setTimeout(() => onClose?.(), 200);
        }
      }}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: 260,
        maxWidth: '95vw',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        padding: '0.75rem',
        zIndex: 9999,
        fontSize: '0.85rem',
        lineHeight: 1.4,
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="d-flex align-items-center gap-2 mb-2">
        <img src={profile_picture} alt="" width={40} height={40} style={{ borderRadius: '50%' }} />
        <div className="d-flex flex-column">
          <a
            href={`https://youtube.com/${channel_tag}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0d6efd', fontWeight: 600, fontSize: '0.85rem' }}
          >
            {channel_tag}
          </a>
          <span style={{ color: '#666', fontSize: '0.75rem' }}>
            {formatSubs(+subscriber_count)} subscribers • {video_count} videos
          </span>
        </div>
      </div>
      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ color: '#555', fontSize: '0.82rem' }}>
        {description && description.split(' ').length > 30 && !expanded
          ? (
            <>
              {description.split(' ').slice(0, 30).join(' ')}...{' '}
              <span
                style={{ color: '#0d6efd', cursor: 'pointer' }}
                onClick={() => setExpanded(true)}
              >
                Read more
              </span>
            </>
          ) : description}
      </div>
    </div>,
    popoverRoot
  );
};

export default MChannelPopover;
