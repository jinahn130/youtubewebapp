import React from 'react';
import RecentVideos from '../pages/RecentVideos';
import ExtractView from '../pages/ExtractView';
import ChannelList from '../pages/ChannelList';
import ChannelVideos from '../pages/ChannelVideos';

function MainContent({ view, setView, setSelectedVideoId, setChannel, selectedChannel, channelScrollRef }) {
  let content;

  switch (view) {
    case 'recent':
      content = <RecentVideos onVideoClick={setSelectedVideoId} />;
      break;
    case 'extract':
      content = <ExtractView onVideoClick={setSelectedVideoId} />;
      break;
    case 'channel':
      content = (
        <ChannelList
          onSelectChannel={setChannel}
          selectedChannelId={selectedChannel}
          savedScrollTopRef={channelScrollRef}
        />
      );
      break;
    case 'channelVideos':
      content = (
        <ChannelVideos
          channelId={selectedChannel}
          onVideoClick={setSelectedVideoId}
          setView={setView}
        />
      );
      break;
    default:
      content = <div>Welcome to the Home Page</div>;
  }

  // ✅ Wrap with scrollable area
  return (
    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
      {content}
    </div>
  );
}

export default MainContent;
