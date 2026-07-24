import React from 'react';

const LocationInfoBox = ({ event, onClose }) => {
  if (!event) return null;

  const { id, title, date, categories, sources } = event.properties;
  const geometry = event.geometry;

  const getCoordinatesString = (geom) => {
    if (!geom || !geom.coordinates) return 'N/A';
    const { type, coordinates } = geom;
    if (type === 'Point') {
      return `${coordinates[1].toFixed(4)}° N, ${coordinates[0].toFixed(4)}° E`;
    }
    // Handle polygon or line string by getting first point
    if (Array.isArray(coordinates[0])) {
      const firstCoord = Array.isArray(coordinates[0][0]) ? coordinates[0][0] : coordinates[0];
      return `${firstCoord[1].toFixed(4)}° N, ${firstCoord[0].toFixed(4)}° E (Area)`;
    }
    return 'N/A';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const categoryName = categories?.[0]?.title || 'Unknown';
  const categoryId = categories?.[0]?.id || '';

  const getCategoryClass = (catId) => {
    switch (catId) {
      case 'wildfires': return 'tag-fire';
      case 'severeStorms': return 'tag-storm';
      case 'volcanoes': return 'tag-volcano';
      case 'seaLakeIce': return 'tag-ice';
      default: return 'tag-default';
    }
  };

  return (
    <div className="location-info-panel">
      <div className="info-header">
        <span className={`category-tag ${getCategoryClass(categoryId)}`}>
          {categoryName}
        </span>
        <button className="close-btn" onClick={onClose} aria-label="Close panel">×</button>
      </div>

      <div className="info-body">
        <h2 className="info-title">{title}</h2>
        
        <div className="info-meta">
          <div className="info-meta-item">
            <span className="meta-label">Event ID</span>
            <span className="meta-value">{id}</span>
          </div>
          <div className="info-meta-item">
            <span className="meta-label">Date Reported</span>
            <span className="meta-value">{formatDate(date)}</span>
          </div>
          <div className="info-meta-item">
            <span className="meta-label">Location</span>
            <span className="meta-value">{getCoordinatesString(geometry)}</span>
          </div>
        </div>

        {sources && sources.length > 0 && (
          <div className="info-sources">
            <h3>Sources</h3>
            <div className="sources-list">
              {sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {src.id} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfoBox;
