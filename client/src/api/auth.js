import axiosInstance from "./axiosInstance";

const AuthAPI = {
    login: (data) => axiosInstance.post("/auth/login", data),
};

export default AuthAPI;
