import axiosInstance from "./axiosInstance";

const BookAPI = {
  getAllBooks: () => axiosInstance.post("/book/list"),
  getBookById: (id) => axiosInstance.get(`/book/get/${id}`),
  addBook: (data) => axiosInstance.post("/book/create", data),
  updateBook: (id, data) => axiosInstance.put(`/book/update/${id}`, data),
  deleteBook: (id) => axiosInstance.delete(`/book/${id}`),
};

export default BookAPI;
