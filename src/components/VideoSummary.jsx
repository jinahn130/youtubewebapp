import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

function VideoSummary({ videoId, summaryData, containerRef: externalRef }) {
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [fontSize, setFontSize] = useState('0.9rem');
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);

  const localRef = useRef(null);
  const scrollRef = useRef(0);
  const containerRef = externalRef || localRef;

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
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  zIndex: 1000,
                  minWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                {Object.entries(fontLabelMap).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => {
                      setFontFamily(value);
                      setFontMenuOpen(false);
                    }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      cursor: 'pointer',
                      backgroundColor: fontFamily === value ? '#f1f1f1' : '#fff',
                    }}
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
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  zIndex: 1000,
                  minWidth: '120px',
                  overflow: 'hidden',
                }}
              >
                {Object.entries(sizeLabelMap).map(([value, label]) => (
                  <div
                    key={value}
                    onClick={() => {
                      setFontSize(value);
                      setSizeMenuOpen(false);
                    }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      cursor: 'pointer',
                      backgroundColor: fontSize === value ? '#f1f1f1' : '#fff',
                    }}
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
          href={`https://www.youtube.com/${summaryData.youtubeHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#0d6efd' }}
        >
          {summaryData.youtubeHandle.replace(/^@/, '')}
        </a>
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
          .markdown-summary h1 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.6rem;
            color: #0d6efd;
          }
          .markdown-summary h2 {
            font-size: 1.2rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.6rem;
            color: #0d6efd;
          }
          .markdown-summary h3 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #0d6efd;
          }
          .markdown-summary h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: #495057;
          }
          .markdown-summary p {
            font-size: inherit;
            color: #333;
            margin-bottom: 0.75rem;
          }
          .markdown-summary ul {
            padding-left: 1.2rem;
            margin-bottom: 1rem;
          }
          .markdown-summary ul li {
            margin-bottom: 0.5rem;
            font-size: inherit;
          }
          .markdown-summary hr {
            border: none;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            margin: 1.25rem 0;
          }
          .markdown-summary strong {
            color: #212529;
          }
        `}
      </style>
    </div>
  );
}

export default VideoSummary;
