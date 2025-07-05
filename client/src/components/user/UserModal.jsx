// --- UserModal.js ---

import React, { useEffect, useMemo } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { PencilSquare, PersonPlus, Shield, Star } from 'react-bootstrap-icons';
import UserAPI from '../../api/user';
import AuthAPI from '../../api/auth';
import { APP_PERMISSIONS } from '../../utils/constants';

const UserModal = ({ mode, userData, show, handleClose, onExited, onUserAddOrUpdate }) => {
  const isCreateMode = useMemo(() => mode === 'add', [mode]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      phoneNo: '',
      status: true,
      appPermissions: [],
    },
  });

  // Watch the role field to conditionally show app permissions
  const selectedRole = watch('role');

  useEffect(() => {
    if (userData) {
      Object.entries(userData).forEach(([key, value]) => {
        setValue(key, key === 'dob' ? value?.split('T')[0] : value);
      });
    } else {
      reset();
    }
  }, [userData, reset, setValue]);

  const closeModal = () => {
    reset();
    handleClose();
  };

  const onSubmit = (newUser) => {
    // If role is admin, clear app permissions
    if (newUser.role === 'admin') {
      newUser.appPermissions = [];
    }

    const action = isCreateMode ? AuthAPI.signup : () => UserAPI.updateUser(userData._id, newUser);
    action(newUser)
      .then((response) => {
        onUserAddOrUpdate(response.data.data, mode);
        toast.success(isCreateMode ? 'New account created successfully' : 'Account updated successfully');
        closeModal();
      })
      .catch((error) => {
        const errorCode = error?.response?.data?.code;

        if (errorCode === 11000) {
          toast.error('Email already exists. Please use a different one.');
        } else {
          const serverMessage =
            error?.response?.data?.message || error?.message || 'Something went wrong';
          toast.error(serverMessage);
        }

        closeModal();
      });
  };

  return (
    <Modal show={show} onHide={closeModal} size="lg" centered backdrop="static" onExited={onExited}>
      <Modal.Header closeButton className={isCreateMode ? 'bg-primary text-white' : 'bg-warning text-white'} closeVariant="white">
        <Modal.Title>
          {isCreateMode ? <PersonPlus className="me-2" /> : <PencilSquare className="me-2" />}
          {isCreateMode ? 'Create New User' : 'Edit User'}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-4" style={{ color: 'grey' }}>
              {isCreateMode ? 'Basic Information' : 'Update Information'}
            </h5>
            <Row>
              {/* Show all fields in create mode, only role and app permissions in edit mode */}
              {isCreateMode && (
                <>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        isInvalid={!!errors.fullname}
                        {...register('fullname', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'Full name must be at least 2 characters' },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.fullname?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        isInvalid={!!errors.email}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format',
                          },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        isInvalid={!!errors.password}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        isInvalid={!!errors.confirmPassword}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) => value === watch('password') || 'Passwords do not match',
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter phone number"
                        isInvalid={!!errors.phoneNo}
                        {...register('phoneNo', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10,15}$/,
                            message: 'Phone number must be 10-15 digits',
                          },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phoneNo?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select isInvalid={!!errors.role} {...register('role', { required: 'Role is required' })}>
                    <option value="">Select Role</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.role?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Show app permissions only if role is not admin */}
              {selectedRole !== 'admin' && (
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>App Permissions</Form.Label>
                    <div className={`form-control ${errors.appPermissions ? 'is-invalid' : ''}`} style={{ height: 'auto', padding: '15px' }}>
                      <Row>
                        {APP_PERMISSIONS.map((app, index) => (
                          <Col md={6} lg={4} key={app} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              id={`permission-${index}`}
                              label={app.charAt(0).toUpperCase() + app.slice(1)}
                              value={app}
                              {...register('appPermissions', {
                                validate: (value) => value?.length > 0 || 'At least one app permission must be selected',
                              })}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <Form.Control.Feedback type="invalid">{errors.appPermissions?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant={isCreateMode ? 'primary' : 'warning'}>
            {isCreateMode ? 'Add' : 'Update'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;