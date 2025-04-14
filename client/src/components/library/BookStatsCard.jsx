import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { 
  BookFill,
  CheckCircleFill,
  ArrowLeftRight
} from 'react-bootstrap-icons';

const BookStatsCard = ({ books = [] }) => {
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'Available').length;
  const checkedOutBooks = books.filter(book => book.status === 'Checked Out').length;

  const stats = [
    {
      icon: <BookFill size={40} className="text-primary" />,
      label: "Total Books",
      value: totalBooks,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary"
    },
    {
      icon: <CheckCircleFill size={40} className="text-success" />,
      label: "Available",
      value: availableBooks,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <ArrowLeftRight size={40} className="text-warning" />,
      label: "Checked Out",
      value: checkedOutBooks,
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

export default BookStatsCard;