import React, { useState } from 'react';

const formatTextWithCitations = (text, onVideoClick) => {
  const parts = text.split(/(\[[A-Za-z0-9_-]{6,}\])/g);
  return parts.map((part, idx) =>
    /^\[[A-Za-z0-9_-]{6,}\]$/.test(part) ? (
      <a
        key={idx}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const videoId = part.slice(1, -1);
          if (onVideoClick) onVideoClick(videoId);
        }}
        style={{ color: '#0d6efd', textDecoration: 'underline' }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

const BulletList = ({ items, onVideoClick }) => (
  <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }}>
    {items.map((item, idx) => (
      <li key={idx} style={{ marginBottom: '0.3rem' }}>{formatTextWithCitations(item, onVideoClick)}</li>
    ))}
  </ul>
);

const StockList = ({ stocks }) => (
  <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }}>
    {stocks.map((s, idx) => (
      <li key={idx}>
        <strong>{s.ticker}</strong> – {s.sentiment} sentiment
        <div style={{ fontSize: '0.9rem', color: '#555' }}>{s.reason}</div>
      </li>
    ))}
  </ul>
);

const ThematicSection = ({ theme, onVideoClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '1rem',
        backgroundColor: '#fff',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          textAlign: 'left',
          padding: '1rem',
          fontWeight: '600',
          fontSize: '1.1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{theme.theme.join(' / ')}</span>
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
      </button>
      {open && (
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}><strong>Market Sentiment:</strong> {theme.market_sentiment}</div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Ideas:</strong></div>
          <BulletList items={theme.ideas.map(i => i.idea)} onVideoClick={onVideoClick} />
          {theme.stock_mentions.length > 0 && <>
            <div><strong>Stock Mentions:</strong></div>
            <StockList stocks={theme.stock_mentions} />
          </>}
          <div><strong>Key Events:</strong></div>
          <BulletList items={theme.global_events} onVideoClick={onVideoClick} />
        </div>
      )}
    </div>
  );
};

const ArgumentList = ({ argumentsList, onVideoClick }) => (
  <>
    {argumentsList.map((a, idx) => (
      <div key={idx} style={{ marginBottom: '1rem' }}>
        <strong>{a.ticker}</strong> (Mentions: {a.mentions})
        <ul>
          {a.arguments.map((arg, i) => (
            <li key={i}><em>{arg.youtuber}</em>
              <ul style={{ paddingLeft: '1rem' }}>
                {arg.argument.map((text, j) => (
                <li key={j}>
                    {renderTextWithCitations(text, onVideoClick)}
                </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

const RecommendationList = ({ recommendations, onVideoClick }) => (
  <ul style={{ paddingLeft: '1rem' }}>
    {recommendations.map((rec, idx) => (
      <li key={idx}>
        <strong>{rec.ticker}</strong> – {rec.action.toUpperCase()} ({rec.confidence} confidence)
            <div style={{ fontSize: '0.9rem', color: '#555' }}>
            {renderTextWithCitations(rec.reason, onVideoClick)}
            </div>
      </li>
    ))}
  </ul>
);

const EventList = ({ events, onVideoClick }) => (
  <ul style={{ paddingLeft: '1rem' }}>
    {events.map((e, idx) => (
      <li key={idx}>
        <strong>{e.event}</strong>
        <div style={{ fontSize: '0.9rem' }}>
          <em>Impact:</em> {e.impact}<br />
          <em>Context:</em> {formatTextWithCitations(e.context, onVideoClick)}
        </div>
      </li>
    ))}
  </ul>
);

function renderTextWithCitations(text, onVideoClick) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]$/);
    if (match) {
      const videoId = match[1];
      return (
        <a
          key={i}
          href="#"
          onClick={() => onVideoClick(videoId)}
          style={{ color: '#0d6efd', textDecoration: 'underline', margin: '0 0.2rem' }}
        >
          [{videoId}]
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MarketInsights({ data, onVideoClick }) {
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', lineHeight: 1.5, maxWidth: '100%' }}>
      <h3 style={{ marginBottom: '1rem' }}>📊 Theme, Ideas & Analysis</h3>
      {data.theme_idea_analysis.map((theme, idx) => (
        <ThematicSection key={idx} theme={theme} onVideoClick={onVideoClick} />
      ))}

      <h3 className="mt-4">📌 Frequently Mentioned Stocks</h3>
      <ArgumentList argumentsList={data.frequently_mentioned_stocks} onVideoClick={onVideoClick} />

      <h3 className="mt-4">✅ Top Recommended Stocks</h3>
      <RecommendationList recommendations={data.top_recommended_stocks} onVideoClick={onVideoClick} />


      <h3 className="mt-4">🗓 Most Anticipated Events</h3>
      <EventList events={data.most_anticipated_events} onVideoClick={onVideoClick} />
    </div>
  );
}
