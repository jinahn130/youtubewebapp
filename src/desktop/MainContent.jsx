import React from 'react';
import RecentVideos from '../pages/RecentVideos';
import ExtractView from '../pages/ExtractView';
import ChannelList from '../pages/ChannelList';
import ChannelVideos from '../pages/ChannelVideos';

function MainContent({
  view,
  setView,
  selectedVideoId,
  setSelectedVideoId,
  setChannel,
  selectedChannel,
  channelScrollRef,
  channelList,
  recentVideos,
}) {
  let content;

  switch (view) {
    case 'recent':
      content = (
        <RecentVideos
          onVideoClick={setSelectedVideoId}
          channelList={channelList}
          preloadedVideos={recentVideos}
          selectedVideoId={selectedVideoId}
        />
      );
      break;

    case 'extract':
      content = <ExtractView onVideoClick={setSelectedVideoId} />;
      break;

    case 'channel':
      content = (
        <ChannelList
          channels={channelList}
          onSelectChannel={(channelTag) => {
            const match = channelList.find((ch) => ch.channel_tag === channelTag);
            if (match) {
              setChannel(match.channel_id);
              setView('channelVideos');
            }
          }}
          selectedChannelId={selectedChannel}
          savedScrollTopRef={channelScrollRef}
        />
      );
      break;

    case 'channelVideos':
      content = (
        <>
          <div className="px-3 pt-2">
            <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => setView('channel')}>
              ← Back to Channels
            </button>
          </div>
          <ChannelVideos
            channelId={selectedChannel}
            onVideoClick={setSelectedVideoId}
            setView={setView}
            selectedVideoId={selectedVideoId}
          />
        </>
      );
      break;

    default:
      content = <div className="p-3">Welcome to the app!</div>;
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        minWidth: 0,
        padding: '1rem',
      }}
    >
      {content}
    </div>
  );
}

export default MainContent;
