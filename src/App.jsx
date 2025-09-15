import React, { useState, useRef, useEffect, useCallback } from 'react';
import DesktopLayout from './desktop/DesktopLayout';
import MobileLayout from './mobile/MobileLayout';
import VideoSummary from './components/VideoSummary';
import SitePauseNotice from './components/SitePauseNotice';
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


  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoSummaryData, setVideoSummaryData] = useState(null);
  const [channel, setChannel] = useState(null);
  const [channelList, setChannelList] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [recentVideosPage, setRecentVideosPage] = useState(1);
  const [hasMoreRecentVideos, setHasMoreRecentVideos] = useState(true);

  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const isResizing = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Site pause notice state
  const [showPauseNotice, setShowPauseNotice] = useState(() => {
    return localStorage.getItem('sitePauseNoticeSeen') !== 'true';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [videoSummaryWidth, setVideoSummaryWidth] = useState(() => {
    const saved = localStorage.getItem('videoSummaryWidth');
    return saved ? parseInt(saved, 10) : 400;
  });

  // Define fetchRecentVideos outside useEffect so it can be used by multiple effects
  const fetchRecentVideos = useCallback(async (page = 1) => {
    try {
      // COMMENTED OUT: Dynamic 30-day recent videos for production pause
      // const res = await fetch('https://digestjutsu.com/GetRecentVideosMetadata?days=30');

      // Calculate date range for pagination
      // Page 1: Sept 9 - Aug 11, 2025 (30 days)
      // Page 2: Aug 10 - July 12, 2025 (30 days)
      // etc.
      const baseDate = new Date('2025-09-09T23:59:59.999Z');
      const startDaysOffset = (page - 1) * 30;
      const endDaysOffset = page * 30;

      const endDate = new Date(baseDate);
      endDate.setDate(endDate.getDate() - startDaysOffset);

      const startDate = new Date(baseDate);
      startDate.setDate(startDate.getDate() - endDaysOffset);

      // Fetch enough days to get historical data (increase as needed)
      const totalDaysToFetch = Math.max(120, page * 35); // Fetch more days for later pages
      const res = await fetch(`https://digestjutsu.com/GetRecentVideosMetadata?days=${totalDaysToFetch}`);
      const parsed = await res.json();

      // FILTER: Only show videos in the current page's date range
      const filteredVideos = parsed.filter(video => {
        const publishedDate = new Date(video.published_at);
        return publishedDate >= startDate && publishedDate <= endDate;
      });

      setRecentVideos(filteredVideos);

      // Check if there are more videos for the next page
      const nextPageStartDate = new Date(baseDate);
      nextPageStartDate.setDate(nextPageStartDate.getDate() - (page * 30));
      const nextPageEndDate = new Date(baseDate);
      nextPageEndDate.setDate(nextPageEndDate.getDate() - ((page + 1) * 30));

      const hasNextPageVideos = parsed.some(video => {
        const publishedDate = new Date(video.published_at);
        return publishedDate >= nextPageEndDate && publishedDate <= nextPageStartDate;
      });

      setHasMoreRecentVideos(hasNextPageVideos);
    } catch (err) {
      console.error('Failed to fetch recent videos:', err);
      setHasMoreRecentVideos(false);
    }
  }, []);

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

    fetchChannelList();
    fetchRecentVideos();
  }, []);

  // Fetch videos when page changes
  useEffect(() => {
    fetchRecentVideos(recentVideosPage);
  }, [recentVideosPage]);

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

  const handleClosePauseNotice = () => {
    localStorage.setItem('sitePauseNoticeSeen', 'true');
    setShowPauseNotice(false);
  };

  const handlePreviousPage = () => {
    if (recentVideosPage > 1) {
      setRecentVideosPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMoreRecentVideos) {
      setRecentVideosPage(prev => prev + 1);
    }
  };

  function startResizing() {
    isResizing.current = true;
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isResizing.current) return;
      const containerRight = containerRef.current?.getBoundingClientRect().right || window.innerWidth;
      const newWidth = containerRight - e.clientX;
      const maxAllowed = Math.max(3000, window.innerWidth - 300); // or any big number
      if (newWidth > 300 && newWidth < maxAllowed) {
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
      <>
        <div className="safe-swipe-wrapper">
          <MobileLayout
            onVideoSelect={handleVideoSelect}
            selectedVideoId={selectedVideoId}
            videoSummaryData={videoSummaryData}
            channel={channel}
            setChannel={setChannel}
            channelList={channelList}
            recentVideos={recentVideos}
            recentVideosPage={recentVideosPage}
            hasMoreRecentVideos={hasMoreRecentVideos}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
        <SitePauseNotice
          isOpen={showPauseNotice}
          onClose={handleClosePauseNotice}
        />
      </>
    );
  }

  return (
    <>
      <DesktopLayout
        onVideoSelect={handleVideoSelect}
        selectedVideoId={selectedVideoId}
        videoSummaryData={videoSummaryData}
        channel={channel}
        setChannel={setChannel}
        channelList={channelList}
        recentVideos={recentVideos}
        recentVideosPage={recentVideosPage}
        hasMoreRecentVideos={hasMoreRecentVideos}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        containerRef={containerRef}
        resizerRef={resizerRef}
        videoSummaryWidth={videoSummaryWidth}
        isDragging={isDragging}
        startResizing={startResizing}
      />
      <SitePauseNotice
        isOpen={showPauseNotice}
        onClose={handleClosePauseNotice}
      />
    </>
  );
}

export default App;