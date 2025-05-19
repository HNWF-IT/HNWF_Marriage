import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatsCard from './StatsCard';

const StatsCardRow = ({ stats }) => {
  const cardsPerRow = 3;
  const total = stats.length;
  const fullRows = Math.floor(total / cardsPerRow);
  const itemsInLastRow = total % cardsPerRow;

  return (
    <div className="container-fluid p-3">
      <Row className="g-3 justify-content-center">
        {stats.map((stat, index) => {
          const isInLastRow = index >= fullRows * cardsPerRow;

          // Center the last row if it has 1 or 2 items
          const colProps = { xs: 12, sm: 6, md: 3 };
          const shouldCenter =
            isInLastRow && itemsInLastRow > 0 && itemsInLastRow < cardsPerRow;

          return (
            <Col
              key={index}
              {...colProps}
              className={shouldCenter ? 'd-flex justify-content-center' : ''}
            >
              <div style={shouldCenter ? { width: '100%' } : {}}>
                <StatsCard {...stat} />
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StatsCardRow;
