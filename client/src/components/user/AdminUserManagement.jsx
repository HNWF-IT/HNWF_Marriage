// --- AdminUserManagement.js ---

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { PersonFill, PersonPlus, Search, Filter, Trash, PersonBadge } from 'react-bootstrap-icons';
import UserTable from './UserTable';
import UserModal from './UserModal';
import UserAPI from '../../api/user';
import { toast } from 'react-toastify';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalMode, setModalMode] = useState(''); // 'add' or 'edit'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await UserAPI.getAllUsers();
        if (response.data.success && response.data.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        const message = error?.message || "Something went wrong";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showNotification = (message, variant = 'success') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleUserModalShow = (mode, user) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUserModalClose = () => {
    setShowUserModal(false);
  };

  const handleUserModalExited = () => {
    setModalMode('');
    setSelectedUser(null);
  };

  const handleUserAddOrUpdate = (user, mode) => {
    if (mode === 'add') {
      setUsers(prev => [...prev, user]);
    } else if (mode === 'edit') {
      setUsers(prev => prev.map(u => (u._id === user._id ? user : u)));
    }
  };

  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    showNotification('User deleted successfully!');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || (filterStatus === 'Active' ? user.status : !user.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1">
                <PersonBadge className="me-2" />
                User Management
              </h2>
              <p className="text-muted mb-0">Manage user accounts and permissions</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => handleUserModalShow('add', {})}>
              <PersonPlus className="me-2" />
              Create User
            </Button>
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <Filter />
                </InputGroup.Text>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3} className="text-md-end">
              <small className="text-muted">
                Showing {filteredUsers.length} of {users.length} users
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <UserTable users={filteredUsers} onUserModalShow={handleUserModalShow} />
      <UserModal
        mode={modalMode}
        userData={selectedUser}
        show={showUserModal}
        handleClose={handleUserModalClose}
        onExited={handleUserModalExited}
        onUserAddOrUpdate={handleUserAddOrUpdate}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <Trash className="me-2" /> Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="text-center">
              <div className="mb-3">
                <PersonFill size={48} className="text-danger" />
              </div>
              <h5>Delete User Account?</h5>
              <p className="text-muted mb-0">
                Are you sure you want to delete <strong>{selectedUser.fullname}</strong>? This action cannot be undone.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUserManagement;
