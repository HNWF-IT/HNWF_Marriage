import React from 'react';

const PulseDotLoader = ({ message = "Loading Data...", colors = ['#d4af37', '#c9a961', '#bea38b', '#b39daa'] }) => {
  return (
    <div className="pulse-loader-container">
      <div className="pulse-dots-container">
        {colors.map((color, i) => (
          <div
            key={i}
            className="pulse-dot"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default PulseDotLoader;