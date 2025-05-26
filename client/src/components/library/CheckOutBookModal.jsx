import React from 'react';
import { useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import { 
  BookFill, 
  PersonFill, 
  CalendarEvent, 
  TelephoneFill, 
  EnvelopeFill,
  CheckCircleFill,
  XCircleFill 
} from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';

const CheckOutBookModal = ({ show, onHide, onSubmit, book, mode }) => {
  const isReturnMode = mode === 'return';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isReturnMode && book?.borrowerInfo) {
      const borrowerInfo = JSON.parse(book.borrowerInfo); // parse the stored string
      reset({
        fullName: borrowerInfo.fullName || '',
        contactNumber: borrowerInfo.contactNumber || '',
        email: borrowerInfo.email || '',
        issueDate: borrowerInfo.issueDate || new Date().toISOString().split('T')[0],
        dueDate: borrowerInfo.dueDate || '',
      });
    } else {
      reset({
        fullName: '',
        contactNumber: '',
        email: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
      });
    }
  }, [book, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({ bookId: book?._id, borrowerInfo: data, mode });
    reset();
    onHide();
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      backdrop="static" 
      centered 
      size="md"
    >
      <Modal.Header 
        closeButton 
        closeVariant="white"
        className="bg-primary text-white border-0 py-2"
      >
        <Modal.Title className="d-flex align-items-center fs-6">
          <BookFill className="me-2" size={20} />
          {isReturnMode ? 'Return Book from Borrower' : 'Assign Book to Borrower'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body className="p-3">
          {/* Book Information Card */}
          <Card className="mb-3 border-0 bg-light">
            <Card.Body className="p-2">
              <h6 className="mb-2 text-primary d-flex align-items-center">
                <BookFill className="me-1" size={16} />
                Book Details
              </h6>
              <Row className="g-2">
                <Col sm={6}>
                  <div className="small">
                    <Badge bg="secondary" className="me-1 small">Title</Badge>
                    <span className="fw-semibold">{book?.title}</span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="small">
                    <Badge bg="secondary" className="me-1 small">Author</Badge>
                    <span className="fw-semibold">{book?.author}</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Date Information */}
          <Row className="mb-3 g-2">
            <Col sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center fw-semibold text-dark small">
                  <CalendarEvent className="me-1 text-primary" size={14} />
                  Issue Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  {...register('issueDate', { required: 'Issue date is required' })}
                  isInvalid={!!errors.issueDate}
                  defaultValue={new Date().toISOString().split('T')[0]} // ← today's date in YYYY-MM-DD
                  disabled={isReturnMode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.issueDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center fw-semibold text-dark small">
                  <CalendarEvent className="me-1 text-warning" size={14} />
                  Due Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  {...register('dueDate', { required: 'Due date is required' })}
                  isInvalid={!!errors.dueDate}
                  disabled={isReturnMode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dueDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Divider */}
          <div className="d-flex align-items-center mb-3">
            <hr className="flex-grow-1" />
            <span className="px-2 text-muted fw-semibold small">
              <PersonFill className="me-1" size={14} />
              Borrower Info
            </span>
            <hr className="flex-grow-1" />
          </div>

          {/* Borrower Information */}
          <Row className="g-2">
            <Col sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center fw-semibold text-dark small">
                  <PersonFill className="me-1 text-success" size={14} />
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  size="sm"
                  placeholder="Enter full name"
                  {...register('fullName', { required: 'Full name is required' })}
                  isInvalid={!!errors.fullName}
                  disabled={isReturnMode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center fw-semibold text-dark small">
                  <TelephoneFill className="me-1 text-info" size={14} />
                  Contact Number <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  size="sm"
                  placeholder="Enter contact number"
                  {...register('contactNumber', { required: 'Contact number is required' })}
                  isInvalid={!!errors.contactNumber}
                  disabled={isReturnMode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contactNumber?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-2">
            <Col sm={12}>
              <Form.Group className="mb-2">
                <Form.Label className="d-flex align-items-center fw-semibold text-dark small">
                  <EnvelopeFill className="me-1 text-secondary" size={14} />
                  Email Address
                  <Badge bg="light" text="dark" className="ms-2 small">Optional</Badge>
                </Form.Label>
                <Form.Control 
                  type="email" 
                  size="sm"
                  placeholder="Enter email address"
                  {...register('email')} 
                  disabled={isReturnMode}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="bg-light border-0 p-3">
          <div className="d-flex gap-2 w-100 justify-content-end">
            <Button 
              variant="outline-secondary" 
              onClick={handleClose}
              size="sm"
              className="d-flex align-items-center px-3"
            >
              <XCircleFill className="me-1" size={14} />
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              size="sm"
              className="d-flex align-items-center px-3"
            >
              <CheckCircleFill className="me-1" size={14} />
              {isReturnMode ? 'Return Book' : 'Assign Book'}
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckOutBookModal;