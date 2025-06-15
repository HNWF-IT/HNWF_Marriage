import React from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMainTabIndex, setActiveMainTabIndex, sidebarOpen, toggleSidebar, colors, isMobile }) => {
  const navigate = useNavigate();

  const navLinks = [
    { name: "Dashboard", short: "D", path: "/dashboard" },
    { name: "Users", short: "A", path: "/users" },
    { name: "Marriage", short: "M", path: "/marriage" },
    { name: "Library", short: "L", path: "/library" },
  ];

  return (
    <div
      style={{
        width: sidebarOpen ? "250px" : isMobile ? "0px" : "70px", // Fully hide sidebar on small screens
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000, // Ensure sidebar appears above other content
        transition: "width 0.3s",
        backgroundColor: colors.primary,
        overflow: "hidden", // Hide content when collapsed
        boxShadow: sidebarOpen ? "2px 0 5px rgba(0,0,0,0.1)" : "none",
      }}
      className="text-white"
    >
      {/* Sidebar Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: colors.secondary }}>
        {sidebarOpen && <h5 className="m-0">HuqooqUnNaas</h5>}
        <Button
          style={{ backgroundColor: "transparent", color: colors.white }}
          className="border-0"
          size="sm"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? "←" : "→"}
        </Button>
      </div>

      {/* Navigation Links */}
      <Nav className="flex-column mt-3">
        {navLinks.map((link, index) => (
          <Nav.Link
            key={index}
            className="py-3 px-3"
            style={{
              color: colors.white,
              backgroundColor: activeMainTabIndex === index ? colors.secondary : "transparent",
              opacity: activeMainTabIndex === index ? 1 : 0.8,
            }}
            onClick={() => {
              setActiveMainTabIndex(index);
              navigate(link.path);
              if (isMobile) toggleSidebar(); // Close sidebar on mobile after navigation
            }}
          >
            {sidebarOpen ? link.name : link.short}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
