import axiosInstance from "./axiosInstance";

const BookAPI = {
  getAllBooks: () => axiosInstance.post("/book/list"),
  getBookById: (id) => axiosInstance.get(`/book/get/${id}`),
  addBook: (data) => axiosInstance.post("/book/create", data),
  updateBook: (id, data) => axiosInstance.put(`/book/update/${id}`, data),
  deleteBook: (id) => axiosInstance.delete(`/book/${id}`),
  checkoutBook: (payload) => axiosInstance.put("/book/checkout", payload),
  
  // Book Genres
  getAllGenres: () => axiosInstance.get('/bookGenre/list'),
  addBookGenre: (data) => axiosInstance.post("/bookGenre/create", data),
};

export default BookAPI;
