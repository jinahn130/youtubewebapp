import React, { useState, useRef, useEffect } from 'react';
import MarketInsights from '../components/MarketInsights';

const formatDate = (date) => date.toISOString().slice(0, 10);

// Returns the last 31 weekdays
const getLast30WeekdaysUpToCutoff = () => {
  const dates = [];
  const now = new Date();
  const currentUTC = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isPastCutoff = currentUTC >= 12.5;

  let day = new Date(now);
  const isWeekday = day.getUTCDay() >= 1 && day.getUTCDay() <= 5;
  if (!(isWeekday && isPastCutoff)) {
    day.setUTCDate(day.getUTCDate() - 1);
  }

  while (dates.length < 31) {
    const dow = day.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      dates.push(formatDate(day));
    }
    day.setUTCDate(day.getUTCDate() - 1);
  }

  return dates;
};

function ExtractView({ onVideoClick }) {
  const containerRef = useRef(null);
  const dates = getLast30WeekdaysUpToCutoff();
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [dailyExtract, setDailyExtract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore scroll position
  useEffect(() => {
    const scrollTop = localStorage.getItem('extractScrollTop');
    if (containerRef.current && scrollTop) {
      containerRef.current.scrollTop = parseInt(scrollTop, 10);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      localStorage.setItem('extractScrollTop', container.scrollTop);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchExtract = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://digestjutsu.com/GetDigest?digest_date=${selectedDate}`);
        const json = await res.json();
        setDailyExtract(json);
      } catch (err) {
        setError('Insights unavailable for this date :(');
        setDailyExtract(null);
      } finally {
        setLoading(false);
      }
    };
    fetchExtract();
  }, [selectedDate]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '1rem',
        minWidth: 0,
        flexShrink: 1,
        backgroundColor: '#f8f9fa',
      }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            marginRight: '0.5rem',
          }}
        >
          Select Date:
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '0.3rem 0.5rem',
            fontSize: '0.85rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            maxHeight: '150px',
            overflowY: 'auto',
          }}
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <h5 className="mb-3">📅 Daily Extract</h5>
      {loading && <div style={{ fontSize: '0.85rem' }}>Loading...</div>}
      {error && (
        <div style={{ color: 'red', fontSize: '0.85rem' }}>{error}</div>
      )}
      {dailyExtract && (
        <MarketInsights
          data={dailyExtract}
          onVideoClick={onVideoClick}
          videoMetadata={dailyExtract.video_metadata || []}
        />
      )}
    </div>
  );
}

export default ExtractView;
