import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import CandidateAPI from '../../api/candidate';
import { toast } from 'react-toastify';
import { Education, Gender, HouseOwnership, MaritalStatus, MuslimStatus, Nationality, SectType } from '../../enums/candidateFormEnums';

const CandidateModal = ({ mode, candidateData, show, handleClose, onCandidateAddOrUpdate }) => {
  console.log("Candidate Data: ", candidateData);

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
      /*** Personal Info */
      name: '',
      gender: '',
      dob: '',

      /*** Contact Info */
      contact: '',

      /*** Family Info */
      fatherName: '',
      caste: '',
      fatherOccupation: '',
      mother: '',
      siblingsCount: 0,
      careOfContact: '',
      
      /*** Residential Info */
      houseSize: '',
      city: '',
      areaOfResidence: '',
      address: '',
      houseOwnership: '',

      /*** Professional Info */
      incomeAmount: '',
      sourceOfIncome: '',
      qualification: '',

      /*** Additional Info */
      height: '',
      maritalStatus: '',
      muslimStatus: '',
      maslak: '',
      healthCondition: '',
      nationality: '',
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      // Ensure age is not less than 12
      const age = Math.max(12, Math.abs(parseInt(value) || 12));
      setFormData(prev => ({ ...prev, [name]: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const closeModal = () => {
    setFormData({
        name: '',
        age: '',
        gender: '',
        marriageStatus: '',
        education: '',
        profession: '',
        muslimStatus: '',
        location: '',
        email: '',
        phone: '',
        description: ''
      });
      setValidated(false);
      handleClose();
  }

  const onSubmit = (cand) => {
    if (mode === 'add') {
      CandidateAPI.addCandidate(cand)
        .then((response) => {
          onCandidateAddOrUpdate(response.data.candidate, mode);
          console.log("Response", response);
          toast.success("Candidate added successfully");
          closeModal();
        })
        .catch((error) => {
          const message = error?.message || "Something went wrong";
          toast.error(message);
        });
    } else if(mode === 'edit') {
      CandidateAPI.updateCandidate(cand._id, cand)
        .then((response) => {
          console.log("Update Response: ", response);
          if(response?.data?.data) {
            onCandidateAddOrUpdate(response.data.data, mode);
            toast.success("Candidate updated successfully");
          } 
          // else if(!response?.data?.success && response?.data?.status === 404) {
          //   toast.error(response.data.err);
          // }
          closeModal();
        })
        .catch((error) => {
          let msg = "";
          if(error.status === 404) {
            msg = error?.response?.data?.err;
          } else {
            msg = error?.message || "Something went wrong";
          }
          toast.error(msg);
        });
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    const age = Math.max(12, Math.abs(parseInt(value) || 12));
    setValue('age', age.toString(), { shouldValidate: true });
  };

  return (
    <Modal 
      show={show} 
      onHide={closeModal}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton closeVariant="white" className="text-white" style={{backgroundColor: "#4C6C44"}}>
        <Modal.Title>{mode === "edit" ? "Edit Candidate" : "Add New Candidate"}</Modal.Title>
      </Modal.Header>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body 
            className="bg-light"
            style={{
                maxHeight: "70vh", // Limit the height of the modal body
                overflowY: "auto", // Enable vertical scrolling
              }}
        >
          <div className="bg-white p-4 rounded shadow-sm">
            {/* Personal Information Section */}
            <h5 className="mb-4" style={{color: "#A49559"}}>Personal Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="age"
                    min="12"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                  />
                  <Form.Control.Feedback type="invalid">
                    Age must be at least 12.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    required
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a gender.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Contact Information Section */}
            <h5 className="mb-4" style={{color: "#4C6C44"}}>Contact Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a phone number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Additional Information Section */}
            <h5 className="mb-4" style={{color: "#A49559"}}>Additional Information</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select
                    required
                    name="marriageStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option>Single</option>
                    <option>Divorced</option>
                    <option>Widow</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Muslim Status</Form.Label>
                  <Form.Select
                    required
                    name="muslimStatus"
                    value={formData.muslimStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option>Born</option>
                    <option>Reverted</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a status.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Education</Form.Label>
                  <Form.Select
                    required
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  >
                    <option value="">Select Education</option>
                    <option>Below Matric</option>
                    <option>Matric</option>
                    <option>Inter</option>
                    <option>Bachelors</option>
                    <option>Masters</option>
                    <option>PhD</option>
                    <option>Aalim</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select education level.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profession</Form.Label>
                  <Form.Select
                    required
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                  >
                    <option value="">Select Profession</option>
                    <option>Job</option>
                    <option>Business</option>
                    <option>Freelancer</option>
                    <option>Daily Wager</option>
                    <option>No</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a profession.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="location"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter location"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a location.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Brief Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter a brief description about yourself"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={closeModal} style={{backgroundColor: "#A49559"}}>
            Cancel
          </Button>
          <Button type="submit" style={{backgroundColor: "#4C6C44"}}>
            Add Candidate
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CandidateModal;
