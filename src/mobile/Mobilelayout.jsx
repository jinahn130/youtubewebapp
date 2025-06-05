import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const containerRefs = useRef({}); //ScrollRef

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

  const handleVideoClick = (videoId) => {
    onVideoSelect(videoId);
    pushView('videoSummary');
  };

  const handleSelectView = (viewKey) => {
    setPoppedStack([]);
    setViewStack([{ key: viewKey, state: {} }]);
  };

  const renderView = (entry, index, commonProps = {}) => {
    const isTop = index === viewStack.length - 1;
    const refKey = `${entry.key}-${index}`;
    if (!containerRefs.current[refKey]) {
      containerRefs.current[refKey] = React.createRef();
    }

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
            <About></About>
          </div>
        );
        break;
      default:
        content = <div className="p-3">Unknown view: {entry.key}</div>;
    }
    return content;
  };

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0, // top: 0, left: 0, right: 0, bottom: 0
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'env(safe-area-inset-bottom)',
          minHeight: 0,
          overflow: 'hidden',
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
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence initial={false}>
          {viewStack.slice(-2).map((entry, idx, arr) => {
            const isTop = idx === arr.length - 1;
            const refKey = `${entry.key}-${viewStack.length - 2 + idx}`;
            if (!containerRefs.current[refKey]) {
              containerRefs.current[refKey] = React.createRef();
            }

            const commonProps = {
              viewState: entry.state,
              updateViewState,
            };

            const content = renderView(entry, viewStack.length - 2 + idx, commonProps);

            if (!isTop) {
              // 🟢 This is the previous screen, rendered behind
              return (
                <div
                  key={refKey}
                  ref={containerRefs.current[refKey]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#fff',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: '4rem',
                  zIndex: 1,
                  height: '100%',
                  minHeight: 0,
                }}
                >
                  {content}
                </div>
              );
            }

            // 🔵 Topmost view, draggable
            return (
            <motion.div
              key={refKey}
              ref={containerRefs.current[refKey]}
              drag={viewStack.length > 1 || poppedStack.length > 0 ? 'x' : false}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const offsetX = info.offset.x;

                // Swipe right → popView if possible
                if (offsetX > 60 && viewStack.length > 1) {
                  popView();
                  return;
                }

              // Swipe left → go forward only if a valid popped view exists
              if (offsetX < -60) {
                const forward = poppedStack[poppedStack.length - 1];
                if (forward && typeof forward.key === 'string') {
                  setPoppedStack((prev) => prev.slice(0, -1));
                  setViewStack((prev) => [...prev, forward]);
                } else {
                  // ❌ INVALID SWIPE — animate snap back
                  // trigger reset by returning with no state change
                  return; // ✅ prevent bad swipe from staying off-screen
                }
              }
              }}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#fff',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '4rem',
                zIndex: 1,
                height: '100%',
                minHeight: 0,
              }}
            >
              {content}
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <MobileNavigator currentView={current.key} setView={handleSelectView} />
    </div>
  );
}

export default MobileLayout;
