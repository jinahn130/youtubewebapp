import React, { useEffect, useRef, useState } from 'react';
import ChannelProfilePicture from '../components/ChannelProfilePicture';
import ChannelPopover from './ChannelPopover';

function formatSubs(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

function ChannelList({
  channels = [],
  onSelectChannel,
  viewState = {},
  updateViewState = () => {},
}) {
  const cardRefs = useRef({});
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [hoveredRef, setHoveredRef] = useState(null);
  const [isHoveringPopover, setIsHoveringPopover] = useState(false);
  const [mobilePopover, setMobilePopover] = useState({ anchor: null, channel: null });

  const [sortBy, setSortBy] = useState(viewState.sortBy ?? 'subscriber_count');
  const [query, setQuery] = useState(viewState.query ?? '');

  const clickedChannel = viewState.clickedChannel ?? null;
  const isMobile = window.innerWidth < 768;
  const hoverTimeout = useRef(null);

  useEffect(() => {
    updateViewState({ sortBy, query });
  }, [sortBy, query]);

  const sortedChannels = [...channels]
    .filter((ch) => {
      const lower = query.toLowerCase();
      return (
        ch.channel_tag.toLowerCase().includes(lower) ||
        ch.title.toLowerCase().includes(lower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'subscriber_count') return +b.subscriber_count - +a.subscriber_count;
      return a.channel_tag.localeCompare(b.channel_tag);
    });

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      if (!isHoveringPopover) setHoveredChannel(null);
    }, 1500);
  };

  const handleMobileBackdropClick = () => {
    if (mobilePopover.channel) {
      setMobilePopover({ anchor: null, channel: null });
    }
  };

  return (
    <div className="p-3" style={{ minHeight: '100%', width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">📺 Channels</h5>
        <div className="d-flex align-items-center gap-3 px-1" style={{ fontSize: '0.875rem' }}>
          <div
            style={{ cursor: 'pointer', fontWeight: 500 }}
            onClick={() => setSortBy(sortBy === 'subscriber_count' ? 'channel_tag' : 'subscriber_count')}
          >
            {sortBy === 'subscriber_count' ? 'Subscriber Count ▼' : 'Name ▼'}
          </div>
        </div>
      </div>

      <input
        className="form-control form-control-sm mb-3"
        placeholder="Search channels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {sortedChannels.map((channel) => {
        if (!cardRefs.current[channel.channel_tag]) {
          cardRefs.current[channel.channel_tag] = React.createRef();
        }
        const ref = cardRefs.current[channel.channel_tag];
        const isSelected = clickedChannel === channel.channel_tag;

        return (
          <div
            key={channel.channel_tag}
            ref={ref}
            onClick={() => {
              updateViewState({
                clickedChannel: channel.channel_tag,
                channelTag: channel.channel_tag,
              });
              onSelectChannel?.(channel.channel_tag); // optional, will do nothing if not passed
            }}
            className="d-flex align-items-center gap-3 p-2 mb-2 rounded border"
            style={{
              backgroundColor: isSelected ? '#eef6ff' : '#fff',
              border: isSelected ? '1px solid #0d6efd' : '1px solid #d4d7dc',
              cursor: 'pointer',
              boxShadow: isSelected
                ? '0 4px 12px rgba(13,110,253,0.15)'
                : '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                clearTimeout(hoverTimeout.current);
                setHoveredChannel(channel);
                setHoveredRef(ref);
                e.currentTarget.style.backgroundColor = '#f2f6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                handleMouseLeave();
                e.currentTarget.style.backgroundColor = isSelected ? '#eef6ff' : '#fff';
              }
            }}
          >
            <div
              onClick={(e) => {
                if (isMobile) {
                  e.stopPropagation();
                  setMobilePopover({ anchor: ref, channel });
                }
              }}
            >
              <ChannelProfilePicture url={channel.profile_picture} size={40} />
            </div>
            <div className="flex-grow-1">
              <div style={{ fontWeight: 600 }}>{channel.channel_tag.replace('@', '')}</div>
              <div className="text-muted small">{channel.title}</div>
            </div>
            <div className="badge bg-secondary">{formatSubs(+channel.subscriber_count)}</div>
          </div>
        );
      })}

      {hoveredChannel && hoveredRef && !isMobile && (
        <ChannelPopover
          anchorRef={hoveredRef}
          channel={hoveredChannel}
          isMobile={false}
          onMouseEnter={() => setIsHoveringPopover(true)}
          onMouseLeave={() => {
            setIsHoveringPopover(false);
            setHoveredChannel(null);
          }}
        />
      )}

      {mobilePopover.channel && (
        <>
          <div
            onClick={handleMobileBackdropClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <ChannelPopover
              anchorRef={mobilePopover.anchor}
              channel={mobilePopover.channel}
              isMobile={true}
              onClose={() => setMobilePopover({ anchor: null, channel: null })}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ChannelList;
