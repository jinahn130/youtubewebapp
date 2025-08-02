import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import ReactDOM from 'react-dom';

function VideoSummary({ videoId, summaryData, containerRef: externalRef, onYoutuberClick, channelList = [] }) {
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [fontSize, setFontSize] = useState('0.9rem');
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const localRef = useRef(null);
  const scrollRef = useRef(0);
  const containerRef = externalRef || localRef;

  const anchorRef = useRef(null);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [isHoveringPopover, setIsHoveringPopover] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const container = containerRef?.current;
    if (container) container.scrollTop = 0;
  }, [videoId]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    container.scrollTop = scrollRef.current;
    const handleScroll = () => {
      scrollRef.current = container.scrollTop;
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  if (summaryData === null) {
    return (
      <div className="p-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
        <div className="custom-spinner mb-2" />
        <div>Please click on a summary to read...</div>
      </div>
    );
  }

  const fontLabelMap = {
    '"Georgia", serif': 'New York Times',
    'system-ui': 'System',
    'Georgia, serif': 'Georgia',
    '"Helvetica Neue", sans-serif': 'Helvetica Neue',
  };

  const sizeLabelMap = {
    '0.85rem': 'Small',
    '0.9rem': 'Normal',
    '1rem': 'Large',
  };

  const fullChannel = channelList.find((ch) => ch.channel_id === summaryData.channel_id);

  return (
    <div
      ref={containerRef}
      className="p-3"
      style={{ lineHeight: 1.6, fontSize, fontFamily }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0" style={{ fontWeight: 600 }}>VIDEO SUMMARY</h5>
        <div className="d-flex gap-3 align-items-center" style={{ fontSize: '0.85rem' }}>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setFontMenuOpen((prev) => !prev);
                setSizeMenuOpen(false);
              }}
              style={{ cursor: 'pointer', fontWeight: 500 }}
            >
              {fontLabelMap[fontFamily]} ▼
            </div>
            {fontMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', zIndex: 1000, minWidth: '150px', overflow: 'hidden' }}>
                {Object.entries(fontLabelMap).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => {
                      setFontFamily(value);
                      setFontMenuOpen(false);
                    }}
                    style={{ padding: '0.4rem 0.75rem', cursor: 'pointer', backgroundColor: fontFamily === value ? '#f1f1f1' : '#fff' }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setSizeMenuOpen((prev) => !prev);
                setFontMenuOpen(false);
              }}
              style={{ cursor: 'pointer', fontWeight: 500 }}
            >
              {sizeLabelMap[fontSize]} ▼
            </div>
            {sizeMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', zIndex: 1000, minWidth: '120px', overflow: 'hidden' }}>
                {Object.entries(sizeLabelMap).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => {
                      setFontSize(value);
                      setSizeMenuOpen(false);
                    }}
                    style={{ padding: '0.4rem 0.75rem', cursor: 'pointer', backgroundColor: fontSize === value ? '#f1f1f1' : '#fff' }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #ccc', marginBottom: '1rem' }} />

      <div className="mb-2">
        <strong>YouTuber: </strong>
        <a
          href="#"
          ref={anchorRef}
          onClick={(e) => {
            e.preventDefault();
            if (onYoutuberClick && summaryData?.channel_id) {
              onYoutuberClick(summaryData.channel_id);
            }
          }}
          onMouseEnter={() => setHoveredChannel(fullChannel)}
          onMouseLeave={(e) => {
            setTimeout(() => {
              const popover = document.getElementById('channel-popover');
              if (!popover) {
                // Popover isn't mounted yet — abort early to allow it to render
                return;
              }

              const { clientX, clientY } = e;
              const buffer = 10;

              const points = [
                [clientX, clientY],
                [clientX + buffer, clientY],
                [clientX - buffer, clientY],
                [clientX, clientY + buffer],
                [clientX, clientY - buffer],
              ];

              const stillInside = points.some(([x, y]) =>
                document.elementFromPoint(x, y)?.closest('#channel-popover')
              );

              if (!stillInside && !isHoveringPopover) {
                setHoveredChannel(null);
              }
            }, 100); // Delay to allow popover to mount
          }}

          style={{ textDecoration: 'none', color: '#0d6efd', cursor: 'pointer' }}
        >
          {summaryData.youtubeHandle.replace(/^@/, '')}
        </a>

        {hoveredChannel && anchorRef.current && (
          <ChannelPopover2
            anchorRef={anchorRef}
            channel={hoveredChannel}
            isMobile={false}
            onClose={() => setHoveredChannel(null)}
            onMouseEnter={() => setIsHoveringPopover(true)}
            onMouseLeave={() => {
              setIsHoveringPopover(false);
              setHoveredChannel(null);
            }}
          />
        )}
      </div>

      <div className="mb-2">
        <strong>Title: </strong>
        <a
          href={`https://www.youtube.com/watch?v=${summaryData.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#0d6efd' }}
        >
          {summaryData.title}
        </a>
      </div>

      <div className="mb-3">
        <strong>Published: </strong>{' '}
        {new Date(summaryData.published_at).toLocaleDateString()}
      </div>

      <hr style={{ borderTop: '1px solid #ccc', margin: '1rem 0' }} />

      <div
        className="markdown-summary"
        dangerouslySetInnerHTML={{ __html: marked.parse(summaryData.summary || '') }}
      />

      <style>
        {`
          .markdown-summary h1 { font-size: 1.3rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.6rem; color: #0d6efd; }
          .markdown-summary h2 { font-size: 1.2rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.6rem; color: #0d6efd; }
          .markdown-summary h3 { font-size: 1.1rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #0d6efd; }
          .markdown-summary h4 { font-size: 1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.5rem; color: #495057; }
          .markdown-summary p { font-size: inherit; color: #333; margin-bottom: 0.75rem; }
          .markdown-summary ul { padding-left: 1.2rem; margin-bottom: 1rem; }
          .markdown-summary ul li { margin-bottom: 0.5rem; font-size: inherit; }
          .markdown-summary hr { border: none; border-top: 1px solid rgba(0, 0, 0, 0.06); margin: 1.25rem 0; }
          .markdown-summary strong { color: #212529; }
        `}
      </style>
    </div>
  );
}

// 👇 Final version of ChannelPopover2
const ChannelPopover2 = ({
  anchorRef,
  channel,
  isMobile = false,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const popWidth = 260;
    const popHeight = 180;

    const top = rect.top + window.scrollY;
    const left = rect.right + window.scrollX + 4; // just 4px to the right

    setPosition({ top, left });
  }, [anchorRef]);

  useEffect(() => {
    if (!isMobile || !popoverRef.current) return;
    const handleClickOutside = (e) => {
      if (
        !popoverRef.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, onClose]);

  if (!channel) return null;

  const {
    channel_tag,
    profile_picture,
    subscriber_count,
    video_count,
    title,
    description,
  } = channel;

  const formatSubs = (n) => {
    if (!n) return '';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return ReactDOM.createPortal(
    <div
      id="channel-popover"
      ref={popoverRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
        animation: 'fadeIn 0.15s ease-out',
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
      <div style={{ color: '#555', fontSize: '0.82rem' }}>{description}</div>
    </div>,
    document.getElementById('popover-root')
  );
};

export default VideoSummary;
