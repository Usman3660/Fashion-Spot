// frontend/src/pages/AdminUsersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/admin-users.css';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <div className="admin-header">
        <h2>Admin: Manage Users</h2>
        <button onClick={() => navigate('/')}>⬅ Back to Home</button>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
