import React from 'react';

function About({ isMobile = false }) {
  if (isMobile) {
    // 🟢 Mobile / Tablet Layout (iPad, phones, etc.)
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fff',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <div className="text-center mb-4">
          <img
            src="../digestjutsu-logo.png"
            alt="DigestJutsu"
            style={{
              height: '120px',
              maxWidth: '100%',
              objectFit: 'contain',
              opacity: 0.9,
            }}
          />
        </div>

        <h5 className="mb-3 text-center">
          <strong>DigestJutsu</strong> helps you keep up with the stock market — without spending hours watching finance YouTubers.
        </h5>

        <p>
          Most creators stretch their content for ad revenue, but the real insights are often buried deep. This site cuts through the noise. Every day, DigestJutsu pulls the latest videos from top financial channels, summarizes the key takeaways, and surfaces what matters most — what people are buying, what they’re watching, and how the market is moving.
        </p>

        <h6 className="mt-4 mb-2">🧠 What it's for</h6>
        <ul>
          <li>Understand market sentiment today</li>
          <li>Spot stock picks mentioned across creators</li>
          <li>See what others are paying attention to</li>
          <li>Decide what you might want to buy or watch</li>
        </ul>

        <p>It’s your daily edge — built for people who want to invest better, without wasting time.</p>

        <h6 className="mt-4 mb-2">⏰ When it updates</h6>
        <p>
          New summaries are fetched every day at <strong>11:00 AM UTC</strong> <br />
          That’s <strong>7:00 AM EST / 4:00 AM PST</strong> — just in time to catch the market open.
        </p>

        <h6 className="mt-4 mb-2">💡 Why it's free</h6>
        <p>
          DigestJutsu is completely free to use. To keep it running, I’ll add a few light ads to help cover infrastructure and data processing costs. Nothing flashy — just enough to keep the lights on.
        </p>

        <hr />

        <p style={{ fontSize: '0.9rem' }}>
          Thanks for using DigestJutsu — I built this to help you cut through the noise and invest with clarity.
        </p>
        <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
          Contact: <a href="mailto:jinahn132@gmail.com">jinahn132@gmail.com</a>
        </p>
      </div>
    );
  }

  // 🔵 Desktop Layout (unchanged original version)
  return (
    <div className="p-3" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Footer Logo */}
      <div className="mt-auto text-center p-3">
        <img
          src="../digestjutsu-logo.png"
          alt="DigestJutsu"
          style={{
            height: '120px',
            maxWidth: '100%',
            objectFit: 'contain',
            opacity: 0.9,
          }}
        />
      </div>

      <h5 className="mb-3">
        <p>
          <strong>DigestJutsu</strong> helps you keep up with the stock market — without spending hours watching finance YouTubers.
        </p>
      </h5>

      <p>
        Most creators stretch their content for ad revenue, but the real insights are often buried deep. This site cuts through the noise. Every day, DigestJutsu pulls the latest videos from top financial channels, summarizes the key takeaways, and surfaces what matters most — what people are buying, what they’re watching, and how the market is moving.
      </p>

      <h6 className="mt-4 mb-2">🧠 What it's for</h6>
      <ul>
        <li>Understand market sentiment today</li>
        <li>Spot stock picks mentioned across creators</li>
        <li>See what others are paying attention to</li>
        <li>Decide what you might want to buy or watch</li>
      </ul>

      <p>It’s your daily edge — built for people who want to invest better, without wasting time.</p>

      <h6 className="mt-4 mb-2">⏰ When it updates</h6>
      <p>
        New summaries are fetched every day at <strong>11:00 AM UTC</strong> <br />
        That’s <strong>7:00 AM EST / 4:00 AM PST</strong> — just in time to catch the market open.
      </p>

      <h6 className="mt-4 mb-2">💡 Why it's free</h6>
      <p>
        DigestJutsu is completely free to use. To keep it running, I’ll add a few light ads to help cover infrastructure and data processing costs. Nothing flashy — just enough to keep the lights on.
      </p>

      <hr />

      <p style={{ fontSize: '0.9rem' }}>
        Thanks for using DigestJutsu — I built this to help you cut through the noise and invest with clarity.
      </p>
      <p className="text-muted" style={{ fontSize: '0.85rem' }}>
        Contact: <a href="mailto:jinahn132@gmail.com">jinahn132@gmail.com</a>
      </p>
    </div>
  );
}

export default About;
