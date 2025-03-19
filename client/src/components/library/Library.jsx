import React, { useState } from "react";
import { Container, ListGroup, Form, Button } from "react-bootstrap";

const Library = () => {
  const [books, setBooks] = useState([
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "1984", author: "George Orwell" },
  ]);
  
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  const addBook = () => {
    if (newBook.title && newBook.author) {
      setBooks([...books, newBook]);
      setNewBook({ title: "", author: "" });
    }
  };

  return (
    <>It is Library</>
  );
};

export default Library;
