import React from 'react';
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
  const selectedChannelTag = selectedChannel
    ? channelList.find((ch) => ch.channel_id === selectedChannel)?.channel_tag
    : null;

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
          updateViewState={(state) => updateViewState('recent', state)}
        />
      );
      break;

    case 'extract':
      content = (
        <ExtractView
          onVideoClick={setSelectedVideoId}
          viewState={viewState.extract || {}}
          updateViewState={(state) => updateViewState('extract', state)}
        />
      );
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
          selectedChannelId={selectedChannelTag}
          viewState={viewState.channel || {}}
          updateViewState={(state) => updateViewState('channel', state)}
        />
      );
      break;

    case 'channelVideos':
      content = (
        <>
          <div className="px-3 pt-2">
            <button
              className="btn btn-sm btn-outline-secondary mb-2"
              onClick={() => {
                setChannel(null);
                setView('channel');
              }}
            >
              ← Back to Channels
            </button>
          </div>
          <ChannelVideos
            channelId={selectedChannel}
            onVideoClick={setSelectedVideoId}
            selectedVideoId={selectedVideoId}
            viewState={viewState.channelVideos || {}}
            updateViewState={(state) => updateViewState('channelVideos', state)}
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

  return content;
}

export default MainContent;
