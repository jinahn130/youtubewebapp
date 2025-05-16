import React, { useEffect, useState, useRef } from 'react';

// Sample mock data
const sampleData = [
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-10T15:15:03Z',
    title: '*Unexpected PROBLEM* Trump China Trade War.',
    ttl: 1754795514,
    video_id: '6u-fROiakpI',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-12T01:01:14Z',
    title: '*Bullish TRUMP News!',
    ttl: 1754795514,
    video_id: 'wyTy4PmbRaM',
  },
  {
    channel_id: 'UCnMn36GT_H0X-w5_ckLtlgQ',
    published_at: '2025-05-09T10:00:00Z',
    title: 'Market Crash Incoming!',
    ttl: 1754795514,
    video_id: 'abcd1234xyz',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-10T15:15:03Z',
    title: '*Unexpected PROBLEM* Trump China Trade War.',
    ttl: 1754795514,
    video_id: '6u-fROiakpI',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-12T01:01:14Z',
    title: '*Bullish TRUMP News!',
    ttl: 1754795514,
    video_id: 'wyTy4PmbRaM',
  },
  {
    channel_id: 'UCnMn36GT_H0X-w5_ckLtlgQ',
    published_at: '2025-05-09T10:00:00Z',
    title: 'Market Crash Incoming!',
    ttl: 1754795514,
    video_id: 'abcd1234xyz',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-10T15:15:03Z',
    title: '*Unexpected PROBLEM* Trump China Trade War.',
    ttl: 1754795514,
    video_id: '6u-fROiakpI',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-12T01:01:14Z',
    title: '*Bullish TRUMP News!',
    ttl: 1754795514,
    video_id: 'wyTy4PmbRaM',
  },
  {
    channel_id: 'UCnMn36GT_H0X-w5_ckLtlgQ',
    published_at: '2025-05-09T10:00:00Z',
    title: 'Market Crash Incoming!',
    ttl: 1754795514,
    video_id: 'abcd1234xyz',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-10T15:15:03Z',
    title: '*Unexpected PROBLEM* Trump China Trade War.',
    ttl: 1754795514,
    video_id: '6u-fROiakpI',
  },
  {
    channel_id: 'UCUvvj5lwue7PspotMDjk5UA',
    published_at: '2025-05-12T01:01:14Z',
    title: '*Bullish TRUMP News!',
    ttl: 1754795514,
    video_id: 'wyTy4PmbRaM',
  },
  {
    channel_id: 'UCnMn36GT_H0X-w5_ckLtlgQ',
    published_at: '2025-05-09T10:00:00Z',
    title: 'Market Crash Incoming!',
    ttl: 1754795514,
    video_id: 'abcd1234xyz',
  },
];

function ChannelVideos({ channelId, onVideoClick, setView }) {
  const [videos, setVideos] = useState([]);
  const [sortBy, setSortBy] = useState('published_at'); // or 'title'

  useEffect(() => {
    async function fetchVideos() {
      // Placeholder for future API call:
      /*
      const res = await fetch(`https://your-api.com/videos?channel_id=${channelId}`);
      const data = await res.json();
      setVideos(data);
      */
      const filtered = sampleData.filter((v) => v.channel_id === channelId);
      setVideos(filtered);
    }

    fetchVideos();
  }, [channelId]);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'published_at') {
      return new Date(b.published_at) - new Date(a.published_at);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Channel Videos</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setView('channel')}>
          ← Back to Channels
        </button>
      </div>

      <div className="mb-3">
        <label htmlFor="sort" className="form-label me-2">Sort by:</label>
        <select
          id="sort"
          className="form-select form-select-sm w-auto d-inline-block"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="published_at">Published Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      {sortedVideos.map((vid) => (
        <div
          key={vid.video_id + vid.published_at}
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
            src={`https://img.youtube.com/vi/${vid.video_id}/hqdefault.jpg`}
            alt={vid.title}
            width={100}
            height={60}
            className="rounded me-3"
            style={{ objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="fw-semibold" style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
              {vid.title}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {new Date(vid.published_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChannelVideos;
