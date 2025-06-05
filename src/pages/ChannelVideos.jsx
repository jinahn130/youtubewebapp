import React, { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

function ChannelVideos({
  channelId,
  onVideoClick,
  selectedVideoId,
  viewState = {},
  updateViewState = () => {},
}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(viewState.sortBy || 'published_at');
  const listRef = useRef(null);

  useEffect(() => {
    if (!channelId) return;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://digestjutsu.com/youtubeStockResearchReadS3?channel_id=${channelId}`
        );
        const parsed = await res.json();
        setVideos(parsed);
      } catch (err) {
        console.error('Failed to fetch channel videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [channelId]);

  // ✅ Restore scroll when channelId or viewState changes
  useEffect(() => {
    const el = listRef.current;
    if (el && typeof viewState.scrollTop === 'number') {
      setTimeout(() => {
        el.scrollTop = viewState.scrollTop;
      }, 0);
    }
  }, [channelId, viewState.scrollTop]);

  // ✅ Save scroll on unmount
  useEffect(() => {
    const el = listRef.current;
    return () => {
      if (el) {
        updateViewState({
          scrollTop: el.scrollTop,
          sortBy,
        });
      }
    };
  }, [sortBy]);

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'published_at') {
      return new Date(b.published_at) - new Date(a.published_at);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto' }} ref={listRef}>
      <div className="d-flex justify-content-between align-items-center p-3">
        <h5 className="mb-0">Channel Videos</h5>
      </div>

      <div className="px-3 mb-3">
        <label htmlFor="sort" className="form-label me-2">
          Sort by:
        </label>
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

      {loading && <div className="px-3">Loading videos...</div>}
      {!loading && sortedVideos.length === 0 && (
        <div className="px-3">No videos found for this channel.</div>
      )}

      <div className="px-3 pb-3">
        {!loading &&
          sortedVideos.map((vid) => {
            const isSelected = selectedVideoId === vid.video_id;
            return (
              <div
                key={vid.video_id}
                className="card mb-2 p-2 d-flex flex-row align-items-start"
                onClick={() => onVideoClick(vid.video_id)}
                style={{
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                  minWidth: 0,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#eef6ff' : '#fff',
                  border: isSelected
                    ? '1px solid #0d6efd'
                    : '1px solid #d4d7dc',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: isSelected
                    ? '0 4px 12px rgba(13,110,253,0.15)'
                    : '0 1px 2px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 3px 10px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.background =
                    'linear-gradient(to right, #f7f9fc, #ffffff)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isSelected
                    ? '0 4px 12px rgba(13,110,253,0.15)'
                    : '0 1px 2px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.background = isSelected
                    ? '#eef6ff'
                    : '#fff';
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
                  <div
                    className="fw-semibold"
                    style={{
                      fontSize: '0.9rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {vid.title}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {vid.channel_tag}{' '}
                    •{' '}
                    {formatDistanceToNow(new Date(vid.published_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ChannelVideos;
