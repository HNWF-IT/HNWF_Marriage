import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BookAPI from '../../api/book';
import { BookGenre, BookLanguage, BookStatus } from '../../enums/libraryEnums';
import { PencilSquare, JournalPlus } from 'react-bootstrap-icons';

const BookModal = ({ mode, bookData, show, handleClose, onBookAddOrUpdate }) => {
  const isCreateMode = mode === 'add';

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isDirty, isValid },
    setValue,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publicationYear: '',
      publisher: '',
      genre: '',
      language: '',
      pageCount: '',
      status: '',
      shelfLocation: '',
      description: ''
    }
  });

  // Reset form when bookData changes
  useEffect(() => {
    if (bookData) {
      // Set all values from bookData
      Object.entries(bookData).forEach(([key, value]) => {
        if(key === 'dob') {
          setValue(key, candidateData?.dob.split("T")[0])
        } else setValue(key, value);
      });
    } else {
      reset(); // Reset to default values
    }
  }, [bookData, reset, setValue]);

  const closeModal = () => {
    reset();
    handleClose();
  };

  const onSubmit = (newBook) => {
    if (isCreateMode) {
      BookAPI.addBook(newBook)
        .then((response) => {
          onBookAddOrUpdate(response.data.data, mode);
          console.log("Response", response);
          toast.success("Book added successfully");
          closeModal();
        })
        .catch((error) => {
          const message = error?.message || "Something went wrong";
          toast.error(message);
          closeModal();
        });
    } else {
      BookAPI.updateBook(newBook._id, newBook)
        .then((response) => {
          onBookAddOrUpdate(response.data.data, mode);
          console.log("Update Response: ", response);
          toast.success("Book updated successfully");
          closeModal();
        })
        .catch((error) => {
          const message = error?.message || "Something went wrong";
          toast.error(message);
          closeModal();
        });
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={closeModal}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className={isCreateMode ? 'bg-primary text-white' : 'bg-warning text-white'}
      >
        <Modal.Title>
          {isCreateMode ? <JournalPlus className="me-2" /> : <PencilSquare className="me-2" />}  
          {isCreateMode ? "Add New Book" : "Edit Book"}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body 
            className="bg-light"
            style={{
                maxHeight: "70vh",
                overflowY: "auto",
              }}
        >
          <div className="bg-white p-4 rounded shadow-sm">
            {/* Personal Information Section */}
            <h5 className="mb-4">Basic Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book title"
                    isInvalid={!!errors.title}
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 3, message: "Title must be at least 3 characters" }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    isInvalid={!!errors.author}
                    {...register("author", {
                      required: "Author is required"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.author?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ISBN"
                    isInvalid={!!errors.isbn}
                    {...register("isbn", {
                      validate: (value) =>
                        !value || value.length === 13 || "ISBN must be 13 characters"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.isbn?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication Year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter year"
                    isInvalid={!!errors.publicationYear}
                    {...register("publicationYear", {
                      required: "Publication year is required",
                      validate: (value) =>
                        /^\d{4}$/.test(value) && value >= 1000 && value <= new Date().getFullYear()
                          ? true
                          : "Enter a valid 4-digit year"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.publicationYear?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter publisher"
                    {...register("publisher")}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.genre}
                    {...register("genre", {
                      required: "Genre is required"
                    })}
                  >
                    <option value="">Select genre</option>
                    {Object.values(BookGenre).map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.genre?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.language}
                    {...register("language", {
                      required: "Language is required"
                    })}
                  >
                    <option value="">Select Language</option>
                    {Object.values(BookLanguage).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.language?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Page Count</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter number of pages"
                    isInvalid={!!errors.pageCount}
                    {...register("pageCount", {
                      required: "Page count is required",
                      min: { value: 1, message: "Page count must be at least 1" }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pageCount?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.status}
                    {...register("status", {
                      required: "Status is required"
                    })}
                  >
                    <option value="">Select status</option>
                    {Object.values(BookStatus).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Shelf Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter shelf location"
                    isInvalid={!!errors.shelfLocation}
                    {...register("shelfLocation", {
                      required: "Shelf location is required"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shelfLocation?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter a brief description"
                    {...register("description")}
                  />
                </Form.Group>
              </Col>
            </Row>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={closeModal} variant="secondary">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant={isCreateMode ? 'primary' : 'warning'}
            // disabled={!isDirty || !isValid}
          >
            {isCreateMode ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookModal;