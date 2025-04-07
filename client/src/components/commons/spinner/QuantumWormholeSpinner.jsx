import React from 'react';

const QuantumWormholeSpinner = ({ message = "Loading data..." }) => {
  return (
    <div className="wormhole-container">
      <div className="wormhole-spinner">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="wormhole-ring"
            style={{
              borderColor: `hsl(${i * 30}, 100%, 50%)`,
              transform: `rotateY(${i * 30}deg)`
            }}
          />
        ))}
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default QuantumWormholeSpinner;