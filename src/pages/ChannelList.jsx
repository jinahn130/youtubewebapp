import React from 'react';
import ChannelProfilePicture from '../components/ChannelProfilePicture';

function formatSubs(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function ChannelList({ channels = [], onSelectChannel, selectedChannelId, savedScrollTopRef }) {
  return (
    <div
      className="p-3"
      style={{ height: '100%', overflowY: 'auto' }}
      ref={savedScrollTopRef}
    >
      {channels.map((channel) => (
        <div
          key={channel.channel_tag}
          onClick={() => onSelectChannel(channel.channel_tag)}
          className="d-flex align-items-center gap-3 p-2 mb-2 rounded shadow-sm border"
          style={{
            backgroundColor: '#fff',
            cursor: 'pointer',
            borderLeft: channel.channel_tag === selectedChannelId ? '4px solid #0d6efd' : '4px solid transparent',
          }}
        >
          <ChannelProfilePicture url={channel.profile_picture} size={40} />
          <div className="flex-grow-1">
            <div style={{ fontWeight: 600 }}>{channel.channel_tag.replace('@', '')}</div>
            <div className="text-muted small">{channel.title}</div>
          </div>
          <div className="badge bg-secondary">{formatSubs(channel.subscriber_count)}</div>
        </div>
      ))}
    </div>
  );
}

export default ChannelList;
