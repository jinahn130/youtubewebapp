import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import FormattedParagraph from './FormattedParagraph';

const CollapsibleCard = ({ title, badge, icon, children, collapsed, setCollapsed, sectionKey }) => {
  const isOpen = !collapsed?.[sectionKey];

  const toggle = () => {
    setCollapsed?.((prev) => ({
      ...prev,
      [sectionKey]: !prev?.[sectionKey],
    }));
  };

  return (
    <div style={{
      borderRadius: '16px',
      marginBottom: '0.75rem',
      backgroundColor: '#fff',
      boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      <button
        onClick={toggle}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          padding: '0.75rem 1rem',
          fontWeight: 600,
          fontSize: '0.92rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.5rem' }}>
          {icon && <span>{icon}</span>}
          <span style={{ flex: 1 }}>{title}</span>
          {badge && (
            <span className="badge bg-secondary text-light" style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.25em 0.5em',
              borderRadius: '999px',
            }}>
              {badge}
            </span>
          )}
        </div>
        <span style={{ marginLeft: '0.5rem' }}>
          {isOpen ? <BsChevronDown /> : <BsChevronRight />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              padding: '0 1rem',
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MarketInsights = ({ data, onVideoClick, videoMetadata = [], collapsed, setCollapsed, lastInteractedKey, setLastInteractedKey }) => {
  const textStyle = { fontSize: '0.88rem', color: '#555' };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      fontSize: '0.88rem',
      lineHeight: 1.5,
    }}>
      {data.count && (
        <div style={{ fontSize: '0.82rem', color: '#666', marginBottom: '0.5rem', marginTop: '0.25rem' }}>
          This extract was aggregated from {data.count} YouTube videos
        </div>
      )}

      <h5 style={{ margin: '1.25rem 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>📊 Theme, Ideas & Analysis</h5>
      {data.theme_idea_analysis.map((t, idx) => {
        const sectionKey = `theme_${idx}`;
        return (
          <CollapsibleCard
            key={sectionKey}
            sectionKey={sectionKey}
            title={t.theme.join(' / ')}
            icon={<span role="img" aria-label="theme">📁</span>}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setLastInteractedKey={setLastInteractedKey}
          >
            <div>
              <strong style={textStyle}>Ideas:</strong>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {t.ideas.map((i, j) => (
                  <li key={j} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    <FormattedParagraph
                      text={i.idea}
                      onVideoClick={onVideoClick}
                      videoMetadata={videoMetadata}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {Array.isArray(t.stock_mentions) && t.stock_mentions.length > 0 && (
              <div>
                <strong style={textStyle}>Stock Mentions:</strong>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  {t.stock_mentions.map((s, i) => (
                    <li key={i} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      <strong>{s.ticker}</strong> – {s.sentiment}
                      <div style={{ fontSize: '0.85rem', color: '#555' }}>
                        <FormattedParagraph
                          text={s.reason}
                          onVideoClick={onVideoClick}
                          videoMetadata={videoMetadata}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(t.global_events) && t.global_events.length > 0 && (
              <div>
                <strong style={textStyle}>Key Events:</strong>
                <ul style={{ paddingLeft: '1.25rem' }}>
                  {t.global_events.map((e, k) => (
                    <li key={k} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      <FormattedParagraph
                        text={e}
                        onVideoClick={onVideoClick}
                        videoMetadata={videoMetadata}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {t.market_sentiment && t.market_sentiment.trim() !== '' && (
              <div style={{
                fontSize: '0.80rem',
                color: '#888',
                fontStyle: 'italic',
                paddingLeft: '0.25rem',
                paddingTop: '0.1rem',
                paddingBottom: '1.25rem',
                lineHeight: '1.6',
              }}>
                Overall Sentiment: {t.market_sentiment}
              </div>
            )}
          </CollapsibleCard>
        );
      })}

      <h5 style={{ margin: '1.75rem 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>📌 Frequently Mentioned Stocks</h5>
      {data.frequently_mentioned_stocks.map((s, idx) => {
        const sectionKey = `freq_${idx}`;
        return (
          <CollapsibleCard
            key={sectionKey}
            sectionKey={sectionKey}
            title={s.ticker}
            icon={<span role="img" aria-label="stock">📈</span>}
            badge={`Mentions: ${s.mentions}`}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setLastInteractedKey={setLastInteractedKey}
          >
            {s.arguments.map((a, i) => (
              <div key={i}>
                <strong style={textStyle}>{a.youtuber}</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                  {a.argument.map((text, j) => (
                    <li key={j} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      <FormattedParagraph
                        text={text}
                        onVideoClick={onVideoClick}
                        videoMetadata={videoMetadata}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CollapsibleCard>
        );
      })}

      <h5 style={{ margin: '1.75rem 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>✅ Top Recommended Stocks</h5>
      {data.top_recommended_stocks.map((rec, idx) => (
        <CollapsibleCard
          key={`rec_${idx}`}
          sectionKey={`rec_${idx}`}
          title={rec.ticker}
          icon={<span role="img" aria-label="recommend">💡</span>}
          badge={`${rec.action.toUpperCase()} (${rec.confidence})`}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setLastInteractedKey={setLastInteractedKey}
        >
          <ul style={{ paddingLeft: '1.25rem' }}>
            <li style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              <FormattedParagraph
                text={rec.reason}
                onVideoClick={onVideoClick}
                videoMetadata={videoMetadata}
              />
            </li>
          </ul>
        </CollapsibleCard>
      ))}

      <h5 style={{ margin: '1.75rem 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>🗓 Most Anticipated Events</h5>
      {data.most_anticipated_events.map((e, idx) => (
        <CollapsibleCard
          key={`event_${idx}`}
          sectionKey={`event_${idx}`}
          title={e.event}
          icon={<span role="img" aria-label="event">🗓</span>}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setLastInteractedKey={setLastInteractedKey}
        >
          {e.impact && e.impact.trim() !== '' && (
            <div>
              <strong style={textStyle}>Impact</strong>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{e.impact}</li>
              </ul>
            </div>
          )}

          {e.context && e.context.trim() !== '' && (
            <div>
              <strong style={textStyle}>Context</strong>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  <FormattedParagraph
                    text={e.context}
                    onVideoClick={onVideoClick}
                    videoMetadata={videoMetadata}
                  />
                </li>
              </ul>
            </div>
          )}
        </CollapsibleCard>
      ))}
    </div>
  );
};

export default MarketInsights;
