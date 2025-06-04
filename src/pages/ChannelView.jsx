import React, { useState, useRef } from 'react';
import ChannelList from '../components/ChannelList';
import ChannelVideos from '../components/ChannelVideos';

function ChannelView({ channelList = [], onVideoClick }) {
  const [selectedChannelId, setSelectedChannelId] = useState(() => {
    return localStorage.getItem('selectedChannel') || null;
  });

  const savedScrollTopRef = useRef(0);

  const handleChannelSelect = (channelTag) => {
    const match = channelList.find((ch) => ch.channel_tag === channelTag);
    if (match) {
      setSelectedChannelId(match.channel_id);
      localStorage.setItem('selectedChannel', match.channel_id);
    }
  };

  const handleBack = () => {
    setSelectedChannelId(null);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {!selectedChannelId ? (
        <ChannelList
          channels={channelList}
          onSelectChannel={handleChannelSelect}
          selectedChannelId={selectedChannelId}
          savedScrollTopRef={savedScrollTopRef}
        />
      ) : (
        <ChannelVideos
          channelId={selectedChannelId}
          onVideoClick={onVideoClick}
          setView={handleBack}
          selectedVideoId={null}
        />
      )}
    </div>
  );
}

export default ChannelView;
