import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Collapse, Table, Pagination, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CandidateModal from './CandidateModal';
import CandidateAPI from '../../api/candidate';
import { toast } from 'react-toastify';
import CandidateStatsCard from './CandidateStatsCard';
import PulseDotLoader from '../commons/spinner/PulseDotLoader';
import { Education, Gender, MaritalStatus, MuslimStatus } from '../../enums/candidateEnums';
import { calculateAge } from "../../utils/helper";
import { Link } from 'react-router-dom';
import { 
  PeopleFill, 
  HeartFill, 
  PersonCheckFill 
} from 'react-bootstrap-icons';
import StatsCardRow from '../commons/stats/StatsCardRow';

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

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await CandidateAPI.getAllCandidates();
        if(response.data.success && response.data.data) {
          setCandidates(response.data.data);
          sessionStorage.setItem('candidates', JSON.stringify(response.data.data));
        }
      } catch (error) {
        const message = error?.message || "Something went wrong";
        toast.error(message);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };
  
    const cached = sessionStorage.getItem('candidates');
    if (cached) {
      setCandidates(JSON.parse(cached));
    } else {
      fetchCandidates();
    }
  }, []);

  const filteredCandidates = candidates?.filter(candidate => {
    return (
      (!filters.minAge || candidate.age >= parseInt(filters.minAge)) &&
      (!filters.maxAge || candidate.age <= parseInt(filters.maxAge)) &&
      (filters.gender === '' || candidate.gender === filters.gender) &&
      (filters.maritalStatus === '' || candidate.maritalStatus === filters.maritalStatus) &&
      (filters.qualification === '' || candidate.qualification === filters.qualification) &&
      // candidate.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      (filters.muslimStatus === '' || candidate.muslimStatus === filters.muslimStatus)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [loading, setLoading] = useState(false);

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageCandidates = filteredCandidates?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      name: '',
      minAge: '',
      maxAge: '',
      gender: '',
      maritalStatus: '',
      qualification: '',
      city: '',
      muslimStatus: '',
    });
    setCandidates(initialCandidatesNew);
  };

  /*const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };*/

  const handleCandidateAddOrUpdate = (newCandidate, mode) => {
    if(mode === "add") {
      setCandidates((prev) => [...prev, newCandidate]); // Update the state
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
        value: candidates.length,
        bgColor: "bg-primary-subtle",
        textColor: "text-primary"
      },
      {
        icon: <HeartFill size={40} className="text-success" />,
        label: "Married",
        value: candidates.filter(c => c.maritalStatus === "Married").length,
        bgColor: "bg-success-subtle",
        textColor: "text-success"
      },
      {
        icon: <PersonCheckFill size={40} className="text-warning" />,
        label: "Single",
        value: candidates.filter(c => c.maritalStatus === "Single").length,
        bgColor: "bg-warning-subtle",
        textColor: "text-warning"
      }
    ];

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
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0" style={{color: "#A49559"}}>Candidate Dashboard</h2>
              <div className="d-flex flex-row justify-content-center align-items-center p-2 gap-3">
                <Button 
                  variant="outline-success" 
                  onClick={() => handleShow('add', {})}
                  className="d-flex align-items-center me-2"
                  size='sm'
                >
                  <i className="bi bi-plus"></i>
                  Add
                </Button>

                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="d-flex align-items-center"
                  size='sm'
                >
                  <i className="bi bi-sliders2"></i>
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Stats cards */}
            <StatsCardRow stats={candidatesStats} />

            {/* Main Search */}
            <InputGroup className="mb-4">
              <InputGroup.Text className="bg-white">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search candidates by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="border-start-0"
              />
            </InputGroup>

            {/* Advanced Filters */}
            <Collapse in={showFilters}>
              <div>
                <Row className="mb-4 g-3">
                  <Col md={2} className='d-flex'>
                      <Form.Group style={{width: '50%'}}>
                          <Form.Label>Min Age</Form.Label>
                          <Form.Control
                          type="number"
                          name="minAge"
                          value={filters.minAge}
                          onChange={(e) => handleFilterChange('minAge', e.target.value)}
                          placeholder="Min"
                          min="12"
                          />
                      </Form.Group>

                      <Form.Group style={{width: '50%', marginLeft: '10px'}}>
                          <Form.Label>Max Age</Form.Label>
                          <Form.Control
                          type="number"
                          name="maxAge"
                          value={filters.maxAge}
                          onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                          placeholder="Max"
                          min="12"
                          />
                      </Form.Group>
                    </Col>
                    
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Gender</Form.Label>
                          <Form.Select name="gender" 
                            value={filters.gender}
                            onChange={(e) => handleFilterChange('gender', e.target.value)}
                            >
                            <option value="">All</option>
                            {Object.values(Gender).map((gender) => (
                              <option key={gender} value={gender}>
                                {gender}
                              </option>
                            ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={2}>
                      <Form.Group>
                          <Form.Label>Marital Status</Form.Label>
                          <Form.Select name="maritalStatus"
                              value={filters.maritalStatus}
                              onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                          >
                          <option value="">All</option>
                          {Object.values(MaritalStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={2}>
                      <Form.Group>
                          <Form.Label>Qualification</Form.Label>
                          <Form.Select name="qualification"
                              value={filters.qualification}
                              onChange={(e) => handleFilterChange('qualification', e.target.value)}
                          >
                          <option value="">All</option>
                          {Object.values(Education).map((edu) => (
                            <option key={edu} value={edu}>
                              {edu}
                            </option>
                          ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={2}>
                      <Form.Group>
                          <Form.Label>Muslim Status</Form.Label>
                          <Form.Select name="muslimStatus"
                              value={filters.muslimStatus}
                              onChange={(e) => handleFilterChange('muslimStatus', e.target.value)}
                          >
                          <option value="">All</option>
                          {Object.values(MuslimStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                          </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          placeholder="City"
                          value={filters.city}
                          onChange={(e) => handleFilterChange('city', e.target.value)}
                          className="border-start-0"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col xs={12} className="text-end">
                      <Button className="me-2"
                          onClick={resetFilters}
                          style={{backgroundColor: "#A49559"}}
                      >
                          Reset
                      </Button>
                  </Col>
                </Row>
              </div>
            </Collapse>

            { loading ? 
              (<PulseDotLoader />) : 
              (<>
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="bg-light">
                      <tr key="head">
                        <th style={{ cursor: 'pointer' }}>
                          Sr#
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Gender
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Age 
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Marital Status
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Maslak
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Caste
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Qualification
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Health Condition
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Location
                        </th>
                        <th style={{ cursor: 'pointer' }}>
                          Muslim Status
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageCandidates?.map((candidate, index) => ( 
                        <tr key={candidate._id}>
                          <td>{index + 1}</td>
                          <td>
                          <Badge pill bg={candidate.gender === 'Male' ? 'primary' : 'danger'}>
                            {candidate.gender}
                          </Badge>
                          </td>
                          <td>{calculateAge(candidate.dob)}</td>
                          <td>{candidate.maritalStatus}</td>
                          <td>{candidate.maslak}</td>
                          <td>{candidate.caste}</td>
                          <td>{candidate.qualification}</td>
                          <td>{candidate.healthCondition}</td>
                          <td>
                            <i className="bi bi-geo-alt me-1"></i>
                            {candidate.city}
                          </td>
                          <td>{candidate.muslimStatus}</td>

                          <td>
                            <Button 
                              variant="light"
                              size="sm"
                              className="me-1"
                              onClick={() => handleShow('edit', candidate)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>

                            <Link to={`/candidates/${candidate._id}`}>
                              <Button variant="light" size="sm">
                                <i className="bi bi-three-dots-vertical"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {currentPageCandidates?.length === 0 && (
                    <div className="text-center py-5">
                      <i className="bi bi-search display-1 text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-0">No candidates found matching your search.</p>
                    </div>
                  )}
                </div>

                <Row className="d-flex justify-content-between">
                <Col className="text-center">
                <Button style={{backgroundColor: "#4C6C44", border: "#4C6C44"}}>
                    Prev
                  </Button>
                </Col>

                <Col className="text-center">
                <Pagination className="justify-content-center custom-pagination">
                    <Pagination.Prev
                      onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(Math.ceil(filteredCandidates?.length / itemsPerPage)).keys()].map((number) => (
                      <Pagination.Item
                        key={number + 1}
                        active={number + 1 === currentPage}
                        onClick={() => {
                          setCurrentPage(number + 1);
                          paginate(number + 1);
                        }}
                      >
                        {number + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) =>
                          prev < Math.ceil(filteredCandidates?.length / itemsPerPage) ? prev + 1 : prev
                        )
                      }
                      disabled={currentPage === Math.ceil(filteredCandidates?.length / itemsPerPage)}
                    />
                  </Pagination>
                </Col>

                <Col className="text-center">
                  <Button style={{backgroundColor: "#4C6C44", border: "#4C6C44"}}>
                    Next
                  </Button>
                </Col>
                </Row>
              </>
            )}

          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default CandidateDashboard;
