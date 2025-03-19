import React from "react";
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";

const MyNavbar = ({ toggleSidebar, isMobile, colors }) => {
  return (
    <Navbar expand="lg" style={{ backgroundColor: colors.white }} className="border-bottom shadow-sm">
      <Container fluid>
        {/* Mobile: Sidebar Toggle Button & Brand Name */}
        {isMobile ? (
          <>
            <Button variant="light" onClick={toggleSidebar} className="me-2">
              ☰
            </Button>
            <Navbar.Brand href="#" style={{ color: colors.primary }}>
              <strong>HuqooqUnNaas</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link style={{ color: colors.text }}>Profile</Nav.Link>
                <Nav.Link style={{ color: colors.text }}>Settings</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <>
            {/* Desktop: Sidebar Toggle Button */}
            <Button variant="light" className="d-lg-none" onClick={toggleSidebar}>
              ☰
            </Button>
            {/* Search Bar */}
            <Form className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
              <Form.Control type="search" placeholder="Search..." className="bg-light" />
            </Form>
            {/* Profile Links */}
            <Nav className="ms-auto">
              <Nav.Link style={{ color: colors.text }}>Profile</Nav.Link>
              <Nav.Link style={{ color: colors.text }}>Settings</Nav.Link>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
