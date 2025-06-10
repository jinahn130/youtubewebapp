import React, { useState, useRef, useEffect } from 'react';
import MarketInsights from '../components/MMarketInsights';


const formatDate = (date) => date.toISOString().slice(0, 10);

const getLast30WeekdaysUpToCutoff = () => {
  const dates = [];
  const now = new Date();

  // 12:45 PM UTC cutoff (7:45 AM EST)
  const currentUTC = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isPastCutoff = currentUTC >= 12.75;

  let day = new Date(now);

  // Only include today if it's a weekday and we're past the cutoff
  const isWeekday = day.getUTCDay() >= 1 && day.getUTCDay() <= 5;
  if (!(isWeekday && isPastCutoff)) {
    day.setUTCDate(day.getUTCDate() - 1); // fallback to yesterday
  }

  // Collect 31 past weekdays
  while (dates.length < 31) {
    const dow = day.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      dates.push(formatDate(new Date(day))); // clone for safety
    }
    day.setUTCDate(day.getUTCDate() - 1);
  }

  return dates;
};

function ExtractView({ onVideoClick, viewState = {}, updateViewState = () => {} }) {
  const dates = getLast30WeekdaysUpToCutoff();
  const [selectedDate, setSelectedDate] = useState(viewState.selectedDate || dates[0]);
  const [dailyExtract, setDailyExtract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    updateViewState({ selectedDate });
  }, [selectedDate]);

  return (
    <div
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
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">📅 Daily Extract</h5>
        <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 500 }}>Date:</span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-select form-select-sm"
            style={{
              fontSize: '0.85rem',
              padding: '0.25rem 0.5rem',
              height: 'auto',
              lineHeight: '1.2',
              borderRadius: '8px',
              border: '1px solid #ccc',
              minWidth: '120px',
            }}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div style={{ fontSize: '0.85rem' }}>Loading...</div>}
      {error && <div style={{ color: 'red', fontSize: '0.85rem' }}>{error}</div>}

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
