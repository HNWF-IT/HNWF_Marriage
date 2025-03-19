import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <>
      {/* Main Content */}
      <div className="main-content flex-grow-1" style={{ backgroundColor: '#f0f0f0' }}>
      <Container fluid className="p-4">
        <Row className="mb-4">
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Upcoming Marriages</Card.Title>
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Top matches</Card.Title>
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Conducted Marriages</Card.Title>
                <div className="mt-3">
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                  <Card className="mb-3">
                    <Card.Body></Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </>
  );
};

export default Dashboard;