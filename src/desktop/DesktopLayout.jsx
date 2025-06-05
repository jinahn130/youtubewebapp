import React, { useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';
import VideoSummary from '../components/VideoSummary';

function DesktopLayout({
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
  sidebarCollapsed,
  toggleSidebar,
  containerRef,
  resizerRef,
  videoSummaryWidth,
  isDragging,
  startResizing
}) {
  const [viewStateMap, setViewStateMap] = useState({});

  const updateViewState = (partial) => {
    setViewStateMap((prev) => ({
      ...prev,
      [view]: { ...prev[view], ...partial },
    }));
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
          collapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
          currentView={view}
          setView={setView}
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
          setView={setView}
          setSelectedVideoId={onVideoSelect}
          selectedVideoId={selectedVideoId}
          setChannel={(channelId) => {
            setChannel((prev) => {
              if (prev !== channelId) {
                setView('channelVideos');
                return channelId;
              } else {
                setView('');
                setTimeout(() => setView('channelVideos'), 0);
                return prev;
              }
            });
          }}
          selectedChannel={channel}
          channelList={channelList}
          recentVideos={recentVideos}
          viewState={viewStateMap[view] || {}}
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
          maxWidth: '1000px',
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
        />
      </aside>
    </div>
  );
}

export default DesktopLayout;
