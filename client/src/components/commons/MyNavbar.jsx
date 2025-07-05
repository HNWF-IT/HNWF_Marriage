import React, { useState } from "react";
import { Navbar, Container, Button, Dropdown } from "react-bootstrap";
import { 
  Person, 
  GearFill, 
  List,
  BoxArrowRight,
  ThreeDotsVertical
} from "react-bootstrap-icons";

const MyNavbar = ({ toggleSidebar, isMobile, colors, onLogout }) => {
  // Mock user data - replace with actual user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "John Doe";
  const userRole = user.role || "user";
  const userAvatar = user.avatar || null;

  const navbarStyles = {
    navbar: {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(20px) saturate(180%)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      padding: "12px 0",
      position: "sticky",
      top: 0,
      zIndex: 1030,
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: isMobile ? "space-between" : "flex-end",
      width: "100%",
    },
    toggleButton: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: `1px solid ${colors.primary}30`,
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      color: colors.primary,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      position: "relative",
      overflow: "hidden",
    },
    userCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "20px",
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      backdropFilter: "blur(15px)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: colors.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "600",
      fontSize: "0.8rem",
      position: "relative",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1px",
    },
    userName: {
      fontSize: "0.85rem",
      fontWeight: "600",
      color: colors.text,
      lineHeight: "1.2",
    },
    userStatus: {
      fontSize: "0.7rem",
      color: `${colors.text}66`,
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    statusDot: {
      width: "6px",
      height: "6px",
      backgroundColor: "#00d4aa",
      borderRadius: "50%",
      display: "inline-block",
    },
    dropdownMenu: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
      padding: "16px 0",
      minWidth: "220px",
      marginTop: "8px",
    },
    dropdownItem: {
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "all 0.2s ease",
      border: "none",
      backgroundColor: "transparent",
      width: "100%",
      textAlign: "left",
      fontSize: "0.9rem",
      fontWeight: "500",
      color: colors.text,
    },
    dropdownHeader: {
      padding: "16px 24px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      marginBottom: "12px",
    },
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Navbar expand="lg" style={navbarStyles.navbar} className="px-0">
      <Container fluid className="px-4">
        <div style={navbarStyles.container}>
          {/* Left Side - Sidebar Toggle Button (Mobile Only) */}
          {isMobile && (
            <Button 
              style={navbarStyles.toggleButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${colors.primary}15`;
                e.target.style.transform = "scale(1.1)";
                e.target.style.boxShadow = `0 8px 24px ${colors.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
              }}
              onClick={toggleSidebar}
            >
              <List size={18} />
            </Button>
          )}

          {/* Right Side - User Card */}
          <Dropdown align="end">
            <Dropdown.Toggle as="div" style={navbarStyles.userCard}>
              <div style={navbarStyles.userAvatar}>
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar" 
                    style={{width: "100%", height: "100%", borderRadius: "50%"}} 
                  />
                ) : (
                  getUserInitials(userName)
                )}
              </div>
              {!isMobile && (
                <div style={navbarStyles.userInfo}>
                  <div style={navbarStyles.userName}>{userName}</div>
                  <div style={navbarStyles.userStatus}>
                    <span style={navbarStyles.statusDot}></span>
                    Online
                  </div>
                </div>
              )}
              <ThreeDotsVertical size={12} color={`${colors.text}77`} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={navbarStyles.dropdownMenu}>
              <div style={navbarStyles.dropdownHeader}>
                <div style={navbarStyles.userName}>{userName}</div>
                <div style={navbarStyles.userStatus}>
                  <span style={navbarStyles.statusDot}></span>
                  Online - {userRole}
                </div>
              </div>
              <Dropdown.Item 
                style={navbarStyles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = `${colors.primary}08`}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <Person size={16} />
                View Profile
              </Dropdown.Item>
              <Dropdown.Item 
                style={navbarStyles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = `${colors.primary}08`}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <GearFill size={16} />
                Account Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                style={{...navbarStyles.dropdownItem, color: "#ff4757"}}
                onClick={onLogout}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#ff475708"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <BoxArrowRight size={16} />
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;