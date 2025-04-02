import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { 
  PeopleFill, 
  HeartFill, 
  PersonCheckFill 
} from 'react-bootstrap-icons';

const CandidateStatsCard = () => {
  const totalCandidates = 1500;
  const marriedCandidates = 450;
  const singleCandidates = 1050;

  const stats = [
    {
      icon: <PeopleFill size={40} className="text-primary" />,
      label: "Total Candidates",
      value: totalCandidates,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary"
    },
    {
      icon: <HeartFill size={40} className="text-success" />,
      label: "Married",
      value: marriedCandidates,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <PersonCheckFill size={40} className="text-warning" />,
      label: "Single",
      value: singleCandidates,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning"
    }
  ];

  return (
    <div className="container-fluid p-3">
      <Row className="g-3">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={4} className="text-center">
            <div 
              className={`
                d-flex 
                align-items-center 
                justify-content-center 
                p-3 
                rounded 
                ${stat.bgColor}
                position-relative
                overflow-hidden
              `}
              style={{ 
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transformOrigin: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="me-3">
                {stat.icon}
              </div>
              <div>
                <h6 className="mb-1 text-muted">{stat.label}</h6>
                <div 
                  className={`h4 mb-0 ${stat.textColor} fw-bold`}
                >
                  {stat.value.toLocaleString()}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CandidateStatsCard;