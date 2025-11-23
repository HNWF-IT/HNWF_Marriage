import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Badge, Button } from 'react-bootstrap';
import { PeopleFill, HeartFill, PersonCheckFill, Book, CollectionFill, PersonBadge, TrophyFill, ClockHistory, CheckCircleFill, GenderMale, GenderFemale, Telephone, GeoAlt, EnvelopeFill } from 'react-bootstrap-icons';
import DashboardAPI from '../../api/dashboard';
import { toast } from 'react-toastify';
import CenteredLoader from '../commons/spinner/CenteredLoader';
import StatsCardRow from '../commons/stats/StatsCardRow';
import SectionHeader from '../commons/headers/SectionHeader';
import { calculateAge } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [upcomingMarriages, setUpcomingMarriages] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [conductedMarriages, setConductedMarriages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes, matchesRes] = await Promise.all([
        DashboardAPI.getStats(),
        DashboardAPI.getRecentActivity(5),
        DashboardAPI.getTopMatches(5)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (activityRes.data.success) {
        setUpcomingMarriages(activityRes.data.data.upcomingMarriages);
        setConductedMarriages(activityRes.data.data.conductedMarriages);
      }

      if (matchesRes.data.success) {
        setTopMatches(matchesRes.data.data);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load dashboard data';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CenteredLoader message="Loading Dashboard..." />;
  }

  // Marriage Statistics
  const marriageStats = stats ? [
    {
      icon: <PeopleFill size={40} className="text-primary" />,
      label: "Total Candidates",
      value: stats.candidates.total,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary"
    },
    {
      icon: <ClockHistory size={40} className="text-warning" />,
      label: "Seeking Marriage",
      value: stats.candidates.seeking,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning"
    },
    {
      icon: <CheckCircleFill size={40} className="text-success" />,
      label: "Marriages Done",
      value: stats.candidates.done,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <HeartFill size={40} className="text-danger" />,
      label: "On Hold",
      value: stats.candidates.onHold,
      bgColor: "bg-danger-subtle",
      textColor: "text-danger"
    }
  ] : [];

  // Library Statistics
  const libraryStats = stats ? [
    {
      icon: <Book size={40} className="text-info" />,
      label: "Total Books",
      value: stats.books.total,
      bgColor: "bg-info-subtle",
      textColor: "text-info"
    },
    {
      icon: <CollectionFill size={40} className="text-success" />,
      label: "Available",
      value: stats.books.available,
      bgColor: "bg-success-subtle",
      textColor: "text-success"
    },
    {
      icon: <Book size={40} className="text-warning" />,
      label: "Checked Out",
      value: stats.books.checkedOut,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning"
    }
  ] : [];


  const renderCandidateCard = (candidate, showScore = false) => {
    const age = candidate.dob ? calculateAge(candidate.dob) : 'N/A';

    return (
      <Card
        className="mb-2 glass-card-light"
        key={candidate._id}
        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        onClick={() => navigate(`/candidates/${candidate._id}`)}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-semibold text-truncate me-2" style={{ fontSize: '0.9rem' }}>
                  {candidate.name}
                </span>
                <Badge
                  bg={candidate.gender === 'Male' ? 'primary' : 'danger'}
                  className="px-3 py-2 rounded-pill"
                  style={{ fontSize: '0.65rem' }}
                >
                  {candidate.gender === 'Male' ? <GenderMale size={10} /> : <GenderFemale size={10} />}
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-2 fs-sm">
                <span className="text-muted">{age} yrs</span>
                {candidate.city && (
                  <>
                    <span className="text-muted">•</span>
                    <span className="text-muted text-truncate">{candidate.city}</span>
                  </>
                )}
              </div>
            </div>
            {showScore && candidate.priorityScore && (
              <div className="text-center ms-2" style={{ minWidth: '45px' }}>
                <div className="fw-bold text-warning fs-md">
                  {candidate.priorityScore}
                </div>
                <div className="fs-xs text-muted">score</div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderMatchPair = (matchPair, index) => {
    const { male, female, matchScore, compatibility } = matchPair;
    const maleAge = male.dob ? calculateAge(male.dob) : 'N/A';
    const femaleAge = female.dob ? calculateAge(female.dob) : 'N/A';

    return (
      <Card key={index} className="mb-3 glass-card-light">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <TrophyFill className="text-warning" size={18} />
              <span className="fw-bold">Match #{index + 1}</span>
            </div>
            <Badge bg="warning" className="px-3 py-2 rounded-pill">
              Score: {matchScore}
            </Badge>
          </div>

          <Row className="g-2">
            <Col xs={6}>
              <div
                className="glass-panel"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/candidates/${male._id}`)}
              >
                <div className="d-flex align-items-center mb-1">
                  <GenderMale size={14} className="text-primary me-1" />
                  <span className="fw-semibold fs-base">{male.name}</span>
                </div>
                <div className="fs-sm text-muted">
                  {maleAge} yrs • {male.city || 'N/A'}
                </div>
              </div>
            </Col>

            <Col xs={6}>
              <div
                className="glass-panel"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/candidates/${female._id}`)}
              >
                <div className="d-flex align-items-center mb-1">
                  <GenderFemale size={14} className="text-danger me-1" />
                  <span className="fw-semibold fs-base">{female.name}</span>
                </div>
                <div className="fs-sm text-muted">
                  {femaleAge} yrs • {female.city || 'N/A'}
                </div>
              </div>
            </Col>
          </Row>

          {/* Compatibility indicators */}
          <div className="d-flex gap-1 mt-2 flex-wrap">
            {compatibility.sameCity && (
              <Badge bg="success" className="px-3 py-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                <GeoAlt size={10} className="me-1" />Same City
              </Badge>
            )}
            {compatibility.sameCaste && (
              <Badge bg="info" className="px-3 py-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                Same Caste
              </Badge>
            )}
            {compatibility.sameMaslak && (
              <Badge bg="secondary" className="px-3 py-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                Same Maslak
              </Badge>
            )}
            {compatibility.ageDifference !== null && (
              <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                Age diff: {Math.abs(compatibility.ageDifference)} yrs
              </Badge>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="container-page-fluid">
      {/* Statistics Section - Compact Layout */}
      <Row className="section-spacing">
        <Col lg={7} className="mb-3 mb-lg-0">
          <Card className="card-modern-glass h-100">
            <Card.Body className="p-4">
              <SectionHeader
                icon={<HeartFill size={18} />}
                title="Marriage Statistics"
                size="small"
                className="mb-3"
              />
              <Row className="g-2">
                {marriageStats.map((stat, index) => (
                  <Col xs={6} md={3} key={index}>
                    <div className="stat-card-glass text-center">
                      <div className={stat.textColor} style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        {stat.label}
                      </div>
                      <div className={`fw-bold ${stat.textColor}`} style={{ fontSize: '1.5rem' }}>
                        {stat.value}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="card-modern-glass h-100">
            <Card.Body className="p-4">
              <SectionHeader
                icon={<Book size={18} />}
                title="Library Statistics"
                size="small"
                className="mb-3"
              />
              <Row className="g-2">
                {libraryStats.map((stat, index) => (
                  <Col xs={4} key={index}>
                    <div className="stat-card-glass text-center">
                      <div className={stat.textColor} style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                        {stat.label}
                      </div>
                      <div className={`fw-bold ${stat.textColor}`} style={{ fontSize: '1.5rem' }}>
                        {stat.value}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Candidate Lists */}
      <Row className="section-spacing">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Card className="card-modern-glass h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <ClockHistory className="me-2" />
                  Upcoming Marriages
                </Card.Title>
                <Button variant="outline-primary" className="btn-modern" onClick={() => navigate('/marriage')}>
                  View All
                </Button>
              </div>
              {upcomingMarriages.length > 0 ? (
                <div>
                  {upcomingMarriages.map(candidate => renderCandidateCard(candidate))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <HeartFill size={48} className="mb-3 opacity-50" />
                  <p>No upcoming marriages</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="card-modern-glass h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <TrophyFill className="me-2" />
                  Top Matches
                </Card.Title>
                <Button variant="outline-primary" className="btn-modern" onClick={() => navigate('/marriage')}>
                  View All
                </Button>
              </div>
              {topMatches.length > 0 ? (
                <div>
                  {topMatches.map((matchPair, index) => renderMatchPair(matchPair, index))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <TrophyFill size={48} className="mb-3 opacity-50" />
                  <p>No matches available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="card-modern-glass">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <CheckCircleFill className="me-2" />
                  Conducted Marriages
                </Card.Title>
                <Button variant="outline-primary" className="btn-modern" onClick={() => navigate('/marriage')}>
                  View All
                </Button>
              </div>
              {conductedMarriages.length > 0 ? (
                <Row>
                  {conductedMarriages.map(candidate => (
                    <Col md={6} lg={4} key={candidate._id}>
                      {renderCandidateCard(candidate)}
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center text-muted py-4">
                  <CheckCircleFill size={48} className="mb-3 opacity-50" />
                  <p>No conducted marriages yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;