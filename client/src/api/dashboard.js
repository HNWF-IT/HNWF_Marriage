import axiosInstance from "./axiosInstance";

const DashboardAPI = {
  getStats: () => axiosInstance.get("/dashboard/stats"),
  getRecentActivity: (limit = 5) => axiosInstance.get(`/dashboard/recent-activity?limit=${limit}`),
  getTopMatches: (limit = 5) => axiosInstance.get(`/dashboard/top-matches?limit=${limit}`),
};

export default DashboardAPI;
