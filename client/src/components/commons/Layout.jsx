import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MyNavbar from "./MyNavbar"; // Import the new component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainContent = () => {
  const [activeMainTabIndex, setActiveMainTabIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const colors = {
    primary: "#4C6C44",
    secondary: "#A49559",
    white: "#FFFFFF",
    text: "#343a40",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="d-flex">
        <Sidebar
          activeMainTabIndex={activeMainTabIndex}
          setActiveMainTabIndex={setActiveMainTabIndex}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          colors={colors}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <div
          style={{
            marginLeft: isMobile ? "0px" : sidebarOpen ? "250px" : "70px",
            transition: "all 0.3s",
            width: isMobile ? "100%" : sidebarOpen ? "calc(100% - 250px)" : "calc(100% - 70px)",
          }}
        >
          {/* ✅ Using Navbar Here */}
          <MyNavbar toggleSidebar={toggleSidebar} isMobile={isMobile} colors={colors} />

          {/* Main Content */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainContent;
