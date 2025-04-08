import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthAPI from '../../api/auth';
import { useNavigate } from 'react-router-dom';
// Import the background image
import backgroundImage from '../../assets/images/LoginBG.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication logic would go here
    const response = await AuthAPI.login({ email, password, rememberMe });
    console.log('Login response:', response);
    
    /*** 
     * Saving token in Browser's Cookie
     * path=/ => This ensures that the cookie is available on all routes
     * max-age=3600 =>	This ensures that the cookie will expire in 1 hour
     *  3600 = 1 hour
     *  86400 = 1 day
    */
    document.cookie = `token=${response.data.data}; path=/; max-age=3600`;

    resetFields();
    // TODO: NOT THE BEST APPROACH.. NEED TO IMPROVE!!
    window.location.pathname = '/dashboard';
    // navigate('/dashboard');
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
              className="shadow-lg border-0 overflow-hidden" 
              style={{
                borderRadius: '12px',
                transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0 10px 30px rgba(0, 0, 0, 0.15)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Green accent line at top of card */}
              <div 
                style={{
                  backgroundColor: '#3c6e30',
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

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-medium">Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused({...isFocused, email: true})}
                      onBlur={() => setIsFocused({...isFocused, email: false})}
                      style={{
                        borderRadius: '6px',
                        padding: '10px 12px',
                        boxShadow: isFocused.email 
                          ? '0 0 0 3px rgba(60, 110, 48, 0.25)' 
                          : 'none',
                        border: isFocused.email ? '1px solid #3c6e30' : '1px solid #ced4da',
                        transition: 'all 0.2s ease-in-out'
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
                      onFocus={() => setIsFocused({...isFocused, password: true})}
                      onBlur={() => setIsFocused({...isFocused, password: false})}
                      style={{
                        borderRadius: '6px',
                        padding: '10px 12px',
                        boxShadow: isFocused.password 
                          ? '0 0 0 3px rgba(60, 110, 48, 0.25)' 
                          : 'none',
                        border: isFocused.password ? '1px solid #3c6e30' : '1px solid #ced4da',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      required
                    />
                  </Form.Group>

                  <div className="text-end mb-4">
                    <a 
                      href="#" 
                      className="text-decoration-none small"
                      style={{
                        color: '#3c6e30',
                        fontWeight: '500',
                        transition: 'color 0.3s ease, transform 0.2s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#2b5022';
                        e.target.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#3c6e30';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>

                  <Button 
                    variant="success" 
                    type="submit" 
                    className="w-100 py-2 fw-medium"
                    style={{
                      backgroundColor: '#3c6e30',
                      border: 'none',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 2px 10px rgba(60, 110, 48, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2b5022'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3c6e30'}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'scale(0.98)';
                      e.target.style.boxShadow = '0 1px 5px rgba(60, 110, 48, 0.3)';
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 2px 10px rgba(60, 110, 48, 0.3)';
                    }}
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>

                  <div className="text-center mt-4">
                    <p className="small text-muted mb-0">
                      Don't have an account? <a 
                        href="#" 
                        style={{ 
                          color: '#3c6e30', 
                          textDecoration: 'none',
                          fontWeight: '500',
                          transition: 'color 0.3s ease' 
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#2b5022'}
                        onMouseLeave={(e) => e.target.style.color = '#3c6e30'}
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