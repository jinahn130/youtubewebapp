import React, { useState, useRef } from 'react';
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import MobileNavigator from './MobileNavigator';
import MRecentVideos from './pages/MRecentVideos';
import MExtractView from './pages/MExtractView';
import MChannelList from './pages/MChannelList';
import MChannelVideos from './pages/MChannelVideos';
import VideoSummary from '../components/VideoSummary';
import About from '../pages/About';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

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
  const [touchDeltaX, setTouchDeltaX] = useState(0);

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
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setTouchDeltaX(dx);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 140 && viewStack.length > 1) {
      const popped = viewStack[viewStack.length - 1];
      setViewStack((prev) => prev.slice(0, -1));
      setPoppedStack((prev) => [...prev, popped]);
    } else if (dx < -140 && poppedStack.length > 0) {
      const forward = poppedStack[poppedStack.length - 1];
      setPoppedStack((prev) => prev.slice(0, -1));
      setViewStack((prev) => [...prev, forward]);
    }
    touchStartX.current = null;
    setTouchDeltaX(0);
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
          <MRecentVideos
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
          <MExtractView
            {...commonProps}
            onVideoClick={handleVideoClick}
          />
        );
        break;
      case 'channel':
        content = (
          <MChannelList
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
            <MChannelVideos
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
        onTouchMove={handleTouchMove}
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
        position: 'relative',
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

      {/* Swipe Direction Arrow Overlay */}
      {Math.abs(touchDeltaX) > 20 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateX(${touchDeltaX * 0.3}px)`,
            zIndex: 999,
            pointerEvents: 'none',
            opacity: Math.min(Math.abs(touchDeltaX) / 140, 1),
            transition: 'transform 0.1s ease-out',
          }}
        >
          {touchDeltaX > 0 ? (
            <MdKeyboardArrowLeft size={48} style={{ color: '#0d6efd', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))' }} />
          ) : (
            <MdKeyboardArrowRight size={48} style={{ color: '#0d6efd', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.2))' }} />
          )}
        </div>
      )}

      <MobileNavigator currentView={current.key} setView={handleSelectView} />
    </div>
  );
}

export default MobileLayout;
