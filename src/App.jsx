import React, { useState, useRef, useEffect } from 'react';
import DesktopLayout from './desktop/DesktopLayout';
import MobileLayout from './mobile/MobileLayout';
import VideoSummary from './components/VideoSummary';

function App() {
  const [view, setView] = useState(() => {
    const stored = localStorage.getItem('activeView');
    const validViews = ['recent', 'extract', 'channel', 'channelVideos'];
    return validViews.includes(stored) ? stored : 'recent';
  });

  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoSummaryData, setVideoSummaryData] = useState(null);
  const [channel, setChannel] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);

  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const isResizing = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const channelScrollRef = useRef(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [videoSummaryWidth, setVideoSummaryWidth] = useState(() => {
    const saved = localStorage.getItem('videoSummaryWidth');
    return saved ? parseInt(saved, 10) : 400;
  });

  const handleViewChange = (newView) => {
    if (newView === 'channel') {
      setChannel(null);
    }
    localStorage.setItem('activeView', newView);
    setView(newView);
  };

  useEffect(() => {
    async function fetchChannelList() {
      try {
        const res = await fetch('https://digestjutsu.com/GetPostAllChannel?method=get');
        const parsed = await res.json();
        setChannelList(parsed);
      } catch (err) {
        console.error('Failed to fetch channel list:', err);
      }
    }

    async function fetchRecentVideos() {
      try {
        const res = await fetch('https://digestjutsu.com/GetRecentVideosMetadata?days=30');
        const parsed = await res.json();
        setRecentVideos(parsed);
      } catch (err) {
        console.error('Failed to fetch recent videos:', err);
      }
    }

    fetchChannelList();
    fetchRecentVideos();
  }, []);

  const handleVideoSelect = async (videoId) => {
    setSelectedVideoId(videoId);
    try {
      const res = await fetch(
        `https://digestjutsu.com/youtubeStockResearchReadS3SingleVideo?video_id=${videoId}`
      );
      const parsed = await res.json();
      setVideoSummaryData(parsed);
    } catch (err) {
      console.error('Failed to fetch video summary:', err);
      setVideoSummaryData(null);
    }
  };

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebarCollapsed', !prev);
      return !prev;
    });
  }

  function startResizing() {
    isResizing.current = true;
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isResizing.current) return;
      const containerRight = containerRef.current?.getBoundingClientRect().right || window.innerWidth;
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

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <MobileLayout
        view={view}
        setView={handleViewChange}
        onVideoSelect={handleVideoSelect}
        selectedVideoId={selectedVideoId}
        videoSummaryData={videoSummaryData}
        channel={channel}
        setChannel={setChannel}
        channelList={channelList}
        recentVideos={recentVideos}
        channelScrollRef={channelScrollRef}
      />
    );
  }

  return (
    <DesktopLayout
      view={view}
      setView={handleViewChange}
      onVideoSelect={handleVideoSelect}
      selectedVideoId={selectedVideoId}
      videoSummaryData={videoSummaryData}
      channel={channel}
      setChannel={setChannel}
      channelList={channelList}
      recentVideos={recentVideos}
      channelScrollRef={channelScrollRef}
      sidebarCollapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      containerRef={containerRef}
      resizerRef={resizerRef}
      videoSummaryWidth={videoSummaryWidth}
      isDragging={isDragging}
      startResizing={startResizing}
    />
  );
}

export default App;
