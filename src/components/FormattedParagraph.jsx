import React, { useRef, useState, useEffect } from 'react';
import CitationPopover from './CitationPopover';

const isMobileDevice = () => window.innerWidth < 768;

const FormattedParagraph = ({ text, onVideoClick, videoMetadata = [] }) => {
  const citationRegex = /\[[A-Za-z0-9_-]{6,}\]/g;
  const citationMatches = text.match(citationRegex) || [];
  const uniqueIds = [...new Set(citationMatches.map((c) => c.slice(1, -1)))];
  const contentWithoutCitations = text.replace(citationRegex, '').trim();
  const parts = contentWithoutCitations.split(/(\$[A-Z]{1,6}\b|@[a-zA-Z0-9_]+)/g);

  const [showPopover, setShowPopover] = useState(false);
  const anchorRef = useRef(null);
  const hideTimer = useRef(null);
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(hideTimer.current);
      setShowPopover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hideTimer.current = setTimeout(() => setShowPopover(false), 150);
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setShowPopover((prev) => !prev);
    }
  };

  const renderedParts = parts.map((part, idx) => {
    if (/^\$[A-Z]{1,6}$/.test(part)) {
      return (
        <span
          key={`ticker-${idx}`}
          title={`Stock: ${part.slice(1)}`}
          style={{
            backgroundColor: '#e6f0ff',
            color: '#004085',
            borderRadius: '999px',
            padding: '0.1rem 0.5rem',
            fontWeight: 500,
            fontSize: '0.85rem',
            margin: '0 0.2rem',
            display: 'inline-block',
          }}
        >
          {part}
        </span>
      );
    }

    if (/^@[a-zA-Z0-9_]+$/.test(part)) {
      return (
        <span
          key={`youtuber-${idx}`}
          title={`YouTuber: ${part.slice(1)}`}
          style={{
            textDecoration: 'underline',
            textDecorationColor: 'green',
            color: '#155724',
            fontWeight: 500,
            margin: '0 0.2rem',
            display: 'inline-block',
          }}
        >
          {part}
        </span>
      );
    }

    return (
      <span
        key={`text-${idx}`}
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      >
        {part}
      </span>
    );
  });

  return (
    <span style={{ position: 'relative' }}>
      {renderedParts}{' '}
      {uniqueIds.length > 0 && (
        <span
          ref={anchorRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            color: '#0d6efd',
            textDecoration: 'underline',
            marginLeft: '0.3rem',
            cursor: 'pointer',
          }}
        >
          [citation]
          {showPopover && (
            <CitationPopover
              anchorRef={anchorRef}
              videoIds={uniqueIds}
              videoMetadata={videoMetadata}
              onVideoClick={onVideoClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              isMobile={isMobile}
              onClose={() => setShowPopover(false)} // ✅ TAP OUTSIDE CLOSE
            />
          )}
        </span>
      )}
    </span>
  );
};

export default FormattedParagraph;
