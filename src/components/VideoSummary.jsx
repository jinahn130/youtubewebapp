import React, { useEffect, useState, useRef } from 'react';

function VideoSummary({ videoId }) {
  const [summary, setSummary] = useState(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    if (videoId) {
      setSummary("call api gateway here for videoId: " + videoId);
    }

    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // Reset to top on new video
    }
  }, [videoId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = scrollRef.current;

    const handleScroll = () => {
      scrollRef.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (!videoId) return <div>Select a video to see summary</div>;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        minWidth: 0,
      }}
    >
      <h5>Video Summary</h5>
      <div>{summary}</div>
    </div>
  );
}

export default VideoSummary;
