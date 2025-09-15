# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React + Vite application that displays YouTube video summaries with a responsive design supporting both desktop and mobile layouts.

### Core Architecture

**Responsive Layout System**: The app uses a sophisticated device detection system (`matchMobile` function in App.jsx) that determines whether to render the desktop or mobile layout based on user agent, screen size, touch capability, and other factors. This includes special handling for bots and smart displays.

**Desktop Layout** (`src/desktop/DesktopLayout.jsx`):
- Three-panel layout: collapsible sidebar, main content area, and resizable video summary panel
- Sidebar can collapse to icon-only mode (60px width)
- Main content area can also be collapsed completely
- Video summary panel is resizable with mouse drag functionality
- View state management with localStorage persistence

**Mobile Layout** (`src/mobile/MobileLayout.jsx`):
- Stack-based navigation system with view history
- Touch gesture support for navigation (swipe left/right to go back/forward in view stack)
- Bottom navigation bar
- Views: recent videos, extract, channel list, channel videos, video summary, about

### Key Components

**State Management**:
- Global app state managed in App.jsx includes selected video, video summary data, channel data, and UI states
- Both layouts maintain their own view states and navigation history
- LocalStorage used for persistence of UI preferences (sidebar state, panel widths, active view)

**Data Fetching**:
- Channel list: `https://digestjutsu.com/GetPostAllChannel?method=get`
- Recent videos: `https://digestjutsu.com/GetRecentVideosMetadata?days=30`
- Video summaries: `https://digestjutsu.com/youtubeStockResearchReadS3SingleVideo?video_id=${videoId}`

**Video Summary**: Rich text display using `marked` library for markdown rendering, with font customization options and channel linking functionality.

### File Structure

- `src/desktop/` - Desktop-specific components and layouts
- `src/mobile/` - Mobile-specific components, layouts, and pages
- `src/components/` - Shared components (VideoSummary, Sidebar, etc.)
- `src/pages/` - Desktop page components (About, ChannelList, etc.)

### Libraries Used

- **React 18** with hooks for state management
- **Vite** for build tooling and development
- **Bootstrap 5.3.2** for CSS framework
- **Framer Motion** for animations
- **Fuse.js** for fuzzy search functionality
- **marked** for markdown rendering
- **react-device-detect** for device detection
- **react-icons** for icon components

### ESLint Configuration

The project uses modern ESLint configuration with React-specific rules:
- React Hooks rules enforced
- React Refresh rules for development
- Custom rule: unused variables with uppercase names are ignored
- Targets modern browser environments