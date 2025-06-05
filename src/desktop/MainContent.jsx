import React, { useState, useEffect } from 'react';
import RecentVideos from '../pages/RecentVideos';
import ExtractView from '../pages/ExtractView';
import ChannelList from '../pages/ChannelList';
import ChannelVideos from '../pages/ChannelVideos';
import About from '../pages/About';

function MainContent({
  view,
  setView,
  selectedVideoId,
  setSelectedVideoId,
  setChannel,
  selectedChannel,
  channelList,
  recentVideos,
  scrollRefs,
  scrollStack,
  updateViewScroll,
  isMobile
}) {
  const [selectedChannelTag, setSelectedChannelTag] = useState(null);

  useEffect(() => {
    const el = scrollRefs.current[view];
    if (el && scrollStack[view]?.scrollTop != null) {
      el.scrollTop = scrollStack[view].scrollTop;
    }
  }, [view]);

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
      content = (
        <ExtractView
          onVideoClick={setSelectedVideoId}
        />
      );
      break;

    case 'channel':
      content = (
        <ChannelList
          channels={channelList}
          onSelectChannel={(channelTag) => {
            setSelectedChannelTag(channelTag);
            const match = channelList.find((ch) => ch.channel_tag === channelTag);
            if (match) {
              setChannel(match.channel_id);
              setView('channelVideos');
            }
          }}
          selectedChannelId={selectedChannelTag}
        />
      );
      break;

    case 'channelVideos':
      content = (
        <>
          <div
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#f1f3f4',
              zIndex: 10,
              padding: '0.75rem 1rem 0.5rem 1rem',
              borderBottom: '1px solid #dee2e6',
            }}
          >
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setView('channel')}
            >
              ← Back to Channels
            </button>
          </div>
          <ChannelVideos
            channelId={selectedChannel}
            onVideoClick={setSelectedVideoId}
            selectedVideoId={selectedVideoId}
          />
        </>
      );
      break;

    case 'about':
      content = (
        <div className="p-3">
          <About isMobile={false}/>
        </div>
      );
      break;

    default:
      content = <div className="p-3">Welcome to the app!</div>;
  }
  return (
    <div
      ref={(ref) => {
        if (ref) scrollRefs.current[view] = ref;
      }}
      onScroll={(e) => {
        updateViewScroll(e.target.scrollTop);
      }}
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
