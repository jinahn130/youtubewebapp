import React, { useState } from 'react';
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
  viewState = {},
  updateViewState = () => {},
  channelList,
  recentVideos,
}) {
  const [selectedChannelTag, setSelectedChannelTag] = useState(null);

  let content;

  switch (view) {
    case 'recent':
      content = (
        <RecentVideos
          onVideoClick={setSelectedVideoId}
          channelList={channelList}
          preloadedVideos={recentVideos}
          selectedVideoId={selectedVideoId}
          viewState={viewState.recent || {}}
          updateViewState={(state) =>
            updateViewState({ ...viewState, recent: state })
          }
        />
      );
      break;

    case 'extract':
      content = (
        <ExtractView
          onVideoClick={setSelectedVideoId}
          viewState={viewState.extract || {}}
          updateViewState={(state) =>
            updateViewState({ ...viewState, extract: state })
          }
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
          viewState={viewState.channel || {}}
          updateViewState={(state) =>
            updateViewState({ ...viewState, channel: state })
          }
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
              backgroundColor: '#fff',
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
            viewState={viewState.channelVideos || {}}
            updateViewState={(state) =>
              updateViewState({ ...viewState, channelVideos: state })
            }
          />
        </>
      );
      break;

    case 'about':
      content = (
        <div className="p-3">
          <About />
        </div>
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
