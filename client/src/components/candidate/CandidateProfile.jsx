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

  // Custom styles for elements not easily styled with Bootstrap classes
  const styles = {
    header: {
      background: 'linear-gradient(to right, #4c6c44, #1e7e34)',
      color: 'white',
      padding: '2rem',
      position: 'relative'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      backgroundColor: 'white'
    },
    headerContent: {
      position: 'relative',
      zIndex: 10
    },
    photoPlaceholder: {
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      background: 'white',
      border: '4px solid white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#adb5bd',
      fontSize: '1.25rem',
      marginBottom: '1rem'
    },
    sectionIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#e8f5e9',
      color: '#28a745',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.5rem',
      fontSize: '0.875rem'
    },
    footer: {
      background: '#1e7e34',
      color: 'white',
      padding: '1.5rem',
      marginTop: '2rem'
    }
  };

  if(loading) {
    return <>Loading...</>
  }

  return (
    <Container className="my-4" style={{ maxWidth: '1000px' }}>
      {/* Decorative header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <h1 className="display-5 fw-bold">Matrimonial Profile</h1>
          <p className="text-light mt-2">Reference ID: MA-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
        </div>
      </div>

      {candidate ? (
        <>
          {/* Main Content */}
          <div className="bg-light p-4">
            {/* Top section with name and primary info */}
            <Row className="mb-4 pb-3 border-bottom">
              <Col xs={12} md={3} className="d-flex justify-content-center">
                <div style={styles.photoPlaceholder}>
                  <span>Photo</span>
                </div>
              </Col>
              <Col xs={12} md={9}>
                <h2 className="fw-bold text-dark">{candidate.name}</h2>
                <p className="text-success fw-medium">
                  {candidate.qualification} • {candidate.sourceOfIncome}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Badge bg="success" className="rounded-pill p-2">
                    {calculateAge(candidate.dob)} Years
                  </Badge>
                  <Badge bg="success" className="rounded-pill p-2">
                    {candidate.height}
                  </Badge>
                  <Badge bg="success" className="rounded-pill p-2">
                    {candidate.city}
                  </Badge>
                  <Badge bg="success" className="rounded-pill p-2">
                    {candidate.maslak}
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* Information sections */}
            <Row className="g-4">
              {/* Personal Details */}
              <Col xs={12} md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>👤</span>
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
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>👪</span>
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
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>🎓</span>
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
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>🕌</span>
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
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>🏠</span>
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
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white border-bottom-0">
                    <h3 className="h5 mb-0">
                      <span style={styles.sectionIcon}>📱</span>
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
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <Row>
              <Col xs={12} md={6}>
                <p className="mb-md-0">Generated on {new Date().toLocaleDateString()}</p>
              </Col>
              <Col xs={12} md={6} className="text-md-end">
                <p className="mb-0">Confidential - For matrimonial purposes only</p>
              </Col>
            </Row>
          </div>
          
        </>
      ) : "No Candidate Found"}
    </Container>
  );
};

export default CandidateProfile;