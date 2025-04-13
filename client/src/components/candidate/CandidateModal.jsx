import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import CandidateAPI from '../../api/candidate';
import { toast } from 'react-toastify';
import { Education, Gender, HouseOwnership, MaritalStatus, MuslimStatus, Nationality, SectType } from '../../enums/candidateEnums';

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

  // Watch age for validation
  const age = watch('age');

  // Reset form when candidateData changes
  useEffect(() => {
    if (candidateData) {
      // Set all values from candidateData
      Object.entries(candidateData).forEach(([key, value]) => {
        if(key === 'dob') {
          setValue(key, candidateData?.dob.split("T")[0])
        } else setValue(key, value);
      });
    } else {
      reset(); // Reset to default values
    }
  }, [candidateData, reset, setValue]);

  const closeModal = () => {
    reset();
    handleClose();
  };

  const onSubmit = (cand) => {
    if (mode === 'add') {
      CandidateAPI.addCandidate(cand)
        .then((response) => {
          onCandidateAddOrUpdate(response.data.data, mode);
          console.log("Response", response);
          toast.success("Candidate added successfully");
          closeModal();
        })
        .catch((error) => {
          const message = error?.message || "Something went wrong";
          toast.error(message);
        });
    } else {
      CandidateAPI.updateCandidate(cand._id, cand)
        .then((response) => {
          onCandidateAddOrUpdate(response.data.data, mode);
          console.log("Update Response: ", response);
          toast.success("Candidate updated successfully");
          closeModal();
        })
        .catch((error) => {
          const message = error?.message || "Something went wrong";
          toast.error(message);
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
            <h5 className="mb-4" style={{color: "#A49559"}}>Personal Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    isInvalid={!!errors.name}
                    {...register("name", {
                      required: "Please provide a name",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters"
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  isInvalid={!!errors.dob}
                  {...register("dob", {
                    required: "Date of birth is required",
                    validate: {
                      validDate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        return (
                          selectedDate < today || "Date of birth cannot be in the future"
                        );
                      },
                      minAge: (value) => {
                        const birthDate = new Date(value);
                        const today = new Date();
                        const age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff = today.getMonth() - birthDate.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                          return age - 1 >= 18 || "Must be at least 18 years old";
                        }
                        return age >= 18 || "Must be at least 18 years old";
                      }
                    }
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dob?.message}
                </Form.Control.Feedback>
              </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.gender}
                    {...register("gender", {
                      required: "Please select a gender"
                    })}
                  >
                    <option value="">Select Gender</option>
                    {Object.values(Gender).map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Contact Information Section */}
            <h5 className="mb-4" style={{color: "#4C6C44"}}>Contact Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    isInvalid={!!errors.contact}
                    {...register("contact", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid phone number"
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Family Background Section */}
            <h5 className="mb-4" style={{color: "#A49559"}}>Family Background</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Father Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father Name"
                    isInvalid={!!errors.fatherName}
                    {...register("fatherName", {
                      required: "Please provide Father Name"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fatherName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Father Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father Occupation"
                    isInvalid={!!errors.fatherOccupation}
                    {...register("fatherOccupation")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fatherOccupation?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Caste</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Caste"
                    isInvalid={!!errors.caste}
                    {...register("caste")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.caste?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                <Form.Label>Number of Siblings</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  isInvalid={!!errors.siblingsCount}
                  {...register("siblingsCount", {
                    required: "Please enter number of siblings",
                    min: {
                      value: 0,
                      message: "Number cannot be negative"
                    },
                    max: {
                      value: 20,
                      message: "Maximum 20 siblings allowed"
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Must be a whole number"
                    }
                  })}
                />
                  <Form.Control.Feedback type="invalid">
                    {errors.siblingsCount?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Care of Contact</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter care of contact"
                    isInvalid={!!errors.careOfContact}
                    {...register("careOfContact", {
                      required: "Care Of Contact is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid Care Of Contact"
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.careOfContact?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Educational Background Section */}
            <h5 className="mb-4" style={{color: "#4C6C44"}}>Educational Background</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.qualification}
                    {...register("qualification", {
                      required: "Please select education level"
                    })}
                  >
                    <option value="">Select Education</option>
                    {Object.values(Education).map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.qualification?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Professional Information Section */}
            <h5 className="mb-4" style={{color: "#A49559"}}>Professional Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Income Amount (In Rupees)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Income Amount"
                    isInvalid={!!errors.incomeAmount}
                    {...register("incomeAmount")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.incomeAmount?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Source of Income</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Source of Income"
                    isInvalid={!!errors.sourceOfIncome}
                    {...register("sourceOfIncome")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sourceOfIncome?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Profession</Form.Label>
                  <Form.Select
                    disabled="true"
                    isInvalid={!!errors.profession}
                    // {...register("profession", {
                    //   required: "Please select a profession"
                    // })}
                  >
                    <option value="">Select Profession</option>
                    <option>Job</option>
                    <option>Business</option>
                    <option>Freelancer</option>
                    <option>Daily Wager</option>
                    <option>No</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.profession?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>  
            
            {/* Residential Information Section */}
            <h5 className="mb-4" style={{color: "#4C6C44"}}>Residential Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>House Size</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter House Size"
                    isInvalid={!!errors.houseSize}
                    {...register("houseSize")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.houseSize?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>House</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.house}
                    {...register("houseOwnership", {
                      required: "Please select Value"
                    })}
                  >
                    <option value="">Select House Ownership</option>
                    {Object.values(HouseOwnership).map((houseOwnershipStatus) => (
                      <option key={houseOwnershipStatus} value={houseOwnershipStatus}>
                        {houseOwnershipStatus}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.houseOwnership?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Area of Residence</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Area of Residence"
                    isInvalid={!!errors.areaOfResidence}
                    {...register("areaOfResidence", {
                      required: "Please provide Area of Residence"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.areaOfResidence?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City"
                    isInvalid={!!errors.city}
                    {...register("city", {
                      required: "Please provide city"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Address"
                    isInvalid={!!errors.address}
                    {...register("address", {
                      required: "Please provide address"
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Physical Appearance Section */}
            <h5 className="mb-4" style={{color: "#A49559"}}>Physical Appearance</h5>
            <Row>
            <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Height (feet&apos;inches&quot;)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 5&apos;10&quot;"
                    isInvalid={!!errors.height}
                    {...register("height", {
                      required: "Height is required",
                      pattern: {
                        value: /^\d{1,2}'\d{1,2}"?$/,
                        message: "Please use format like 5\'10\""
                      },
                      validate: {
                        validFeet: value => {
                          const [feet] = value.split("'");
                          return (parseInt(feet) >= 3 && parseInt(feet) <= 8) || 
                            "Height should be between 3\' and 8\";";
                        },
                        validInches: value => {
                          const [, inches] = value.split("'");
                          const cleanInches = inches.replace(/"/g, '');
                          return (parseInt(cleanInches) >= 0 && parseInt(cleanInches) < 12) || 
                            "Inches must be between 0 and 11";
                        }
                      }
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.height?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Health Condition</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your health condition"
                    {...register("healthCondition")}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Additional Information Section */}
            <h5 className="mb-4" style={{color: "#4C6C44"}}>Additional Information</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.maritalStatus}
                    {...register("maritalStatus", {
                      required: "Please select marital status"
                    })}
                  >
                    <option value="">Select Status</option>
                    {Object.values(MaritalStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.maritalStatus?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Muslim Status</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.muslimStatus}
                    {...register("muslimStatus", {
                      required: "Please select muslim status"
                    })}
                  >
                    <option value="">Select Status</option>
                    {Object.values(MuslimStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.muslimStatus?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Maslak</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.maslak}
                    {...register("maslak", {
                      required: "Please select maslak"
                    })}
                  >
                    <option value="">Select Maslak</option>
                    {Object.values(SectType).map((sect) => (
                      <option key={sect} value={sect}>
                        {sect}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.maslak?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.nationality}
                    {...register("nationality", {
                      required: "Please select nationality"
                    })}
                  >
                    <option value="">Select Nationality</option>
                    {Object.values(Nationality).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.nationality?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Brief Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter a brief description about yourself"
                    {...register("description")}
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
          <Button 
            type="submit" 
            style={{backgroundColor: "#4C6C44"}}
            // disabled={!isDirty || !isValid}
          >
            {mode === 'add' ? "Add" : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CandidateModal;