import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, CloseButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthAPI from '../../api/auth';
import { useNavigate } from 'react-router-dom';
// Import the background image
import backgroundImage from '../../assets/images/LoginBG.png';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setIsLoading(true);

    try {
      // Authentication logic
      const response = await AuthAPI.login({ email, password, rememberMe });
      
      /*** 
       * Saving token in Browser's Cookie
       * path=/ => This ensures that the cookie is available on all routes
       * max-age=3600 =>	This ensures that the cookie will expire in 1 hour
       *  3600 = 1 hour
       *  86400 = 1 day
      */

      const { token, user } = response.data.data;
      login(user, token);
      resetFields();
      
      // Add a small delay to show success message before redirect
      setTimeout(() => {
        // TODO: NOT THE BEST APPROACH.. NEED TO IMPROVE!!
        window.location.pathname = '/dashboard';
        // navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      // Handle login errors
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      resetFields();
    }
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
  }

  return (
    <div 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >


      {/* Overlay to darken the background slightly */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={4}>
            <Card
              className="glass-card overflow-hidden"
              style={{
                transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0 10px 30px rgba(0, 0, 0, 0.15)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Primary color accent line at top of card */}
              <div
                className="bg-gradient-primary"
                style={{
                  height: '4px',
                  width: '100%'
                }}
              />
              
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h5 
                    style={{
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      color: '#4C6C44',
                      fontSize: '2rem',
                      fontFamily: 'cursive',
                      textDecoration: 'underline',
                    }}
                  >
                    Huqooq-un-Naas
                  </h5>
                </div>
                
                <h4 className="mb-1 fw-bold">Login</h4>
                <p className="text-muted small mb-4">Sign in to your account to continue</p>

                {/* Error Alert */}
                {error && (
                  <Alert
                    variant="danger"
                    style={{
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center', // align text and close button vertically
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>{error}</div>
                    <CloseButton
                      onClick={() => setError('')}
                      style={{ marginLeft: '0.75rem', marginTop: '0.1rem' }}
                    />
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="form-glass">
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-medium">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      style={{
                        opacity: isLoading ? 0.7 : 1
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-medium">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      style={{
                        opacity: isLoading ? 0.7 : 1
                      }}
                      required
                    />
                  </Form.Group>

                  <div className="text-end mb-4">
                    <a 
                      href="#" 
                      className="text-decoration-none small"
                      style={{
                        color: isLoading ? '#999' : '#3c6e30',
                        fontWeight: '500',
                        transition: 'color 0.3s ease, transform 0.2s ease',
                        display: 'inline-block',
                        pointerEvents: isLoading ? 'none' : 'auto'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.color = '#2b5022';
                          e.target.style.transform = 'translateX(2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.color = '#3c6e30';
                          e.target.style.transform = 'translateX(0)';
                        }
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>

                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 py-2 fw-medium d-flex align-items-center justify-content-center btn-modern bg-gradient-primary"
                    disabled={isLoading}
                    style={{
                      border: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '42px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) e.target.style.transform = 'translateY(0)'
                    }}
                    onMouseDown={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'scale(0.98)';
                        e.target.style.boxShadow = '0 1px 5px rgba(60, 110, 48, 0.3)';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 10px rgba(60, 110, 48, 0.3)';
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                          style={{ width: '16px', height: '16px' }}
                        />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="small text-muted mb-0">
                      Don't have an account? <a 
                        href="#" 
                        style={{ 
                          color: isLoading ? '#999' : '#3c6e30', 
                          textDecoration: 'none',
                          fontWeight: '500',
                          transition: 'color 0.3s ease',
                          pointerEvents: isLoading ? 'none' : 'auto'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoading) e.target.style.color = '#2b5022'
                        }}
                        onMouseLeave={(e) => {
                          if (!isLoading) e.target.style.color = '#3c6e30'
                        }}
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;