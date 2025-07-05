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

const UserTable = ({ users, onUserModalShow, onStatusToggle, setSelectedUser, setShowDeleteModal }) => {
  const getStatusBadge = (status) => {
    return status ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      Admin: 'danger',
      Manager: 'warning',
      Employee: 'primary',
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 py-3">User</th>
                <th className="border-0 py-3">Role</th>
                <th className="border-0 py-3">Contact</th>
                <th className="border-0 py-3">Status</th>
                <th className="border-0 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-3">
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
                  <td className="py-3">{getRoleBadge(user.role)}</td>
                  <td className="py-3">
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
                  <td className="py-3">{getStatusBadge(user.status)}</td>
                  <td className="py-3">
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
                            size="sm"
                            variant={user.status ? 'outline-danger' : 'outline-success'}
                            className="p-1 d-flex align-items-center justify-content-center"
                            style={{
                              width: '28px',
                              height: '28px',
                              border: user.status ? '1px solid #dc3545' : '1px solid #198754',
                              borderRadius: '6px',
                            }}
                            onClick={() => onStatusToggle(user)}
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
                            size="sm"
                            variant="outline-info"
                            className="p-1 d-flex align-items-center justify-content-center"
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid #0dcaf0',
                              borderRadius: '6px',
                            }}
                            onClick={() => console.log('Handle reset password')}
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
                            size="sm"
                            variant="outline-warning"
                            className="p-1 d-flex align-items-center justify-content-center"
                            style={{
                              width: '28px',
                              height: '28px',
                              border: '1px solid',
                              borderColor: 'warning',
                              borderRadius: '6px',
                            }}
                            onClick={() => onUserModalShow('edit', user)}
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
