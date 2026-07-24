import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-ring">
        <div className="loader-pulse"></div>
        <div className="loader-globe">🌍</div>
      </div>
      <h2>Retrieving NASA Feeds...</h2>
      <p>Mapping active natural events in real-time</p>
    </div>
  );
};

export default Loader;
