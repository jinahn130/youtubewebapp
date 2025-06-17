import React, { useRef, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';
import VideoSummary from '../components/VideoSummary';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
  const [lastChannelView, setLastChannelView] = useState('channel');
  const [scrollStack, setScrollStack] = useState({});
  const [mainContentCollapsed, setMainContentCollapsed] = useState(false);

  const scrollRefs = useRef({});
  const mainContentRef = useRef(null);

  const updateViewState = (partial, v = view) => {
    setViewStates((prev) => ({
      ...prev,
      [v]: { ...prev[v], ...partial },
    }));
  };

  const updateViewScroll = (scrollTop, v = view) => {
    setScrollStack((prev) => ({
      ...prev,
      [v]: { ...prev[v], scrollTop },
    }));
  };

  const viewState = viewStates[view] || {};

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
        position: 'relative',
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
              wrappedSetView(lastChannelView);
            } else {
              wrappedSetView(nextView);
            }
          }}
          collapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Main Content */}
        <div
          ref={mainContentRef}
          style={{
            flex: mainContentCollapsed ? '0 0 40px' : '1 1 auto',
            minWidth: mainContentCollapsed ? '40px' : '400px',
            maxWidth: '100%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            borderRight: '1px solid #dee2e6',
          }}
        >
          {mainContentCollapsed ? (
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                marginTop: '10px',
                alignSelf: 'center',
              }}
              onClick={() => setMainContentCollapsed(false)}
            >
              <FiChevronRight size={20} />
            </button>
          ) : (
            <>
              <button
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 20,
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setMainContentCollapsed(true)}
              >
                <FiChevronLeft size={18} />
              </button>
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
            </>
          )}
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
              flex: `0 0 ${videoSummaryWidth}px`, // this sets the exact width
              minWidth: '300px',                  // still enforce a minimum
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #dee2e6',
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
                  },
                }));
                setChannel(channelId);
                wrappedSetView('channelVideos');
              }
            }}
            channelList={channelList}
          />
        </aside>
      </div>
    </div>
  );
}

export default DesktopLayout;
