import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Collapse, Table, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CandidateModal from './CandidateModal';
import CandidateAPI from '../../api/candidate';
import { toast } from 'react-toastify';
import PulseDotLoader from '../commons/spinner/PulseDotLoader';
import { Education, Gender, MaritalStatus, MuslimStatus } from '../../enums/candidateEnums';
import { calculateAge } from "../../utils/helper";
import { Link } from 'react-router-dom';
import { 
  PeopleFill, 
  HeartFill, 
  PersonCheckFill, 
  Search,
  Filter,
  PersonPlusFill,
  GeoAltFill,
  PencilSquare,
  CheckCircleFill,
  ThreeDotsVertical,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';
import StatsCardRow from '../commons/stats/StatsCardRow';

const CANDIDATES_PER_BATCH = 50;

const CandidateDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',  
    maritalStatus: '',
    qualification: '',
    muslimStatus: '',
    city: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [batch, setBatch] = useState(1);
  const [totalBatches, setTotalBatches] = useState(null);
  const [willingStatus, setWillingStatus] = useState('Seeking');
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async (batchNo) => {
    setLoading(true);
    try {
      const filters = {};
      if (willingStatus !== "") {
        filters.willingStatus = willingStatus;
      }

      const response = await CandidateAPI.getCandidatesBatch(batchNo, filters);
      if(response.data.success && response.data.data) {
        const { candidates, totalCount } = response.data.data;

        setCandidates(candidates);
        if (totalCount) {
          setTotalBatches(Math.ceil(totalCount / CANDIDATES_PER_BATCH));
        }
      }
    } catch (error) {
      const message = error?.message || "Something went wrong";
      toast.error(message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(batch);
  }, [batch, willingStatus]);

  const filteredCandidates = candidates?.filter(candidate => {
    const candidateAge = calculateAge(candidate.dob);
    return (
      (!filters.minAge || candidateAge >= parseInt(filters.minAge)) &&
      (!filters.maxAge || candidateAge <= parseInt(filters.maxAge)) &&
      (filters.gender === '' || candidate.gender === filters.gender) &&
      (filters.maritalStatus === '' || candidate.maritalStatus === filters.maritalStatus) &&
      (filters.qualification === '' || candidate.qualification === filters.qualification) &&
      candidate.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      (filters.muslimStatus === '' || candidate.muslimStatus === filters.muslimStatus)
    );
  });

  const handleClose = () => {
    setMode('');
    setSelectedCandidate({});
    setShowModal(false);
  }

  const handleShow = (openMode, candidateData) => {
    setMode(openMode);
    setSelectedCandidate(candidateData);
    setShowModal(true);
  }
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      gender: '',
      minAge: '',
      maxAge: '',
      maritalStatus: '',
      qualification: '',
      muslimStatus: '',
      city: ''
    });
  };

  const handleCandidateAddOrUpdate = (newCandidate, mode) => {
    if(mode === "add") {
      setCandidates((prev) => [...prev, newCandidate]);
    } else if(mode === "edit") {
      setCandidates(prevCandidates =>
        prevCandidates.map(candidate =>
          candidate._id === newCandidate._id ? newCandidate : candidate
        )
      );
    }
  };

  const candidatesStats = [
    {
      icon: <PeopleFill size={40} className="text-primary" />,
      label: "Total Candidates",
      value: filteredCandidates.length,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary"
    },
    {
      icon: <HeartFill size={40} className="text-success" />,
      label: "Married",
      value: filteredCandidates.filter(c => c.maritalStatus === "Married").length,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <PersonCheckFill size={40} className="text-warning" />,
      label: "Single",
      value: filteredCandidates.filter(c => c.maritalStatus === "Single").length,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning"
    }
  ];

  const handleNextBatch = () => {
    if (totalBatches && batch < totalBatches) {
      const next = batch + 1;
      setBatch(next);
      fetchCandidates(next);
    }
  };

  const handlePrevBatch = () => {
    if (batch > 1) {
      const prev = batch - 1;
      setBatch(prev);
      fetchCandidates(prev);
    }
  };

  const handleWillingnessChange = async (candidateId, newStatus) => {
    try {
      const response = await CandidateAPI.updateWillingnessStatus(candidateId, newStatus);

      if (response.data.success) {
        toast.success("Willingness status updated");

        setCandidates((prev) =>
          prev.map((c) =>
            c._id === candidateId ? { ...c, willingStatus: newStatus } : c
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update willingness status");
      }

    } catch (err) {
      console.error(err);
      toast.error("Error updating willingness status");
    }
  };

  if(loading) {
    return <PulseDotLoader />
  }

  return (
    <>
      { showModal ? <CandidateModal
        mode={mode}
        candidateData={selectedCandidate}
        show={showModal}
        handleClose={handleClose}
        onCandidateAddOrUpdate={handleCandidateAddOrUpdate}
      /> : ""}

      <Container fluid className="p-4 bg-light min-vh-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 fw-bold" style={{color: "#A49559"}}>
            Candidate Dashboard
          </h2>
          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              onClick={() => handleShow('add', {})}
              className="d-flex align-items-center"
              size="sm"
            >
              <PersonPlusFill className="me-1" size={16} />
              Add
            </Button>

            <Button 
              variant="outline-primary" 
              onClick={() => setShowFilters(!showFilters)}
              className="d-flex align-items-center"
              size="sm"
            >
              <Filter className="me-1" size={16} />
              Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapse in={showFilters}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h6 className="mb-3">Filter Options</h6>
              <Row className="g-3">
                <Col md={2}>
                  <Form.Label>Age Range</Form.Label>
                  <div className="d-flex gap-1">
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => handleFilterChange('minAge', e.target.value)}
                      min="12"
                      size="sm"
                    />
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                      min="12"
                      size="sm"
                    />
                  </div>
                </Col>
                
                <Col md={2}>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select 
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    size="sm"
                  >
                    <option value="">All</option>
                    {Object.values(Gender).map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={2}>
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select 
                    value={filters.maritalStatus}
                    onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                    size="sm"
                  >
                    <option value="">All</option>
                    {Object.values(MaritalStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={2}>
                  <Form.Label>Qualification</Form.Label>
                  <Form.Select 
                    value={filters.qualification}
                    onChange={(e) => handleFilterChange('qualification', e.target.value)}
                    size="sm"
                  >
                    <option value="">All</option>
                    {Object.values(Education).map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={2}>
                  <Form.Label>Muslim Status</Form.Label>
                  <Form.Select 
                    value={filters.muslimStatus}
                    onChange={(e) => handleFilterChange('muslimStatus', e.target.value)}
                    size="sm"
                  >
                    <option value="">All</option>
                    {Object.values(MuslimStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col md={2}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    size="sm"
                  />
                </Col>
                
                <Col xs={12}>
                  <Button 
                    variant="outline-secondary"
                    onClick={resetFilters}
                    size="sm"
                  >
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Collapse>
        
        {/* Stats cards */}
        <StatsCardRow stats={candidatesStats} />
        
        {/* Search and Filter Controls */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={8} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search candidates..."
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <Filter size={16} />
                  </InputGroup.Text>
                  <Form.Select
                    value={willingStatus}
                    onChange={(e) => { setWillingStatus(e.target.value); setBatch(1); }}
                  >
                    <option value="">All Status</option>
                    <option value="Seeking">Seeking</option>
                    <option value="Done">Done</option>
                    <option value="On Hold">On Hold</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Results Table */}
        <Card className="shadow-sm">
          <Card.Body className="p-0">
            {filteredCandidates?.length > 0 ? (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle" style={{ fontSize: '0.875rem', borderCollapse: 'separate', borderSpacing: '0' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Sr#
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Gender
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Age
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Marital Status
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Maslak
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Caste
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Qualification
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Health
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Location
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Muslim Status
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Status
                        </th>
                        <th className="py-3 px-3 fw-semibold text-muted text-uppercase text-center" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates?.map((candidate, index) => ( 
                        <tr 
                          key={candidate._id} 
                          className="border-bottom"
                          style={{ 
                            borderBottom: '1px solid #e9ecef'
                          }}
                        >
                          <td className="py-3 px-3">
                            <span className="fw-medium text-dark">
                              {((batch - 1) * 50) + index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <Badge 
                              bg={candidate.gender === 'Male' ? 'primary' : 'danger'}
                              className="px-3 py-1 rounded-pill"
                              style={{ fontSize: '0.75rem', fontWeight: '500' }}
                            >
                              {candidate.gender}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <span className="fw-medium">{calculateAge(candidate.dob)}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-dark">{candidate.maritalStatus}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-muted">{candidate.maslak}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-muted">{candidate.caste}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-dark">{candidate.qualification}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-muted">{candidate.healthCondition}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="d-flex align-items-center">
                              <GeoAltFill className="text-muted me-1" size={12} />
                              <span className="text-dark">{candidate.city}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-dark">{candidate.muslimStatus}</span>
                          </td>
                          <td className="py-3 px-3">
                            <Badge 
                              bg={
                                candidate.willingStatus.toLowerCase() === 'seeking' ? 'success' : 
                                candidate.willingStatus.toLowerCase() === 'done' ? 'primary' : 'warning'
                              }
                              className="px-3 py-1 rounded-pill"
                              style={{ fontSize: '0.75rem', fontWeight: '500' }}
                            >
                              {candidate.willingStatus}
                            </Badge>
                          </td>
                          
                          <td className="py-3 px-3">
                            <div className="d-flex gap-1 justify-content-center">
                              <Button 
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleShow('edit', candidate)}
                                title="Edit"
                                className="border-0 p-1"
                                style={{ 
                                  width: '32px', 
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <PencilSquare size={12} />
                              </Button>

                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleWillingnessChange(candidate._id, "Done")}
                                title="Mark as Done"
                                className="border-0 p-1"
                                style={{ 
                                  width: '32px', 
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <CheckCircleFill size={12} />
                              </Button>

                              <Link to={`/candidates/${candidate._id}`}>
                                <Button 
                                  variant="outline-info" 
                                  size="sm"
                                  title="View Details"
                                  className="border-0 p-1"
                                  style={{ 
                                    width: '32px', 
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <ThreeDotsVertical size={12} />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="p-3 border-top" style={{ backgroundColor: '#f8f9fa' }}>
                  <Row className="align-items-center">
                    <Col xs={4}>
                      <Button
                        variant="outline-primary"
                        onClick={handlePrevBatch}
                        disabled={batch === 1}
                        size="sm"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>
                    </Col>
                    
                    <Col xs={4} className="text-center">
                      <span className="text-muted fw-medium">
                        Page {batch} of {totalBatches}
                      </span>
                    </Col>

                    <Col xs={4} className="text-end">
                      <Button
                        variant="outline-primary"
                        onClick={handleNextBatch}
                        disabled={batch === totalBatches}
                        size="sm"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <Search size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No candidates found</h5>
                <p className="text-muted">Try adjusting your filters or search criteria.</p>
                <Button variant="primary" onClick={resetFilters} size="sm">
                  Reset Filters
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CandidateDashboard;