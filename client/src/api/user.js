import axiosInstance from "./axiosInstance";

const UserAPI = {
  getAllUsers: () => axiosInstance.post("/user/list"),
  getUserById: (id) => axiosInstance.get(`/user/get/${id}`),
  addUser: (data) => axiosInstance.post("/user/create", data),
  updateUser: (id, data) => axiosInstance.put(`/user/update/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/user/${id}`),
  updateUserStatus: (userId, status) => axiosInstance.patch(`/user/status/${userId}`, { status }),
  resetPassword: (userId, newPassword) => axiosInstance.patch(`/user/reset-password/${userId}`, { newPassword }),
};

export default UserAPI;
