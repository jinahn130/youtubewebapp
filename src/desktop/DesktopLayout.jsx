import React, { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';

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
  sidebarCollapsed,
  toggleSidebar,
  containerRef,
  resizerRef,
  videoSummaryWidth,
  isDragging,
  startResizing
}) {
  const scrollContainerRef = useRef(null);
  const [viewStateMap, setViewStateMap] = useState({});

  const updateViewState = (key, partial) => {
    setViewStateMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...partial },
    }));
    console.log(`[SAVE] updateViewState('${key}') →`, { ...viewStateMap[key], ...partial });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    const scrollTop = viewStateMap.channel?.scrollTop;
    if (view === 'channel' && el && typeof scrollTop === 'number') {
    setTimeout(() => {
      requestAnimationFrame(() => {
        el.scrollTop = scrollTop;
        console.log('[FINAL RESTORE] HARD-APPLIED scrollTop', scrollTop);
      });
    }, 0);
    }
  }, [view]);

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
      <div
        style={{
          width: sidebarCollapsed ? '3rem' : '16rem',
          transition: 'width 0.2s ease',
          borderRight: '1px solid #dee2e6',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Sidebar setView={setView} view={view} collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          if (view === 'channel') {
            updateViewState('channel', {
              ...viewStateMap.channel,
              scrollTop: e.currentTarget.scrollTop,
            });
          }
        }}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          minWidth: 0,
          padding: '1rem',
        }}
      >
        <MainContent
          view={view}
          setView={setView}
          selectedVideoId={selectedVideoId}
          setSelectedVideoId={onVideoSelect}
          setChannel={setChannel}
          selectedChannel={channel}
          viewState={viewStateMap}
          updateViewState={updateViewState}
          channelList={channelList}
          recentVideos={recentVideos}
        />
      </div>
    </div>
  );
}

export default DesktopLayout;
