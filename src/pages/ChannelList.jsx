import React, { useEffect, useRef } from 'react';

const channels = [
   {
      "channel_tag":"@MeetKevin",
      "channel_id":"UCUvvj5lwue7PspotMDjk5UA"
   },
   {
      "channel_tag":"@FinancialEducation",
      "channel_id":"UCnMn36GT_H0X-w5_ckLtlgQ"
   },
   {
      "channel_tag":"@StockMoe",
      "channel_id":"UCoMzWLaPjDJBbipihD694pQ"
   },
   {
      "channel_tag":"@AndreiJikh",
      "channel_id":"UCGy7SkBjcIAgTiwkXEtPnYg"
   },
   {
      "channel_tag":"@BenFelixCSI",
      "channel_id":"UCDXTQ8nWmx_EhZ2v-kp7QxA"
   },
   {
      "channel_tag":"@ThePlainBagel",
      "channel_id":"UCFCEuCsyWP0YkP3CZ3Mr01Q"
   },
   {
      "channel_tag":"@GrahamStephan",
      "channel_id":"UCV6KDgJskWaEckne5aPA0aQ"
   },
   {
      "channel_tag":"@MarkTilbury",
      "channel_id":"UCxgAuX3XZROujMmGphN_scA"
   },
   {
      "channel_tag":"@Value-Investing",
      "channel_id":"UCrTTBSUr0zhPU56UQljag5A"
   },
   {
      "channel_tag":"@JosephCarlsonShow",
      "channel_id":"UCbta0n8i6Rljh0obO7HzG9A"
   },
   {
      "channel_tag":"@WhiteBoardFinance",
      "channel_id":"UCL_v4tC26PvOFytV1_eEVSg"
   },
   {
      "channel_tag":"@TheInvestorChannel",
      "channel_id":"UC7r4-nZ4icT8SIcnisXFSHQ"
   }
];

function ChannelList({ onSelectChannel, selectedChannelId, savedScrollTopRef }) {
  const listRef = useRef(null);

  // Restore scroll position when component mounts
  useEffect(() => {
    if (listRef.current && savedScrollTopRef?.current != null) {
      setTimeout(() => {
        listRef.current.scrollTop = savedScrollTopRef.current;
      }, 0);
    }
  }, []);

  // Handle channel click and save scroll
  const handleSelect = (channelId) => {
    if (listRef.current) {
      savedScrollTopRef.current = listRef.current.scrollTop;
    }
    onSelectChannel(channelId);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '4px',
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
        }}
      >
        {channels.map((ch) => (
          <div
            key={ch.channel_id}
            onClick={() => handleSelect(ch.channel_id)}
            className="mb-2 p-2 d-flex flex-row align-items-center"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1.01)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }}
            style={{
              backgroundColor: selectedChannelId === ch.channel_id ? '#eef6ff' : 'transparent',
              borderRadius: '6px',
              minHeight: '60px',
              flexWrap: 'nowrap',
              overflow: 'hidden',
              minWidth: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ch.channel_tag)}&background=0D8ABC&color=fff&rounded=true&size=48`}
              alt={ch.channel_tag}
              width={40}
              height={40}
              className="rounded-circle me-3"
              style={{ objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, wordBreak: 'break-word' }}>
                {ch.channel_tag}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6c757d', wordBreak: 'break-word' }}>
                &lt;TODO: fetch metadata&gt;
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelList;
