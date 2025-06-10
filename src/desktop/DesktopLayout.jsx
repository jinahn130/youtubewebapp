import React, { useRef, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';
import VideoSummary from '../components/VideoSummary';

function DesktopLayout({
  onVideoSelect,
  selectedVideoId,
  videoSummaryData,
  channel,
  setChannel,
  channelList,
  recentVideos,
  sidebarCollapsed,
  toggleSidebar,
  containerRef,
  resizerRef,
  videoSummaryWidth,
  isDragging,
  startResizing,
  isMobile,
}) {
  const [view, setView] = useState(() => {
    const stored = localStorage.getItem('activeView');
    const validViews = ['recent', 'extract', 'channel', 'channelVideos'];
    return validViews.includes(stored) ? stored : 'recent';
  });

  const [viewStates, setViewStates] = useState({});
  const [lastChannelView, setLastChannelView] = useState('channel'); // Track last channel-related subview

  const updateViewState = (partial, v = view) => {
    setViewStates((prev) => ({
      ...prev,
      [v]: { ...prev[v], ...partial },
    }));
  };

  const viewState = viewStates[view] || {};

  const scrollRefs = useRef({});
  const [scrollStack, setScrollStack] = useState({});

  const updateViewScroll = (scrollTop, v = view) => {
    setScrollStack((prev) => ({
      ...prev,
      [v]: { ...prev[v], scrollTop },
    }));
  };

  useEffect(() => {
    localStorage.setItem('activeView', view);
  }, [view]);

  const wrappedSetView = (nextView) => {
    if (['channel', 'channelVideos'].includes(nextView)) {
      setLastChannelView(nextView);
    }
    setView(nextView);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarCollapsed ? '60px' : '160px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #dee2e6',
          backgroundColor: '#fff',
        }}
      >
        <Sidebar
          currentView={view}
          setView={(nextView) => {
            if (nextView === 'channel') {
              wrappedSetView(lastChannelView); // Restore last subview
            } else {
              wrappedSetView(nextView);
            }
          }}
          collapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <MainContent
          view={view}
          setView={wrappedSetView}
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={onVideoSelect}
          setChannel={(channelId) => {
            setChannel((prev) => {
              if (prev !== channelId) {
                wrappedSetView('channelVideos');
                return channelId;
              } else {
                setView('');
                setTimeout(() => wrappedSetView('channelVideos'), 0);
                return prev;
              }
            });
          }}
          selectedChannel={channel}
          channelList={channelList}
          recentVideos={recentVideos}
          scrollRefs={scrollRefs}
          scrollStack={scrollStack}
          updateViewScroll={updateViewScroll}
          isMobile={false}
          viewState={viewState}
          updateViewState={updateViewState}
        />
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={startResizing}
        style={{
          width: '6px',
          cursor: 'col-resize',
          backgroundColor: isDragging ? '#ccc' : '#f1f1f1',
          flexShrink: 0,
          zIndex: 10,
        }}
      />

      {/* Video Summary */}
      <aside
        style={{
          width: `${videoSummaryWidth}px`,
          minWidth: '300px',
          maxWidth: '1500px',
          flexShrink: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#fff',
          borderLeft: '1px solid #dee2e6',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <VideoSummary
          videoId={selectedVideoId}
          summaryData={videoSummaryData}
          containerRef={containerRef}
          onYoutuberClick={(channelId) => {
            const match = channelList.find((ch) => ch.channel_id === channelId);
            if (match) {
              setViewStates((prev) => ({
                ...prev,
                channel: {
                  ...prev.channel,
                  channelTag: match.channel_tag,
                  clickedChannel: match.channel_tag,
                }
              }));
              setChannel(channelId);
              wrappedSetView('channelVideos');
            }
          }}
          channelList={channelList}
        />
      </aside>
    </div>
  );
}

export default DesktopLayout;
