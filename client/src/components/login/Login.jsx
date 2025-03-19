import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthAPI from '../../api/auth';
import { useNavigate } from 'react-router-dom';

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
    console.log('Login reponse:', response);
    
    /*** Saving token in Browser's Cookie */
    document.cookie = response.data.data;

    // TODO: NOT THE BEST APPROACH.. NEED TO IMPROVE!!
    window.location.pathname = '/candidates';
  };

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={6} xl={5}>
            <Card 
              className="shadow-lg border-0 overflow-hidden" 
              style={{
                borderRadius: '20px',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '10px',
                  width: '100%'
                }}
              />
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <h1 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold'
                    }}
                  >
                    Welcome Back
                  </h1>
                  <p className="text-muted">Sign in to continue to your dashboard</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused({...isFocused, email: true})}
                      onBlur={() => setIsFocused({...isFocused, email: false})}
                      style={{
                        borderRadius: '10px',
                        boxShadow: isFocused.email 
                          ? '0 0 0 3px rgba(102, 126, 234, 0.25)' 
                          : 'none'
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setIsFocused({...isFocused, password: true})}
                      onBlur={() => setIsFocused({...isFocused, password: false})}
                      style={{
                        borderRadius: '10px',
                        boxShadow: isFocused.password 
                          ? '0 0 0 3px rgba(102, 126, 234, 0.25)' 
                          : 'none'
                      }}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox" 
                      label="Remember me" 
                      id="rememberCheck"
                    />
                    <a 
                      href="#" 
                      className="text-primary text-decoration-none"
                      style={{
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    Sign In
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Don't have an account? <a href="#" className="text-primary">Sign up</a>
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