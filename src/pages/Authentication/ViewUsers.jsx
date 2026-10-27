// pages/Users/ViewUsers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaCopy, FaCheck, FaTimes } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Pagination from '../../components/Pagination/Pagination';
import { VIEWUSERS_URL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

/* ---------- Animated toggle ---------- */
const StatusToggle = ({ enabled, loading, pulse, onToggle }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={enabled ? 'Disable user' : 'Enable user'}
    disabled={loading}
    onClick={onToggle}
    className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full p-0.5
      transition-all duration-500 ease-[cubic-bezier(0.68,-0.3,0.27,1.3)]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
      disabled:cursor-wait
      ${enabled
        ? 'bg-gradient-to-r from-emerald-400 to-green-600 shadow-[0_0_12px_rgba(16,185,129,0.55)]'
        : 'bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700'}`}
  >
    {/* ripple ring fired on every change */}
    {pulse && (
      <span
        className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
          enabled ? 'bg-emerald-400' : 'bg-slate-400'
        }`}
      />
    )}

    {/* thumb */}
    <span
      className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md
        transition-transform duration-500 ease-[cubic-bezier(0.68,-0.3,0.27,1.3)]
        ${enabled ? 'translate-x-7 rotate-[360deg]' : 'translate-x-0 rotate-0'}`}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
      ) : enabled ? (
        <FaCheck className="text-[10px] text-green-600" />
      ) : (
        <FaTimes className="text-[10px] text-slate-500" />
      )}
    </span>
  </button>
);

/* ---------- Delete confirmation modal ---------- */
const DeleteModal = ({ user, deleting, onCancel, onConfirm }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center p-4 transition-all duration-300
        ${show ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={deleting ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-md bg-white p-6 shadow-xl dark:bg-boxdark
          transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <MdDelete className="text-3xl text-red-600 dark:text-red-200" />
        </div>
        <h3 className="mb-2 text-center text-xl font-semibold text-black dark:text-white">Delete user?</h3>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-black dark:text-white">{user.name || user.username}</span> will be
          permanently removed. This can't be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="w-full rounded border border-stroke py-2 font-medium text-black transition hover:bg-gray-100 disabled:opacity-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex w-full items-center justify-center gap-2 rounded bg-red-600 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            {deleting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {deleting ? 'Deleting…' : 'Delete user'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */
const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedUserId, setCopiedUserId] = useState(null);

  // toggle / delete state
  const [togglingId, setTogglingId] = useState(null);
  const [pulseId, setPulseId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState(null); // { type, text }

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10,
  });

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 2500);
  };

  // Fetch users
  const fetchUsers = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${VIEWUSERS_URL}`, {
        params: { page },
        headers: authHeaders,
      });
      setUsers(data.content || []);
      setPagination({
        // Spring's `number` is 0-based, our UI is 1-based
        currentPage: (data.number ?? 0) + 1,
        totalPages: data.totalPages || 0,
        totalItems: data.totalElements || 0,
        pageSize: data.size || 10,
      });
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetchUsers(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, fetchUsers]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  /* ---- enable / disable ---- */
  const handleToggleStatus = async (user) => {
    const next = !user.enabled;
    setTogglingId(user.id);
    try {
      // PUT /user/status/{id}?enabled=true|false
      await axios.put(`${VIEWUSERS_URL}/status/${user.id}`, null, {
        params: { enabled: next },
        headers: authHeaders,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, enabled: next } : u)));
      setPulseId(user.id);
      setTimeout(() => setPulseId(null), 600);
      showToast('success', `${user.name || user.username} ${next ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('error', 'Could not update status. Try again.');
    } finally {
      setTogglingId(null);
    }
  };

  /* ---- delete ---- */
  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      // DELETE /user/delete/{id}
      await axios.delete(`${VIEWUSERS_URL}/delete/${userToDelete.id}`, { headers: authHeaders });
      const id = userToDelete.id;
      setUserToDelete(null);
      setRemovingId(id); // fade the row out
      setTimeout(() => {
        setRemovingId(null);
        // go back a page if we just removed the last row of this one
        if (users.length === 1 && pagination.currentPage > 1) {
          setPagination((p) => ({ ...p, currentPage: p.currentPage - 1 }));
        } else {
          fetchUsers(pagination.currentPage);
        }
      }, 350);
      showToast('success', 'User deleted');
    } catch (err) {
      console.error('Failed to delete user:', err);
      showToast('error', 'Could not delete user. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Copy username to clipboard
  const copyToClipboard = async (username, userId) => {
    try {
      await navigator.clipboard.writeText(username);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = username;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedUserId(userId);
    setTimeout(() => setCopiedUserId(null), 2000);
  };

  const getRoleBadgeColor = (roleName) => {
    const role = roleName?.toLowerCase();
    if (role?.includes('superadmin')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (role?.includes('admin')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (role?.includes('manager')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (role?.includes('user')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusBadge = (user) => {
    if (!user.enabled) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 transition-colors duration-500 dark:bg-red-900 dark:text-red-200">
          Disabled
        </span>
      );
    }
    if (user.accountNonLocked === false) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Locked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 transition-colors duration-500 dark:bg-green-900 dark:text-green-200">
        <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
        Active
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((w) => w.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Management / View Users" />

      {/* Toast */}
      <div
        className={`fixed right-6 top-24 z-99999 rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300
          ${toast ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'}
          ${toast?.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
      >
        {toast?.text}
      </div>

      {userToDelete && (
        <DeleteModal
          user={userToDelete}
          deleting={deleting}
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <div className="px-6.5 py-2 dark:border-strokedark">
              <h3 className="text-center text-xl font-medium text-slate-500 dark:text-slate-400">View Users</h3>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div />
              <button
                onClick={() => navigate('/auth/signup')}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white transition-colors hover:bg-opacity-90"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-meta-4">
                  <th className="min-w-[50px] px-4 py-4 text-sm font-sm text-black dark:text-white">#</th>
                  <th className="min-w-[220px] px-4 py-4 text-sm font-sm text-black dark:text-white">NAME / USERNAME</th>
                  <th className="min-w-[180px] px-4 py-4 text-sm font-sm text-black dark:text-white">Contact Details</th>
                  <th className="min-w-[120px] px-4 py-4 text-sm font-sm text-black dark:text-white">Role</th>
                  <th className="min-w-[100px] px-4 py-4 text-sm font-sm text-black dark:text-white">Status</th>
                  <th className="min-w-[90px] px-4 py-4 text-sm font-sm text-black dark:text-white">Enabled</th>
                  <th className="min-w-[100px] px-4 py-4 text-sm font-sm text-black dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-2 text-4xl">⚠️</div>
                        <p className="text-red-500">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FaUser className="mb-3 text-5xl text-gray-300 dark:text-gray-600" />
                        <p className="font-medium text-gray-500 dark:text-gray-400">No users found</p>
                        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Add a new user to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-stroke transition-all duration-300 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4
                        ${removingId === user.id ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'}
                        ${!user.enabled ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-5">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-black dark:text-white">{user.name || 'N/A'}</p>
                            <button
                              onClick={() => copyToClipboard(user.username, user.id)}
                              className="group flex items-center gap-2"
                              title="Click to copy username"
                            >
                              <span className="text-sm text-blue-500 transition-colors group-hover:text-primary dark:text-gray-400">
                                @{user.username || 'username'}
                              </span>
                              {copiedUserId === user.id ? (
                                <FaCheck className="text-xs text-green-500" />
                              ) : (
                                <FaCopy className="text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <FaEnvelope className="text-xs text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{user.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaPhone className="text-xs text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{user.phoneNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(
                            user?.authorities?.[0]?.authority
                          )}`}
                        >
                          {user?.authorities?.[0]?.authority || 'No Role'}
                        </span>
                      </td>

                      <td className="px-4 py-5">{getStatusBadge(user)}</td>

                      <td className="px-4 py-5">
                        <StatusToggle
                          enabled={!!user.enabled}
                          loading={togglingId === user.id}
                          pulse={pulseId === user.id}
                          onToggle={() => handleToggleStatus(user)}
                        />
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex gap-3">
                          <button
                            title="Edit user"
                            onClick={() => navigate(`/auth/edit/${user.id}`)}
                            className="rounded p-1.5 text-blue-600 transition hover:scale-110 hover:bg-blue-50 dark:hover:bg-meta-4"
                          >
                            <AiFillEdit size={15} />
                          </button>
                          <button
                            title="Delete user"
                            onClick={() => setUserToDelete(user)}
                            className="rounded p-1.5 text-red-600 transition hover:scale-110 hover:bg-red-50 dark:hover:bg-meta-4"
                          >
                            <MdDelete size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && users.length > 0 && (
            <div className="border-t border-stroke px-6.5 py-4 dark:border-strokedark">
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
