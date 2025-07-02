import React, { useMemo } from "react";
import { Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  HouseDoor,
  People,
  Heart,
  Book,
  List,
  X
} from "react-bootstrap-icons";
import "../../assets/css/sidebarStyle.css";

const Sidebar = ({
  activeMainTabIndex,
  setActiveMainTabIndex,
  sidebarOpen,
  toggleSidebar,
  colors,
  isMobile,
}) => {
  const navigate = useNavigate();

  // Example navLinks with icon & permission
  const rawNavLinks = [
    {
      name: "Dashboard",
      short: "D",
      path: "/dashboard",
      icon: <HouseDoor size={18} />,
      permission: null,
    },
    {
      name: "Users",
      short: "U",
      path: "/users",
      icon: <People size={18} />,
      permission: null,
    },
    {
      name: "Marriage",
      short: "M",
      path: "/marriage",
      icon: <Heart size={18} />,
      permission: "marriage",
    },
    {
      name: "Library",
      short: "L",
      path: "/library",
      icon: <Book size={18} />,
      permission: "library",
    },
  ];

  // Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = user.appPermissions || [];

  // Memoized navLinks based on permissions
  const navLinks = useMemo(() => {
    return rawNavLinks.filter(
      (link) => !link.permission || userPermissions.includes(link.permission)
    );
  }, [userPermissions]);

  const sidebarStyles = {
    sidebar: {
      width: sidebarOpen ? "280px" : isMobile ? "0px" : "80px",
      minHeight: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1050,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary}dd 100%)`,
      backdropFilter: "blur(10px)",
      borderRight: `1px solid ${colors.primary}33`,
      boxShadow: sidebarOpen 
        ? "0 10px 40px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.1)" 
        : "0 4px 20px rgba(0,0,0,0.08)",
      // Hide content when collapsed on mobile
      overflow: isMobile && !sidebarOpen ? "hidden" : "visible",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1040,
      opacity: isMobile && sidebarOpen ? 1 : 0,
      visibility: isMobile && sidebarOpen ? "visible" : "hidden",
      transition: "all 0.3s ease",
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        style={sidebarStyles.overlay}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        style={sidebarStyles.sidebar}
        className="text-white sidebar-container"
      >
        {/* Sidebar Header - Only show if not mobile or if mobile and open */}
        {(!isMobile || sidebarOpen) && (
          <div
            className="d-flex justify-content-between align-items-center p-4"
            style={{ 
              borderBottom: `1px solid ${colors.secondary}44`,
              minHeight: "70px"
            }}
          >
            {sidebarOpen && (
              <div className="d-flex flex-column">
                <h4 className="m-0 fw-bold" style={{ 
                  fontSize: "1.4rem",
                  letterSpacing: "-0.5px",
                  background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.white}cc 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  HuqooqUnNaas
                </h4>
                <small style={{ 
                  color: `${colors.white}88`,
                  fontSize: "0.75rem",
                  fontWeight: "500"
                }}>
                  Management Portal
                </small>
              </div>
            )}
            
            <Button
              variant="link"
              className="p-2 border-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                backgroundColor: `${colors.white}15`,
                color: colors.white,
                width: "40px",
                height: "40px",
                transition: "all 0.2s ease",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${colors.white}25`;
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = `${colors.white}15`;
                e.target.style.transform = "scale(1)";
              }}
              onClick={toggleSidebar}
            >
              {isMobile ? (
                sidebarOpen ? <X size={18} /> : <List size={18} />
              ) : (
                sidebarOpen ? <X size={16} /> : <List size={16} />
              )}
            </Button>
          </div>
        )}

        {/* Navigation Links - Only render if not mobile or if mobile and open */}
        {(!isMobile || sidebarOpen) && (
          <Nav className="flex-column pt-3 px-2">
            {navLinks.map((link, index) => {
              const isActive = activeMainTabIndex === index;
              return (
                <Nav.Link
                  key={index}
                  className="position-relative mb-2 rounded-3 d-flex align-items-center sidebar-nav-link"
                  style={{
                    color: isActive ? colors.primary : colors.white,
                    backgroundColor: isActive ? colors.white : "transparent",
                    padding: sidebarOpen ? "12px 16px" : "12px 8px",
                    margin: "0 8px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    border: "none",
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    boxShadow: isActive 
                      ? "0 4px 12px rgba(255,255,255,0.2)" 
                      : "none",
                    transform: isActive ? "translateX(2px)" : "translateX(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = `${colors.white}15`;
                      e.target.style.transform = "translateX(4px)";
                      e.target.style.color = colors.white;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.transform = "translateX(0)";
                      e.target.style.color = colors.white;
                    }
                  }}
                  onClick={() => {
                    setActiveMainTabIndex(index);
                    navigate(link.path);
                    if (isMobile) toggleSidebar();
                  }}
                >
                  {/* Icon Container */}
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      minWidth: sidebarOpen ? "24px" : "32px",
                      height: "24px",
                      marginRight: sidebarOpen ? "12px" : "0"
                    }}
                  >
                    {React.cloneElement(link.icon, {
                      size: sidebarOpen ? 18 : 20,
                      style: { 
                        transition: "all 0.2s ease",
                      }
                    })}
                  </div>
                  
                  {/* Text */}
                  {sidebarOpen && (
                    <span 
                      style={{ 
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        opacity: sidebarOpen ? 1 : 0,
                        transition: "opacity 0.2s ease 0.1s"
                      }}
                    >
                      {link.name}
                    </span>
                  )}
                  
                  {/* Collapsed state indicator - Only show on desktop when collapsed */}
                  {!sidebarOpen && !isMobile && (
                    <div
                      className="position-fixed tooltip-text"
                      style={{
                        left: "90px", // Fixed position from left edge
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: colors.primary,
                        color: colors.white,
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.2s ease",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                        zIndex: 1060, // Higher than sidebar
                        whiteSpace: "nowrap",
                        pointerEvents: "none"
                      }}
                    >
                      {link.name}
                      <div
                        style={{
                          position: "absolute",
                          left: "-6px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "6px solid transparent",
                          borderBottom: "6px solid transparent",
                          borderRight: `6px solid ${colors.primary}`
                        }}
                      />
                    </div>
                  )}
                </Nav.Link>
              );
            })}
          </Nav>
        )}

        {/* Bottom Section - Only show if sidebar is open */}
        {sidebarOpen && (
          <div 
            className="mt-auto p-4"
            style={{
              borderTop: `1px solid ${colors.secondary}44`,
              background: `linear-gradient(180deg, transparent 0%, ${colors.primary}22 100%)`
            }}
          >
            <div className="text-center">
              <small style={{ 
                color: `${colors.white}77`,
                fontSize: "0.7rem"
              }}>
                © 2025 HuqooqUnNaas
              </small>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;