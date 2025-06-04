import React, { useEffect, useState } from 'react';
import MarketInsights from '../components/MarketInsights';

const getPast30Dates = () => {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

function ExtractView({ onVideoClick }) {
  const [selectedDate, setSelectedDate] = useState(getPast30Dates()[0]);
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`https://digestjutsu.com/GetDigest?digest_date=${selectedDate}`);
        const json = await res.json();
        setInsightsData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedDate]);

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">📅 Daily Extract</h5>
        <select
          className="form-select form-select-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          {getPast30Dates().map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}

      {insightsData && (
        <>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#6c757d' }}>
          This extract was aggregated from {insightsData.count} YouTube videos.
        </div>
        <MarketInsights
          data={insightsData}
          onVideoClick={onVideoClick}
          videoMetadata={insightsData.video_metadata || []}
        />
        </>
      )}
    </div>
  );
}

export default ExtractView;
