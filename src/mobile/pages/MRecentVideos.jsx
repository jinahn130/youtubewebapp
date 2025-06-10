import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

function formatSubs(n) {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function MRecentVideos({
  onVideoClick,
  channelList = [],
  preloadedVideos = [],
  selectedVideoId,
  viewState = {},
  updateViewState = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState(viewState.searchQuery || '');
  const [searchMode, setSearchMode] = useState(viewState.searchMode || 'title');
  const [sortBy, setSortBy] = useState(viewState.sortBy || 'published_at');
  const [videos, setVideos] = useState(preloadedVideos);

  useEffect(() => {
    setVideos(preloadedVideos);
  }, [preloadedVideos]);

  useEffect(() => {
    updateViewState({ searchQuery, searchMode, sortBy });
  }, [searchQuery, searchMode, sortBy]);

  const filtered = videos.filter((video) => {
    const field = searchMode === 'channel' ? video.channel_tag : video.title;
    return field?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'subscriber_count') {
      return (b.subscriber_count || 0) - (a.subscriber_count || 0);
    }
    return new Date(b.published_at) - new Date(a.published_at);
  });

  const channelMap = Object.fromEntries((channelList || []).map((ch) => [ch.channel_tag, ch]));
  const isMobile = window.innerWidth < 768;

  return (
    <div
      className="p-3"
      style={{
        paddingTop: '0.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        height: '100%',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">🎬 Recent Videos</h5>
        <div className="d-flex align-items-center gap-3 px-1" style={{ fontSize: '0.875rem' }}>
          <div
            style={{ cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setSearchMode(searchMode === 'title' ? 'channel' : 'title')}
          >
            {searchMode === 'title' ? 'Title ▼' : 'Channel ▼'}
          </div>
          <div
            style={{ cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setSortBy(sortBy === 'published_at' ? 'subscriber_count' : 'published_at')}
          >
            {sortBy === 'published_at' ? 'Date ▼' : 'Subscriber Count ▼'}
          </div>
        </div>
      </div>

      <input
        type="text"
        className="form-control form-control-sm mb-3"
        placeholder={`Search videos by ${searchMode}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {sorted.map((video) => {
        const channel = channelMap[video.channel_tag];
        const displayTag = video.channel_tag.replace(/^@+/, '@');
        const subCount = formatSubs(channel?.subscriber_count);
        const dateString = formatDistanceToNow(new Date(video.published_at), { addSuffix: true });
        const isSelected = selectedVideoId === video.video_id;

        return (
          <div
            key={video.video_id + video.published_at}
            onClick={() => onVideoClick(video.video_id)}
            className="d-flex gap-3 align-items-start mb-2 rounded border shadow-sm"
            style={{
              borderRadius: '16px',
              backgroundColor: isSelected ? '#eef6ff' : '#fff',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderTop: isSelected ? '1px solid #0d6efd' : '1px solid #d4d7dc',
              borderRight: isSelected ? '1px solid #0d6efd' : '1px solid #d4d7dc',
              borderBottom: isSelected ? '1px solid #0d6efd' : '1px solid #d4d7dc',
              borderLeft: isSelected ? '4px solid #0d6efd' : '4px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) e.currentTarget.style.backgroundColor = '#f2f6ff';
            }}
            onMouseLeave={(e) => {
              if (!isMobile) e.currentTarget.style.backgroundColor = isSelected ? '#eef6ff' : '#fff';
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
              alt={video.title}
              width={100}
              height={60}
              className="rounded"
              style={{ objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fw-semibold" style={{ fontSize: '0.92rem', marginBottom: '0.2rem' }}>{video.title}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {displayTag} {subCount ? ` • ${subCount} subscribers` : ''} • {dateString}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MRecentVideos;
