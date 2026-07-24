import React from 'react';

const Header = ({ stats, theme, setTheme }) => {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-logo">🌍</span>
        <div className="brand-text">
          <h1>Natura</h1>
          <p className="brand-sub">Natural Event Tracker</p>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      
      {stats && (
        <div className="header-stats">
          <div className="stat-card" title="Wildfires">
            <span className="stat-icon">🔥</span>
            <span className="stat-count">{stats.wildfires || 0}</span>
          </div>
          <div className="stat-card" title="Severe Storms">
            <span className="stat-icon">🌀</span>
            <span className="stat-count">{stats.severeStorms || 0}</span>
          </div>
          <div className="stat-card" title="Volcanoes">
            <span className="stat-icon">🌋</span>
            <span className="stat-count">{stats.volcanoes || 0}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
