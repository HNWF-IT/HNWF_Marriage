import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MyNavbar from "./MyNavbar"; // Import the new component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/css/candidateStyle.css"
import isLoggedIn from "../../utils";
import Login from "../login/Login";
import { useAuth } from "../../context/AuthContext";

const MainContent = () => {
  const [activeMainTabIndex, setActiveMainTabIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { logout } = useAuth();

  const colors = {
    primary: "#4C6C44",
    secondary: "#A49559",
    white: "#FFFFFF",
    text: "#343a40",
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 992;
      setIsMobile(newIsMobile);
      
      // Auto-close sidebar on mobile, auto-open on desktop
      if (newIsMobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    window.location.pathname = "/login";
  }

  const getMainContentMargin = () => {
    if (isMobile) {
      return "0px"; // On mobile, main content takes full width
    }
    return sidebarOpen ? "280px" : "80px";
  };

  const getMainContentWidth = () => {
    if (isMobile) {
      return "100%";
    }
    return sidebarOpen ? "calc(100% - 280px)" : "calc(100% - 80px)";
  };

  return (
    <>
      {!isLoggedIn() ? <Login /> : (
      <>
        <ToastContainer 
          position="top-right" 
          autoClose={5000}
          style={{ zIndex: 9999 }} // Ensure toasts are above everything
        />
        
        {/* Main Layout Container */}
        <div className="position-relative" style={{ minHeight: "100vh" }}>
          {/* Sidebar */}
          <Sidebar
            activeMainTabIndex={activeMainTabIndex}
            setActiveMainTabIndex={setActiveMainTabIndex}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            colors={colors}
            isMobile={isMobile}
          />

          {/* Main Content Area */}
          <div
            className="d-flex flex-column"
            style={{
              marginLeft: getMainContentMargin(),
              width: getMainContentWidth(),
              minHeight: "100vh",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Navbar */}
            <MyNavbar 
              toggleSidebar={toggleSidebar} 
              isMobile={isMobile} 
              colors={colors} 
              onLogout={handleLogout}
              sidebarOpen={sidebarOpen}
            />

            {/* Main Content */}
            <main 
              className="flex-grow-1"
              style={{
                padding: isMobile ? "1rem" : "1.5rem",
                backgroundColor: "#f8f9fa",
                minHeight: "calc(100vh - 70px)", // Subtract navbar height
                overflow: "auto"
              }}
            >
              <Outlet />
            </main>
          </div>
        </div>

        {/* Additional CSS for smooth transitions and mobile handling */}
        <style jsx>{`
          @media (max-width: 991.98px) {
            .main-content {
              margin-left: 0 !important;
              width: 100% !important;
            }
          }
          
          /* Prevent horizontal scroll */
          body {
            overflow-x: hidden;
          }
          
          /* Smooth transitions for all layout changes */
          * {
            box-sizing: border-box;
          }
          
          /* Ensure proper stacking context */
          .toast-container {
            z-index: 9999 !important;
          }
          
          /* Mobile-specific adjustments */
          @media (max-width: 767.98px) {
            .main-content {
              padding: 0.75rem !important;
            }
          }
        `}</style>
      </>
      )}
    </>
  );
};

export default MainContent;