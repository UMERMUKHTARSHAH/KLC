// pages/Users/ViewUsers.jsx

import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
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

  // Generate page numbers
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 3) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
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
                <h3 className="font-medium text-black dark:text-white text-xl">
                  Users List
                </h3>
                {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View and manage all system users
                </p> */}
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
                  {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white text-sm text-center">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">⚠️</div>
                        <p className="text-red-500">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username || 'username'}
                            </p>
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.name)}`}>
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
                      
                      {/* <td className="py-5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                            title="View Details"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"
                            title="Edit User"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                            title="Delete User"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="border-t border-stroke dark:border-strokedark py-4 px-6.5">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-semibold">{pagination.totalItems}</span> users
                </div>
                
                <nav aria-label="Pagination">
                  <ul className="flex items-center gap-2">
                    {/* Previous button */}
                    <li>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </li>
                    
                    {/* Page numbers */}
                    {getPageNumbers().map((page, index) => (
                      <li key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              page === pagination.currentPage
                                ? 'bg-primary text-white'
                                : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </li>
                    ))}
                    
                    {/* Next button */}
                    <li>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewUsers;