import React from 'react';
import Sidebar from './Sidebar';
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
  startResizing,
}) {
  return (
    <div
      className="container-fluid"
      ref={containerRef}
      style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}
    >
      <Sidebar
        view={view}
        setView={setView}
        collapsed={sidebarCollapsed}
        toggleCollapsed={toggleSidebar}
      />

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
        <MainContent
          view={view}
          setView={setView}
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={onVideoSelect}
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
          channelScrollRef={channelScrollRef}
          channelList={channelList}
          recentVideos={recentVideos}
          containerRef={containerRef}
        />
      </main>

      {/* Vertical Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={startResizing}
        style={{ width: '4px', cursor: 'col-resize', backgroundColor: isDragging ? '#007bff' : '#dee2e6' }}
      />

      {/* Video Summary Panel */}
      <aside
        style={{
          width: `${videoSummaryWidth}px`,
          transition: isDragging ? 'none' : 'width 0.3s ease',
          borderLeft: '1px solid #dee2e6',
          backgroundColor: '#f9f9f9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
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
