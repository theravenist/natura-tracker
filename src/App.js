import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Loader from './components/Loader';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([
    'wildfires',
    'severeStorms',
    'volcanoes'
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Synchronize CSS class on body with React theme state
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events/geojson?days=90');
        const data = await res.json();
        
        if (data && data.features) {
          // Filter out sea & lake ice events immediately to improve performance
          const filtered = data.features.filter(
            ev => ev.properties.categories?.[0]?.id !== 'seaLakeIce'
          );
          setEventData(filtered);
        }
      } catch (err) {
        console.error('Error fetching NASA EONET events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Compute stats on all open events
  const stats = {
    wildfires: 0,
    severeStorms: 0,
    volcanoes: 0
  };

  eventData.forEach(ev => {
    const cat = ev.properties.categories?.[0]?.id;
    if (cat && cat in stats) {
      stats[cat]++;
    }
  });

  // Filter events based on active category toggles and search query
  const filteredEvents = eventData.filter(ev => {
    const cat = ev.properties.categories?.[0]?.id;
    const matchesCategory = selectedCategories.includes(cat);
    const matchesSearch = ev.properties.title
      ? ev.properties.title.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    return matchesCategory && matchesSearch;
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseInfo = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="app-container">
      <Header
        stats={stats}
        theme={theme}
        setTheme={setTheme}
      />
      
      {!loading ? (
        <div className="main-content">
          <Sidebar
            events={filteredEvents}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <div className={`map-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Map
              eventData={filteredEvents}
              selectedEvent={selectedEvent}
              onMarkerClick={handleEventSelect}
              onCloseInfo={handleCloseInfo}
              theme={theme}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
