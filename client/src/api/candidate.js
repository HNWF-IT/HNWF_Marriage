import axiosInstance from "./axiosInstance";

const CandidateAPI = {
  getAllCandidates: () => axiosInstance.post("/candidate/list"),
  getCandidateById: (id) => axiosInstance.get(`/candidate/${id}`),
  addCandidate: (data) => axiosInstance.post("/candidate/create", data),
  updateCandidate: (id, data) => axiosInstance.put(`/candidate/update/${id}`, data),
  deleteCandidate: (id) => axiosInstance.delete(`/candidate/${id}`),
};

export default CandidateAPI;
