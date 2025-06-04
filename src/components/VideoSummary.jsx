import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';

function VideoSummary({ videoId, summaryData, containerRef: externalRef }) {
  const [fontFamily, setFontFamily] = useState('"Georgia", serif');
  const [fontSize, setFontSize] = useState('0.9rem');

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

  if (!summaryData) {
    return <div className="p-3 text-muted">No summary available.</div>;
  }

  return (
    <div
      ref={containerRef}
      className="p-3"
      style={{ lineHeight: 1.6, fontSize, fontFamily }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Video Summary</h5>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value='"Georgia", serif'>New York Times</option>
            <option value='system-ui'>System</option>
            <option value='Georgia, serif'>Georgia</option>
            <option value='"Helvetica Neue", sans-serif'>Helvetica Neue</option>
          </select>
          <select
            className="form-select form-select-sm"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            style={{ width: 'auto', minWidth: '100px' }}
          >
            <option value='0.85rem'>Small</option>
            <option value='0.9rem'>Normal</option>
            <option value='1rem'>Large</option>
          </select>
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
        <strong>Published: </strong> {new Date(summaryData.published_at).toLocaleDateString()}
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
