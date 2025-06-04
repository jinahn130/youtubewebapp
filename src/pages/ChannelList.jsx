import React, { useEffect, useRef } from 'react';
import ChannelProfilePicture from '../components/ChannelProfilePicture';

function formatSubs(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function ChannelList({ channels = [], onSelectChannel, selectedChannelId, savedScrollTopRef }) {
  const listRef = useRef(null);

  // Restore scroll position on mount
  useEffect(() => {
    if (listRef.current && savedScrollTopRef?.current != null) {
      listRef.current.scrollTop = savedScrollTopRef.current;
    }
  }, []);

  // Save scroll position
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const handleScroll = () => {
      savedScrollTopRef.current = container.scrollTop;
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="p-3"
      style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
      ref={listRef}
    >
      {channels.map((channel) => {
        const isSelected = selectedChannelId === channel.channel_tag;

        return (
          <div
            key={channel.channel_tag}
            onClick={() => onSelectChannel(channel.channel_tag)}
            className="d-flex align-items-center gap-3 p-2 mb-2 rounded border"
            style={{
              backgroundColor: isSelected ? '#eef6ff' : '#fff',
              border: isSelected ? '1px solid #0d6efd' : '1px solid #d4d7dc',
              cursor: 'pointer',
              boxShadow: isSelected
                ? '0 4px 12px rgba(13,110,253,0.15)'
                : '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.background = 'linear-gradient(to right, #f7f9fc, #ffffff)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = isSelected
                ? '0 4px 12px rgba(13,110,253,0.15)'
                : '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.background = isSelected ? '#eef6ff' : '#fff';
            }}
          >
            <ChannelProfilePicture url={channel.profile_picture} size={40} />
            <div className="flex-grow-1">
              <div style={{ fontWeight: 600 }}>{channel.channel_tag.replace('@', '')}</div>
              <div className="text-muted small">{channel.title}</div>
            </div>
            <div className="badge bg-secondary">{formatSubs(channel.subscriber_count)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ChannelList;
