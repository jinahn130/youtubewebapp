import React, { useState, useRef, useEffect } from 'react';
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import RecentVideos from '../pages/RecentVideos';
import ExtractView from '../pages/ExtractView';
import ChannelList from '../pages/ChannelList';
import ChannelVideos from '../pages/ChannelVideos';
import VideoSummary from '../components/VideoSummary';

function MobileLayout({
  view,
  setView,
  onVideoSelect,
  selectedVideoId,
  videoSummaryData,
  channel,
  setChannel,
  channelList,
  recentVideos,
  channelScrollRef,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState(view);
  const scrollMemory = useRef({});
  const lastNonSummaryViewRef = useRef(view);

  const containerRefs = {
    recent: useRef(null),
    extract: useRef(null),
    channel: useRef(null),
    channelVideos: useRef(null),
    videoSummary: useRef(null),
  };

  useEffect(() => {
    const ref = containerRefs[currentView]?.current;
    if (ref && currentView !== 'videoSummary') {
      ref.scrollTop = scrollMemory.current[currentView] || 0;
    }
  }, [currentView]);

  const handleGoBack = () => {
    const previous = lastNonSummaryViewRef.current || 'recent';
    setCurrentView(previous);
  };

  const handleVideoClick = (videoId) => {
    const currentRef = containerRefs[currentView]?.current;
    if (currentRef && currentView !== 'videoSummary') {
      scrollMemory.current[currentView] = currentRef.scrollTop;
    }
    lastNonSummaryViewRef.current = currentView;
    onVideoSelect(videoId);
    setCurrentView('videoSummary');
  };

  const handleChannelSelect = (channelId) => {
    setChannel(channelId);
    setCurrentView('channelVideos');
  };

  let content = null;
  switch (currentView) {
    case 'recent':
      content = (
        <div ref={containerRefs.recent} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <RecentVideos
            onVideoClick={handleVideoClick}
            channelList={channelList}
            preloadedVideos={recentVideos}
            selectedVideoId={selectedVideoId}
          />
        </div>
      );
      break;
    case 'extract':
      content = (
        <div ref={containerRefs.extract} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <ExtractView onVideoClick={handleVideoClick} />
        </div>
      );
      break;
    case 'channel':
      content = (
        <div ref={containerRefs.channel} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <ChannelList
            onSelectChannel={handleChannelSelect}
            selectedChannelId={channel}
            savedScrollTopRef={channelScrollRef}
            channels={channelList}
          />
        </div>
      );
      break;
    case 'channelVideos':
      content = (
        <div ref={containerRefs.channelVideos} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="p-2">
            <button className="btn btn-sm btn-outline-secondary mb-2" onClick={handleGoBack}>
              ← Back to Channels
            </button>
          </div>
          <ChannelVideos channelId={channel} onVideoClick={handleVideoClick} setView={() => {}} />
        </div>
      );
      break;
    case 'videoSummary':
      content = (
        <div ref={containerRefs.videoSummary} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
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
            <button className="btn btn-sm btn-outline-secondary mb-2" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
          <VideoSummary
            videoId={selectedVideoId}
            summaryData={videoSummaryData}
            containerRef={containerRefs.videoSummary}
          />
        </div>
      );
      break;
    default:
      content = <div className="p-3">Unknown view</div>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      {sidebarOpen && (
        <MobileSidebar
          currentView={view}
          onSelectView={(newView) => {
            setView(newView);
            setCurrentView(newView);
            setSidebarOpen(false);
          }}
        />
      )}
      {content}
    </div>
  );
}

export default MobileLayout;
