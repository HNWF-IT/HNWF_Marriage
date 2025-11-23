import React from 'react';
import { Card, Stack } from 'react-bootstrap';

const StatsCard = ({ icon, label, value, bgColor, textColor }) => {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <Card
      className={`stat-card-glass p-3 text-start ${bgColor}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack direction="horizontal" gap={3}>
        <div>{icon}</div>
        <div>
          <h6 className="mb-1 text-muted">{label}</h6>
          <div className={`h4 fw-bold ${textColor}`}>{value.toLocaleString()}</div>
        </div>
      </Stack>
    </Card>
  );
};

export default StatsCard;
