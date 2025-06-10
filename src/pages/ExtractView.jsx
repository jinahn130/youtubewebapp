import React, { useState, useEffect } from 'react';
import MarketInsights from '../components/MarketInsights';

const formatDate = (date) => date.toISOString().slice(0, 10);

const getLast30WeekdaysUpToCutoff = () => {
  const dates = [];
  const now = new Date();

  const currentUTC = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isPastCutoff = currentUTC >= 12.75;

  let day = new Date(now);
  const isWeekday = day.getUTCDay() >= 1 && day.getUTCDay() <= 5;
  if (!(isWeekday && isPastCutoff)) {
    day.setUTCDate(day.getUTCDate() - 1);
  }

  while (dates.length < 31) {
    const dow = day.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      dates.push(formatDate(new Date(day)));
    }
    day.setUTCDate(day.getUTCDate() - 1);
  }

  return dates;
};

function ExtractView({ onVideoClick, viewState = {}, updateViewState = () => {} }) {
  const dates = getLast30WeekdaysUpToCutoff();
  const [selectedDate, setSelectedDate] = useState(viewState.selectedDate || dates[0]);
  const [dailyExtract, setDailyExtract] = useState(viewState.dailyExtract || null);

  const generateCollapsedMap = (data) => {
    if (!data) return {};
    const collapsedState = {};
    data.theme_idea_analysis?.forEach((_, idx) => (collapsedState[`theme_${idx}`] = true));
    data.frequently_mentioned_stocks?.forEach((_, idx) => (collapsedState[`freq_${idx}`] = true));
    data.top_recommended_stocks?.forEach((_, idx) => (collapsedState[`rec_${idx}`] = true));
    data.most_anticipated_events?.forEach((_, idx) => (collapsedState[`event_${idx}`] = true));
    return collapsedState;
  };

  const collapsedByDate = viewState.collapsedByDate || {};
  const [collapsed, setCollapsed] = useState(
    collapsedByDate[selectedDate] || generateCollapsedMap(viewState.dailyExtract)
  );

  const [lastInteractedKey, setLastInteractedKey] = useState(viewState.lastInteractedKey || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const alreadyCached = viewState.dailyExtract && viewState.selectedDate === selectedDate;
    if (alreadyCached) {
      setDailyExtract(viewState.dailyExtract);
      return;
    }

    const fetchExtract = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://digestjutsu.com/GetDigest?digest_date=${selectedDate}`);
        const json = await res.json();
        setDailyExtract(json);

        // Reset collapsed state for new date
        const nextCollapsed = collapsedByDate[selectedDate] || generateCollapsedMap(json);
        setCollapsed(nextCollapsed);
      } catch (err) {
        setError('Insights unavailable for this date :(');
        setDailyExtract(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExtract();
  }, [selectedDate]);

  // ⏺ Persist all relevant view state
  useEffect(() => updateViewState({ selectedDate }), [selectedDate]);
  useEffect(() => updateViewState({ dailyExtract }), [dailyExtract]);
  useEffect(() => {
    updateViewState({
      collapsedByDate: {
        ...collapsedByDate,
        [selectedDate]: collapsed,
      },
    });
  }, [collapsed]);
  useEffect(() => updateViewState({ lastInteractedKey }), [lastInteractedKey]);

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
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          lastInteractedKey={lastInteractedKey}
          setLastInteractedKey={setLastInteractedKey}
        />
      )}
    </div>
  );
}

export default ExtractView;
