import React, { useState, useRef } from 'react';
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import MobileNavigator from './MobileNavigator';
import RecentVideos from '../pages/RecentVideos';
import ExtractView from '../pages/ExtractView';
import ChannelList from '../pages/ChannelList';
import ChannelVideos from '../pages/ChannelVideos';
import VideoSummary from '../components/VideoSummary';
import About from '../pages/About';

function MobileLayout({
  onVideoSelect,
  selectedVideoId,
  videoSummaryData,
  channelList,
  recentVideos,
}) {
  const [viewStack, setViewStack] = useState([{ key: 'recent', state: {} }]);
  const [poppedStack, setPoppedStack] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRefs = useRef({});
  const touchStartX = useRef(null);

  const current = viewStack[viewStack.length - 1];

  const pushView = (key, state = {}) => {
    setPoppedStack([]);
    setViewStack((prev) => [...prev, { key, state }]);
  };

  const popView = () => {
    if (viewStack.length > 1) {
      const popped = viewStack[viewStack.length - 1];
      setViewStack((prev) => prev.slice(0, -1));
      setPoppedStack((prev) => [...prev, popped]);
    }
  };

  const updateViewState = (partial) => {
    setViewStack((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].state = {
        ...updated[updated.length - 1].state,
        ...partial,
      };
      return updated;
    });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 60 && viewStack.length > 1) {
      const popped = viewStack[viewStack.length - 1];
      setViewStack((prev) => prev.slice(0, -1));
      setPoppedStack((prev) => [...prev, popped]);
    } else if (dx < -60 && poppedStack.length > 0) {
      const forward = poppedStack[poppedStack.length - 1];
      setPoppedStack((prev) => prev.slice(0, -1));
      setViewStack((prev) => [...prev, forward]);
    }
    touchStartX.current = null;
  };

  const handleVideoClick = (videoId) => {
    onVideoSelect(videoId);
    pushView('videoSummary');
  };

  const handleSelectView = (viewKey) => {
    setPoppedStack([]);
    setViewStack([{ key: viewKey, state: {} }]);
  };

  const renderView = (entry, index) => {
    const isTop = index === viewStack.length - 1;
    const refKey = `${entry.key}-${index}`;
    if (!containerRefs.current[refKey]) {
      containerRefs.current[refKey] = React.createRef();
    }
    const commonProps = {
      viewState: entry.state,
      updateViewState,
    };

    let content;
    switch (entry.key) {
      case 'recent':
        content = (
          <RecentVideos
            {...commonProps}
            onVideoClick={handleVideoClick}
            channelList={channelList}
            preloadedVideos={recentVideos}
            selectedVideoId={selectedVideoId}
          />
        );
        break;
      case 'extract':
        content = (
          <ExtractView
            {...commonProps}
            onVideoClick={handleVideoClick}
          />
        );
        break;
      case 'channel':
        content = (
          <ChannelList
            {...commonProps}
            channels={channelList}
            selectedChannelId={entry.state.channelId}
            onSelectChannel={(channelTag) => {
              const match = channelList.find((ch) => ch.channel_tag === channelTag);
              if (match) {
                pushView('channelVideos', { channelId: match.channel_id });
              }
            }}
          />
        );
        break;
      case 'channelVideos':
        content = (
          <>
            <div className="p-2">
              <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={popView}
              >
                ← Back to Channels
              </button>
            </div>
            <ChannelVideos
              {...commonProps}
              channelId={entry.state.channelId}
              selectedVideoId={selectedVideoId}
              onVideoClick={handleVideoClick}
            />
          </>
        );
        break;
      case 'videoSummary':
        content = (
          <>
            <div
              style={{
                position: 'sticky',
                top: 0,
                background: '#fff',
                zIndex: 100,
                padding: '0.5rem 1rem 0 1rem',
                borderBottom: '1px solid #dee2e6',
              }}
            >
              <button
                className="btn btn-sm btn-outline-secondary mb-2"
                onClick={popView}
              >
                ← Back
              </button>
            </div>
            <VideoSummary
              videoId={selectedVideoId}
              summaryData={videoSummaryData}
              containerRef={containerRefs.current[refKey]}
            />
          </>
        );
        break;
      case 'about':
        content = (
          <div className="p-3" style={{ flex: 1, overflowY: 'auto' }}>
            <h5>About DigestJutsu</h5>
            <About />
          </div>
        );
        break;
      default:
        content = <div className="p-3">Unknown view: {entry.key}</div>;
    }

    return (
      <div
        key={refKey}
        ref={containerRefs.current[refKey]}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          display: isTop ? 'block' : 'none',
          height: '100%',
          paddingBottom: '4rem',
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <MobileHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      {sidebarOpen && (
        <MobileSidebar
          currentView={current.key}
          onSelectView={(key) => {
            if (key === 'CLOSE_ONLY' || key === current.key) {
              setSidebarOpen(false);
            } else {
              handleSelectView(key);
              setSidebarOpen(false);
            }
          }}
        />
      )}
      {viewStack.map((entry, idx) => renderView(entry, idx))}
      <MobileNavigator currentView={current.key} setView={handleSelectView} />
    </div>
  );
}

export default MobileLayout;
