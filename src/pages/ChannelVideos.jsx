import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

function ChannelVideos({ channelId, onVideoClick, setView, selectedVideoId }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!channelId) return;
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://digestjutsu.com/GetRecentVideosMetadata?channel_tag=${channelId}&days=60`
        );
        const parsed = await res.json();
        setVideos(parsed);
      } catch (err) {
        console.error('Failed to fetch channel videos:', err);
      }
    };
    fetchVideos();
  }, [channelId]);

  return (
    <div className="p-3">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => setView('channel')}>
          ← Back to Channels
        </button>
      </div>

      {videos.map((video) => (
        <div
          key={video.video_id}
          onClick={() => onVideoClick(video.video_id)}
          className="mb-3 p-3 rounded border shadow-sm"
          style={{ cursor: 'pointer', background: '#fff' }}
        >
          <div style={{ fontWeight: 600 }}>{video.title}</div>
          <div className="text-muted small">
            {formatDistanceToNow(new Date(video.published_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChannelVideos;
