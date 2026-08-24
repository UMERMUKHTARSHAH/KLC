// pages/Users/ViewUsers.jsx

import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaCopy, FaCheck } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Pagination from '../../components/Pagination/Pagination';
import { VIEWUSERS_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ViewUsers = () => {

    const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedUserId, setCopiedUserId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${VIEWUSERS_URL}`, {
          params: {
            page: pagination.currentPage, // Send page as-is (1-based)
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = response.data;
        setUsers(data.content || []);
        setPagination({
          currentPage: data.number || 1, // Keep page as-is
          totalPages: data.totalPages || 0,
          totalItems: data.totalElements || 0,
          pageSize: data.size || 10
        });
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.currentPage, token]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Copy username to clipboard
  const copyToClipboard = async (username, userId) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopiedUserId(userId);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedUserId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = username;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUserId(userId);
      setTimeout(() => {
        setCopiedUserId(null);
      }, 2000);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (roleName) => {
    const role = roleName?.toLowerCase();
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (user) => {
    if (!user.enabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Disabled
        </span>
      );
    }
    if (!user.accountNonLocked) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Locked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
        Active
      </span>
    );
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Management / View Users" />
      
      <div className="flex flex-col gap-6">
        {/* Main Card */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                {/* <h2 className="font-medium text-black dark:text-white text-xl">
                  Users List
                </h2> */}
              </div>
              
              <button onClick={()=>navigate("/auth/signup")} className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition-colors">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    #
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    User Information
                  </th>
                  <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    Contact Details
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    Role
                  </th>
                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    Status
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-sm">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">⚠️</div>
                        <p className="text-red-500">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <FaUser className="text-5xl text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Try adjusting your criteria or add a new user
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-150"
                    >
                      <td className="py-5 px-4">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                        </span>
                      </td>
                      
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {user.name || 'N/A'}
                            </p>
                            <button 
                              onClick={() => copyToClipboard(user.username, user.id)}
                              className="flex items-center gap-2 group"
                              title="Click to copy username"
                            >
                              <span className="text-sm text-blue-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                                @{user.username || 'username'}
                              </span>
                              {copiedUserId === user.id ? (
                                <FaCheck className="text-green-500 text-xs" />
                              ) : (
                                <FaCopy className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <FaEnvelope className="text-gray-400 text-xs" />
                            <span className="text-gray-600 dark:text-gray-400">{user.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaPhone className="text-gray-400 text-xs" />
                            <span className="text-gray-600 dark:text-gray-400">{user.phoneNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-5 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.authorities[0]?.authority)}`}>
                          {user?.authorities[0]?.authority || 'No Role'}
                        </span>
                      </td>
                      
                      <td className="py-5 px-4">
                        {getStatusBadge(user)}
                      </td>
                      
                      <td className="py-5 px-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.updated)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          {!loading && users.length > 0 && (
            <div className="border-t border-stroke dark:border-strokedark py-4 px-6.5">
              <Pagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewUsers;