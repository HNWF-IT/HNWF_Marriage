import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const PageHeader = ({
  icon,
  title,
  subtitle,
  actionButton
}) => {
  return (
    <Row className="section-spacing">
      <Col>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="page-title">
              {icon && <span className="me-2">{icon}</span>}
              {title}
            </h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </div>
      </Col>
    </Row>
  );
};

export default PageHeader;
