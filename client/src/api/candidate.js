import axiosInstance from "./axiosInstance";

const CandidateAPI = {
  getAllCandidates: () => axiosInstance.post("/candidate/list"),
  getCandidatesBatch: (batch = 2, filters = {}) =>
    axiosInstance.post(`/candidate/batch?batch=${batch}`, {filters}),
  getCandidateById: (id) => axiosInstance.get(`/candidate/get/${id}`),
  addCandidate: (data) => axiosInstance.post("/candidate/create", data),
  updateCandidate: (id, data) => axiosInstance.put(`/candidate/update/${id}`, data),
  deleteCandidate: (id) => axiosInstance.delete(`/candidates/${id}`),
};

export default CandidateAPI;
