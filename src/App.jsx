import React, { useState, useRef, useEffect } from 'react';
import DesktopLayout from './desktop/DesktopLayout';
import MobileLayout from './mobile/MobileLayout';
import VideoSummary from './components/VideoSummary';
import './App.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => matchMobile(window));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(matchMobile(window));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function matchMobile(win) {
  const ua = (win.navigator.userAgent || '').toLowerCase();
  const width = win.innerWidth;
  const height = win.innerHeight;
  const touchCapable = 'ontouchstart' in win || win.navigator.maxTouchPoints > 0;

  const knownMobileKeywords = [
    'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'mini', 'windows ce',
    'palm', 'nexus', 'sm-', 'pixel', 'kindle', 'silk', 'mobile', 'tablet',
    'touch', 'surface', 'playbook', 'opera mini', 'opera mobi', 'fennec',
    'nintendo', 'bb10', 'meego', 'googlehome', 'nesthub', 'nest hub'
  ];

  const matchesUA = knownMobileKeywords.some((keyword) => ua.includes(keyword));

  // 👇 Force mobile mode for AdSense/Mediapartners bots
  const isAdSenseBot = ua.includes('adsense') || ua.includes('googlebot') || ua.includes('mediapartners');

  // Optional: Allow override via URL for debugging
  const urlOverride = win.location.search.includes('forceMobile=true');

  if (isAdSenseBot || urlOverride) return true;
  
  const isSmartDisplay = ua.includes('crkey') || ua.includes('nesthub');
  const isIpadWithTouch = ua.includes('macintosh') && touchCapable;
  const isScreenNarrow = width < 1024;
  const isTabletSize = touchCapable && (width <= 1366 && height <= 1024);

  return touchCapable && (matchesUA || isSmartDisplay || isIpadWithTouch || isScreenNarrow || isTabletSize);
}

function App() {
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <div className="safe-swipe-wrapper">
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
        />
      </div>
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