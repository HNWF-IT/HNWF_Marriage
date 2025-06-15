import React from 'react';
import { Badge, Card, Dropdown, Table } from 'react-bootstrap';
import { Building, Calendar, Envelope, GeoAlt, PencilSquare, PersonFill, Telephone, ThreeDotsVertical, Trash } from 'react-bootstrap-icons';

const UserTable = ({ users, onUserModalShow }) => {
    const getStatusBadge = (status) => {
    return status === 'Active' ? 
        <Badge bg="success">Active</Badge> : 
        <Badge bg="secondary">Inactive</Badge>;
    };

    const getRoleBadge = (role) => {
        const variants = {
            'Admin': 'danger',
            'Manager': 'warning',
            'Employee': 'primary'
        };
        return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
    };

  return (
    <>
        {/* Users Table */}
        <Card className="shadow-sm">
            <Card.Body className="p-0">
            <div className="table-responsive">
                <Table hover className="mb-0">
                <thead className="bg-light">
                    <tr>
                    <th className="border-0 py-3">User</th>
                    <th className="border-0 py-3">Role</th>
                    <th className="border-0 py-3">Department</th>
                    <th className="border-0 py-3">Contact</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Join Date</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user.id}>
                        <td className="py-3">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                style={{width: '40px', height: '40px', minWidth: '40px'}}>
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
                        <td className="py-3">
                        {getRoleBadge(user.role)}
                        </td>
                        <td className="py-3">
                        <div className="d-flex align-items-center">
                            <Building size={14} className="me-2 text-muted" />
                            {user.department}
                        </div>
                        </td>
                        <td className="py-3">
                        <div>
                            <small className="d-block">
                            <Telephone size={12} className="me-1" />
                            {user.phone}
                            </small>
                            <small className="text-muted">
                            <GeoAlt size={12} className="me-1" />
                            {user.location}
                            </small>
                        </div>
                        </td>
                        <td className="py-3">
                        {getStatusBadge(user.status)}
                        </td>
                        <td className="py-3">
                        <div>
                            <small className="d-block">
                            <Calendar size={12} className="me-1" />
                            {user.joinDate}
                            </small>
                            <small className="text-muted">Last: {user.lastLogin}</small>
                        </div>
                        </td>
                        <td className="py-3">
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0">
                            <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            <Dropdown.Item 
                                onClick={() => onUserModalShow('edit', user)}
                            >
                                <PencilSquare className="me-2" size={14} />
                                Edit User
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                                className="text-danger"
                                onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                                }}
                            >
                                <Trash className="me-2" size={14} />
                                Delete User
                            </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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
    </>
  );
};

export default UserTable;