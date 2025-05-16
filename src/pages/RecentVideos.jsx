import React, { useRef, useEffect } from 'react';

const videoData = [
  {
    video_id: 'wyTy4PmbRaM',
    title: 'Bullish TRUMP News!',
    channel_tag: '@MeetKevin',
    published_at: '2025-05-12',
  },
  {
    video_id: 'jpOjn0Jn9Qo',
    title: 'Top 3 Best Stocks to Buy UNDER $15',
    channel_tag: '@FinancialEducation',
    published_at: '2025-05-08',
  },
  {
    video_id: 'wyTy4PmbRaM',
    title: 'Bullish TRUMP News!',
    channel_tag: '@MeetKevin',
    published_at: '2025-05-12',
  },
  {
    video_id: 'jpOjn0Jn9Qo',
    title: 'Top 3 Best Stocks to Buy UNDER $15',
    channel_tag: '@FinancialEducation',
    published_at: '2025-05-08',
  },
  {
    video_id: 'wyTy4PmbRaM',
    title: 'Bullish TRUMP News!',
    channel_tag: '@MeetKevin',
    published_at: '2025-05-12',
  },
  {
    video_id: 'jpOjn0Jn9Qo',
    title: 'Top 3 Best Stocks to Buy UNDER $15',
    channel_tag: '@FinancialEducation',
    published_at: '2025-05-08',
  },
  {
    video_id: 'wyTy4PmbRaM',
    title: 'Bullish TRUMP News!',
    channel_tag: '@MeetKevin',
    published_at: '2025-05-12',
  },
  {
    video_id: 'jpOjn0Jn9Qo',
    title: 'Top 3 Best Stocks to Buy UNDER $15',
    channel_tag: '@FinancialEducation',
    published_at: '2025-05-08',
  }
];

function RecentVideos({ onVideoClick }) {
  const listRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    container.scrollTop = scrollRef.current;

    const handleScroll = () => {
      scrollRef.current = container.scrollTop;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <h5>Recent Videos</h5>
        {videoData.map((vid) => (
          <div
            key={vid.video_id}
            className="card mb-2 p-2 d-flex flex-row align-items-start"
            onClick={() => onVideoClick(vid.video_id)}
            style={{
              flexWrap: 'nowrap',
              overflow: 'hidden',
              minWidth: 0,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <img
              src={`http://img.youtube.com/vi/${vid.video_id}/hqdefault.jpg`}
              alt={vid.title}
              width={100}
              height={60}
              className="rounded me-3"
              style={{ objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fw-semibold" style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>{vid.title}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', wordBreak: 'break-word' }}>
                {vid.channel_tag} | {vid.published_at}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentVideos;
