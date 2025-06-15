import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BookAPI from '../../api/book';
import { BookGenre, BookLanguage, BookStatus } from '../../enums/libraryEnums';
import { PencilSquare, PersonPlus } from 'react-bootstrap-icons';

const UserModal = ({ mode, userData, show, handleClose, onExited, onUserAddOrUpdate }) => {
  console.log("User Data: ", userData);
  const isCreateMode = React.useMemo(() => mode === 'add', [mode]);

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
      fullname: '',
      email: '',
      role: '',
      phoneNumber: '',
      status: '',
    }
  });

  // Reset form when userData changes
  useEffect(() => {
    if (userData) {
      // Set all values from userData
      Object.entries(userData).forEach(([key, value]) => {
        if(key === 'dob') {
          setValue(key, userData?.dob.split("T")[0])
        } else setValue(key, value);
      });
    } else {
      reset(); // Reset to default values
    }
  }, [userData, reset, setValue]);

  const closeModal = () => {
    reset();
    handleClose();
  };

  const onSubmit = (newUser) => {
    /*
    if (mode === 'add') {
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
    */
  };

  return (
    <Modal show={show} onHide={closeModal} size="lg" centered backdrop="static" onExited={onExited} >
      <Modal.Header
        closeButton
        className={isCreateMode ? 'bg-primary text-white' : 'bg-warning text-white'}
        closeVariant="white"
      >
        <Modal.Title>
          {isCreateMode ? <PersonPlus className="me-2" /> : <PencilSquare className="me-2" />}
          {isCreateMode ? 'Create New User' : 'Edit User'}
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
            <h5 className="mb-4" style={{color: "grey"}}>Basic Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    isInvalid={!!errors.fullname}
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Full name must be at least 2 characters"
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullname?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    isInvalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                  <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                          isInvalid={!!errors.role}
                          {...register("role", { required: "Role is required" })}
                      >
                          <option value="">Select Role</option>
                          <option value="Employee">Employee</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          {errors.role?.message}
                      </Form.Control.Feedback>
                  </Form.Group>
              </Col>

              <Col md={6}>
                  <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                      type="tel"
                      placeholder="Enter phone number"
                      isInvalid={!!errors.phone}
                      {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Phone number must be 10-15 digits"
                      }
                      })}
                  />
                  <Form.Control.Feedback type="invalid">
                      {errors.phone?.message}
                  </Form.Control.Feedback>
                  </Form.Group>
              </Col>

              <Col md={6}>
                  <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                          isInvalid={!!errors.status}
                          {...register("status", { required: "Status is required" })}
                      >
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          {errors.status?.message}
                      </Form.Control.Feedback>
                  </Form.Group>
              </Col>
            </Row>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={closeModal} 
            // style={{backgroundColor: "#A49559"}}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant={isCreateMode ? 'primary' : 'warning'}
            // style={{backgroundColor: "#4C6C44"}}
            // disabled={!isDirty || !isValid}
          >
            {mode === 'add' ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;