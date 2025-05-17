import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import VideoSummary from './components/VideoSummary';

function App() {

  const [view, setView] = useState(() => {
    return localStorage.getItem('activeView') || 'home';
  });
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [channel, setChannel] = useState(null);

  const handleViewChange = (newView) => {
    localStorage.setItem('activeView', newView);
    setView(newView);
  };
  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const isResizing = useRef(false);
  const channelScrollRef = useRef(null);

  // ✅ Persistent Sidebar State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  // ✅ Persistent Video Summary Width
  const [videoSummaryWidth, setVideoSummaryWidth] = useState(() => {
    const saved = localStorage.getItem('videoSummaryWidth');
    return saved ? parseInt(saved, 10) : 400;
  });

  // ✅ Drag indicator state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isResizing.current) return;
      const containerRight = containerRef.current.getBoundingClientRect().right;
      const newWidth = containerRight - e.clientX;

      if (newWidth > 300 && newWidth < 1000) {
        setVideoSummaryWidth(newWidth);
        localStorage.setItem('videoSummaryWidth', newWidth);
      }
    }

    function handleMouseUp() {
      isResizing.current = false;
      setIsDragging(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  function startResizing() {
    isResizing.current = true;
    setIsDragging(true);
  }

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  }

  return (
<div
  className="container-fluid"
  ref={containerRef}
  style={{
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  }}
>
  {/* Sidebar */}
  <nav
    className="d-flex flex-column"
    style={{
      width: sidebarCollapsed ? '60px' : '160px',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      flexShrink: 0,
      height: '100vh',
      borderRight: '1px solid #dee2e6',
      backgroundColor: '#f5f1e8',
    }}
  >
    <Sidebar
      onSelectView={handleViewChange}
      currentView={view}          // ✅ Pass active view
      collapsed={sidebarCollapsed}
      toggleCollapse={toggleSidebar}
    />
  </nav>

  {/* Main */}
  <main
    className="flex-grow-1 d-flex flex-column"
    style={{
      minWidth: 0,
      flexShrink: 1,
      overflow: 'hidden', // ← this is critical
    }}
  >
    <MainContent
      view={view}
      setView={handleViewChange}
      setSelectedVideoId={setSelectedVideoId}
      setChannel={(channelId) => {
        setChannel(channelId);
        setView('channelVideos');
      }}
      selectedChannel={channel}
      channelScrollRef={channelScrollRef}
    />
  </main>

  {/* Resizer */}
  <div
    ref={resizerRef}
    onMouseDown={startResizing}
    style={{
      width: '6px',
      cursor: 'col-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      userSelect: 'none',
    }}
  >
    <div
      style={{
        width: '2px',
        height: '90%',
        borderRadius: '1px',
        backgroundColor: isDragging ? '#666' : '#bbb',
        opacity: isDragging ? 1 : 0.3,
        transition: 'opacity 0.2s ease, background-color 0.2s ease',
      }}
    />
  </div>

  {/* Video Summary */}
  <aside
    className="p-4 bg-light"
    style={{
      width: `${videoSummaryWidth}px`,
      minWidth: 200,
      maxWidth: 1300,
      flexShrink: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <VideoSummary videoId={selectedVideoId} />
  </aside>
</div>
  );
}

export default App;
