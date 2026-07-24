import React from 'react';

const Sidebar = ({
  events,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedEvent,
  onEventSelect,
  isOpen,
  setIsOpen
}) => {
  const categoriesList = [
    { id: 'wildfires', label: 'Fires', icon: '🔥', color: '#ff4d4d' },
    { id: 'severeStorms', label: 'Storms', icon: '🌀', color: '#3399ff' },
    { id: 'volcanoes', label: 'Volcanoes', icon: '🌋', color: '#cc66ff' }
  ];

  const handleCategoryToggle = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const getEventCategoryIcon = (ev) => {
    const cat = ev.properties.categories?.[0]?.id;
    const matched = categoriesList.find(c => c.id === cat);
    return matched ? matched.icon : '⚠️';
  };

  // Limit rendering to 20 events to guarantee optimal browser performance
  const MAX_SIDEBAR_EVENTS = 20;
  const displayedEvents = events.slice(0, MAX_SIDEBAR_EVENTS);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '◀' : '▶'}
      </button>

      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>

        <div className="sidebar-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sidebar-section">
          <h3>Filters</h3>
          <div className="category-filters">
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategories.includes(cat.id) ? 'active' : ''}`}
                style={{ '--btn-color': cat.color }}
                onClick={() => handleCategoryToggle(cat.id)}
              >
                <span className="btn-icon">{cat.icon}</span>
                <span className="btn-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section event-list-section">
          <h3>Active Events ({events.length})</h3>
          <div className="event-list">
            {events.length === 0 ? (
              <div className="no-events">No active events found.</div>
            ) : (
              <>
                {displayedEvents.map(ev => {
                  const isSelected = selectedEvent && selectedEvent.properties.id === ev.properties.id;
                  return (
                    <div
                      key={ev.properties.id}
                      className={`event-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => onEventSelect(ev)}
                    >
                      <span className="event-item-icon">{getEventCategoryIcon(ev)}</span>
                      <div className="event-item-details">
                        <div className="event-item-title">{ev.properties.title}</div>
                      </div>
                    </div>
                  );
                })}
                {events.length > MAX_SIDEBAR_EVENTS && (
                  <div className="list-limit-notice">
                    Showing top {MAX_SIDEBAR_EVENTS}. Use search to filter.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
