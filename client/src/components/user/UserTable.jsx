// --- UserTable.js ---

import React from 'react';
import { Badge, Button, Card, Dropdown, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import {
  ArrowRepeat,
  ChatFill,
  Envelope,
  EyeFill,
  GeoAlt,
  KeyFill,
  PencilSquare,
  PersonFill,
  PersonSlash,
  PersonX,
  PersonCheck,
  Telephone,
  ThreeDotsVertical,
  Trash,
} from 'react-bootstrap-icons';

const UserTable = ({ users, onUserModalShow, onStatusToggle, onResetPassword, setSelectedUser, setShowDeleteModal }) => {
  const getStatusBadge = (status) => {
    return status ? (
      <Badge bg="success" className="px-3 py-2 rounded-pill">Active</Badge>
    ) : (
      <Badge bg="secondary" className="px-3 py-2 rounded-pill">Inactive</Badge>
    );
  };

  const getRoleBadge = (role) => {
    const variants = {
      Admin: 'danger',
      Manager: 'warning',
      Employee: 'primary',
    };
    return <Badge bg={variants[role] || 'secondary'} className="px-3 py-2 rounded-pill">{role}</Badge>;
  };

  return (
    <Card className="card-modern-glass">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0 table-borderless">
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th className="py-3 px-4 text-muted fw-semibold">User</th>
                <th className="py-3 px-4 text-muted fw-semibold">Role</th>
                <th className="py-3 px-4 text-muted fw-semibold">Contact</th>
                <th className="py-3 px-4 text-muted fw-semibold">Status</th>
                <th className="py-3 px-4 text-muted fw-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                      >
                        <PersonFill className="text-white" />
                      </div>
                      <div>
                        <div className="fw-bold">{user.fullname}</div>
                        <small className="text-muted">
                          <Envelope size={12} className="me-1" />
                          {user.email}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <small className="d-block">
                        <Telephone size={12} className="me-1" />
                        {user.phoneNo}
                      </small>
                      <small className="text-muted">
                        <GeoAlt size={12} className="me-1" />
                        Location
                      </small>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-3 px-4">
                    <div style={{ width: 'fit-content' }}>
                      {/* First Row - Activate/Deactivate and Reset Password */}
                      <div className="d-flex gap-1 mb-1">
                        {/* Dynamic Activate/Deactivate */}
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              {user.status ? 'Deactivate Account' : 'Activate Account'}
                            </Tooltip>
                          }
                        >
                          <Button
                            variant={user.status ? 'outline-danger' : 'outline-success'}
                            className="btn-icon-sm"
                            onClick={() => onStatusToggle(user)}
                            title={user.status ? 'Deactivate' : 'Activate'}
                          >
                            {user.status ? <PersonX size={12} /> : <PersonCheck size={12} />}
                          </Button>
                        </OverlayTrigger>

                        {/* Reset Password */}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Reset Password</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            className="btn-icon-sm"
                            onClick={() => onResetPassword(user)}
                            title="Reset Password"
                          >
                            <KeyFill size={12} />
                          </Button>
                        </OverlayTrigger>
                      </div>

                      {/* Second Row - Edit User and More */}
                      <div className="d-flex gap-1">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit User</Tooltip>}
                        >
                          <Button
                            variant="outline-primary"
                            className="btn-icon-sm"
                            onClick={() => onUserModalShow('edit', user)}
                            title="Edit User"
                          >
                            <PencilSquare size={12} />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>More Options</Tooltip>}
                        >
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              as={Button}
                              size="sm"
                              variant="outline-secondary"
                              className="p-1 d-flex align-items-center justify-content-center border-0"
                              style={{
                                width: '28px',
                                height: '28px',
                                border: '1px solid #6c757d',
                                borderRadius: '6px',
                              }}
                            >
                              <ThreeDotsVertical size={12} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => console.log('View Profile')}>
                                <EyeFill className="me-2" size={14} /> View Profile
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => console.log('Send Message')}>
                                <ChatFill className="me-2" size={14} /> Send Message
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash className="me-2" size={14} /> Delete User
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-5">
            <PersonFill size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No users found</h5>
            <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserTable;
