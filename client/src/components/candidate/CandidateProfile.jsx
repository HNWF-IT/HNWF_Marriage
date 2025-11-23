import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Image, 
  ListGroup 
} from 'react-bootstrap';
// Make sure to import Bootstrap CSS in your main file
// import 'bootstrap/dist/css/bootstrap.min.css';
import { calculateAge } from "../../utils/helper";
import CandidateAPI from '../../api/candidate';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const fetchCandidate = async (candidId) => {
      setLoading(true);
      try {
        const response = await CandidateAPI.getCandidateById(candidId);
        if(response.data.success && response.data.data) {
          setCandidate(response.data.data);
        }
      } catch (error) {
        const message = error?.message || "Something went wrong";
        toast.error(message);
      } finally {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };
  
    fetchCandidate(id);
  }, [id]);

  // Calculate age
  /*
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  */


  if(loading) {
    return <>Loading...</>
  }

  return (
    <Container fluid className="container-page-fluid">
      {/* Decorative header */}
      <Card className="card-modern-glass mb-4">
        <Card.Body className="p-4 bg-gradient-primary text-white">
          <h1 className="display-5 fw-bold mb-2">Matrimonial Profile</h1>
          <p className="text-light mb-0">Reference ID: MA-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
        </Card.Body>
      </Card>

      {candidate ? (
        <>
          {/* Main Content */}
          <Card className="card-modern-glass mb-4">
            <Card.Body className="p-4">
              {/* Top section with name and primary info */}
              <Row className="mb-4 pb-3 border-bottom">
                <Col xs={12} md={3} className="d-flex justify-content-center">
                  <div className="profile-photo-placeholder">
                    <span className="text-muted fs-lg">Photo</span>
                  </div>
                </Col>
              <Col xs={12} md={9}>
                <h2 className="fw-bold text-dark">{candidate.name}</h2>
                <p className="text-success fw-medium">
                  {candidate.qualification} • {candidate.sourceOfIncome}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Badge bg="success" className="rounded-pill px-3 py-2">
                    {calculateAge(candidate.dob)} Years
                  </Badge>
                  <Badge bg="success" className="rounded-pill px-3 py-2">
                    {candidate.height}
                  </Badge>
                  <Badge bg="success" className="rounded-pill px-3 py-2">
                    {candidate.city}
                  </Badge>
                  <Badge bg="success" className="rounded-pill px-3 py-2">
                    {candidate.maslak}
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* Information sections */}
            <Row className="g-4">
              {/* Personal Details */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">👤</span>
                      Personal Details
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Gender</span>
                        <span className="fw-medium">{candidate.gender}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Marital Status</span>
                        <span className="fw-medium">{candidate.maritalStatus}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Date of Birth</span>
                        <span className="fw-medium">{new Date(candidate.dob).toLocaleDateString()}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Nationality</span>
                        <span className="fw-medium">{candidate.nationality}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">Health</span>
                        <span className="fw-medium">{candidate.healthCondition}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Family Background */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">👪</span>
                      Family Background
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Father's Name</span>
                        <span className="fw-medium">{candidate.fatherName}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Father's Occupation</span>
                        <span className="fw-medium">{candidate.fatherOccupation}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Mother's Name</span>
                        <span className="fw-medium">{candidate.mother}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Siblings</span>
                        <span className="fw-medium">{candidate.siblings}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">Caste</span>
                        <span className="fw-medium">{candidate.caste}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Education & Career */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">🎓</span>
                      Education & Career
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Qualification</span>
                        <span className="fw-medium">{candidate.qualification}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">Source of Income</span>
                        <span className="fw-medium">{candidate.sourceOfIncome}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Religious Information */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">🕌</span>
                      Religious Information
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Muslim Status</span>
                        <span className="fw-medium">{candidate.muslimStatus}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">Maslak</span>
                        <span className="fw-medium">{candidate.maslak}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Residence */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">🏠</span>
                      Residence
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">City</span>
                        <span className="fw-medium">{candidate.city}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">Area</span>
                        <span className="fw-medium">{candidate.area}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span className="text-muted">House Type</span>
                        <span className="fw-medium">{candidate.house}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">House Size</span>
                        <span className="fw-medium">{candidate.houseSize}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              {/* Contact */}
              <Col xs={12} md={6}>
                <Card className="h-100 glass-card-light">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span className="profile-section-icon">📱</span>
                      Contact Information
                    </h3>
                  </Card.Header>
                  <Card.Body className="pt-2">
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between border-bottom-0">
                        <span className="text-muted">Phone Number</span>
                        <span className="fw-medium">{candidate.contact}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            </Card.Body>
          </Card>

          {/* Footer */}
          <Card className="card-modern-glass">
            <Card.Body className="p-4 bg-success text-white">
              <Row>
                <Col xs={12} md={6}>
                  <p className="mb-md-0">Generated on {new Date().toLocaleDateString()}</p>
                </Col>
                <Col xs={12} md={6} className="text-md-end">
                  <p className="mb-0">Confidential - For matrimonial purposes only</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
        </>
      ) : "No Candidate Found"}
    </Container>
  );
};

export default CandidateProfile;