import axiosInstance from "./axiosInstance";

const AuthAPI = {
    login: (data) => axiosInstance.post("/auth/login", data),
    signup: (data) => axiosInstance.post("/auth/signup", data),
};

export default AuthAPI;
