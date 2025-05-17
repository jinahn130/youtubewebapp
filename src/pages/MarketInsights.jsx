// Updated MarketInsights.jsx with enforced wrapping in all text parts

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';

const formatTextWithCitations = (text, onVideoClick) => {
  const parts = text.split(/(\[[A-Za-z0-9_-]{6,}\])/g);
  return parts.map((part, idx) => {
    if (/^\[[A-Za-z0-9_-]{6,}\]$/.test(part)) {
      const videoId = part.slice(1, -1);
      return (
        <a
          key={idx}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onVideoClick) onVideoClick(videoId);
          }}
          style={{
            color: '#0d6efd',
            textDecoration: 'underline',
            margin: '0 0.2rem',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            minWidth: 0,
            maxWidth: '100%',
            display: 'inline-block',
          }}
        >
          {part}
        </a>
      );
    }
    return (
      <span
        key={idx}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          minWidth: 0,
          maxWidth: '100%',
          display: 'inline-block',
        }}
      >
        {part}
      </span>
    );
  });
};

const CollapsibleCard = ({ title, badge, icon, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '0.75rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        minWidth: 0,
        width: '100%',
        maxWidth: '100%',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          padding: '0.75rem 1rem',
          fontWeight: '500',
          fontSize: '0.95rem',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
          {icon && <span>{icon}</span>}
          <span
            style={{
              flex: 1,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              minWidth: 0,
              maxWidth: '100%',
              display: 'inline-block',
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              className="badge bg-secondary text-light"
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              {badge}
            </span>
          )}
        </div>
        <span>{open ? <BsChevronDown /> : <BsChevronRight />}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              padding: '0 1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.9rem',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0, maxWidth: '100%' }}>
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? React.cloneElement(child, {
                      style: {
                        ...(child.props.style || {}),
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        minWidth: 0,
                        maxWidth: '100%',
                      },
                    })
                  : child
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MarketInsights = ({ data, onVideoClick }) => {
  return (
    <div style={{
      padding: '1rem',
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
      minWidth: 0,
      width: '100%',
      maxWidth: '100%',
      flexShrink: 1,
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    }}>
      <h5 className="mb-3">📊 Theme, Ideas & Analysis</h5>
      {data.theme_idea_analysis.map((t, idx) => (
        <CollapsibleCard
          key={idx}
          title={t.theme.join(' / ')}
          icon={<span role="img" aria-label="theme">📁</span>}
          badge={t.market_sentiment}
        >
          <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><strong>Ideas:</strong><ul>{t.ideas.map((i, j) => <li key={j} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}>{formatTextWithCitations(i.idea, onVideoClick)}</li>)}</ul></div>
          {t.stock_mentions.length > 0 && (
            <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><strong>Stock Mentions:</strong><ul>{t.stock_mentions.map((s, i) => (
              <li key={i} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><strong>{s.ticker}</strong> – {s.sentiment}<div style={{ fontSize: '0.85rem', color: '#555' }}>{s.reason}</div></li>
            ))}</ul></div>
          )}
          <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><strong>Key Events:</strong><ul>{t.global_events.map((e, k) => <li key={k} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}>{formatTextWithCitations(e, onVideoClick)}</li>)}</ul></div>
        </CollapsibleCard>
      ))}

      <h5 className="mt-4">📌 Frequently Mentioned Stocks</h5>
      {data.frequently_mentioned_stocks.map((s, idx) => (
        <CollapsibleCard
          key={idx}
          title={s.ticker}
          icon={<span role="img" aria-label="stock">📈</span>}
          badge={`Mentions: ${s.mentions}`}
        >
          <ul>{s.arguments.map((a, i) => (
            <li key={i} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><em>{a.youtuber}</em><ul>{a.argument.map((text, j) => <li key={j} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}>{formatTextWithCitations(text, onVideoClick)}</li>)}</ul></li>
          ))}</ul>
        </CollapsibleCard>
      ))}

      <h5 className="mt-4">✅ Top Recommended Stocks</h5>
      {data.top_recommended_stocks.map((rec, idx) => (
        <CollapsibleCard
          key={idx}
          title={rec.ticker}
          icon={<span role="img" aria-label="recommend">💡</span>}
          badge={`${rec.action.toUpperCase()} (${rec.confidence})`}
        >
          <div style={{ fontSize: '0.9rem', color: '#555', wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}>{formatTextWithCitations(rec.reason, onVideoClick)}</div>
        </CollapsibleCard>
      ))}

      <h5 className="mt-4">🗓 Most Anticipated Events</h5>
      {data.most_anticipated_events.map((e, idx) => (
        <CollapsibleCard
          key={idx}
          title={e.event}
          icon={<span role="img" aria-label="event">📅</span>}
        >
          <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><em>Impact:</em> {e.impact}</div>
          <div style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0 }}><em>Context:</em> {formatTextWithCitations(e.context, onVideoClick)}</div>
        </CollapsibleCard>
      ))}
    </div>
  );
};

export default MarketInsights;
