// pages/Users/EditUser.jsx
import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { customStyles as createCustomStyles, VIEWUSERS_URL } from '../../Constants/utils';

const inputClass =
  'w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
  phoneNumber: Yup.string().trim().required('Required'),
  address: Yup.string().trim().required('Required'),
  username: Yup.string().trim().required('Required'),
  email: Yup.string().email('Invalid email').nullable(),
  // optional on edit: leave blank to keep the current password
  password: Yup.string()
    .nullable()
    .test('pw', 'Min 8 chars with one uppercase letter', (v) => !v || (v.length >= 8 && /[A-Z]/.test(v))),
  role: Yup.object().nullable().required('Role is required'),
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useSelector((state) => state?.persisted?.theme);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const customStyles = createCustomStyles(theme?.mode);

  const [roleOptions, setRoleOptions] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [userRes, rolesRes] = await Promise.all([
          axios.get(`${VIEWUSERS_URL}/${id}`, { headers }),        // GET /user/{id}
          axios.get(`${VIEWUSERS_URL}/roles`, { headers }),        // GET /user/roles
        ]);

        const options = (rolesRes.data || []).map((r) => ({ value: r.id, label: r.name, roleObject: r }));
        setRoleOptions(options);

        const u = userRes.data;
        const currentRoleName = u?.authorities?.[0]?.authority;
        const currentRole =
          options.find((o) => o.label === currentRoleName) ||
          options.find((o) => o.value === u?.role?.id) ||
          null;

        setInitialValues({
          name: u.name || '',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          address: u.address || '',
          username: u.username || '',
          password: '',
          role: currentRole,
        });
      } catch (err) {
        console.error(err);
        setError('Could not load this user.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    // Matches UpdateUserRequest: name, phoneNumber, address, username, password, email, Role role
    const payload = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      username: values.username,
      // send ONLY id + name; the full role object contains a nested `users` set that breaks Jackson
      role: { id: values.role?.value, name: values.role?.label },
      ...(values.password ? { password: values.password } : {}),
    };
    try {
      await axios.put(`${VIEWUSERS_URL}/update/${id}`, payload, { headers }); // PUT /user/update/{id}
      setSaved(true);
      setTimeout(() => navigate('/auth/viewUsers'), 900); // ← change to your list route
    } catch (err) {
      console.error(err);
      setError('Could not save changes. Please try again.');
      setSubmitting(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="w-full">
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <Field type={type} name={name} placeholder={placeholder || `Enter ${label}`} className={inputClass} />
      <ErrorMessage name={name} component="div" className="text-sm text-red-500" />
    </div>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Management / Edit User" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="text-center text-xl font-medium text-slate-500 dark:text-slate-400">Edit User</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : !initialValues ? (
          <p className="py-16 text-center text-red-500">{error}</p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="grid grid-cols-1 gap-6 p-6.5 md:grid-cols-3">
                  {field('name', 'Name')}

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Role</label>
                    <ReactSelect
                      name="role"
                      styles={customStyles}
                      value={values.role}
                      onChange={(option) => setFieldValue('role', option)}
                      options={roleOptions}
                      classNamePrefix="react-select"
                      placeholder="Select Role"
                    />
                    <ErrorMessage name="role" component="div" className="text-sm text-red-600" />
                  </div>

                  {field('email', 'Email', 'email')}
                  {field('phoneNumber', 'Phone Number')}
                  {field('address', 'Address')}
                  {field('username', 'Username')}

                  <div className="col-span-1 md:col-span-3">
                    {field('password', 'New Password', 'password', 'Leave blank to keep current password')}
                  </div>

                  {error && <p className="col-span-1 text-center text-red-500 md:col-span-3">{error}</p>}

                  <div className="col-span-1 flex items-center justify-center gap-4 md:col-span-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded border border-stroke px-6 py-3 font-medium text-black transition hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || saved}
                      className={`flex items-center gap-2 rounded px-6 py-3 font-medium text-white transition-all duration-300 ${
                        saved ? 'bg-green-600' : 'bg-primary hover:bg-opacity-90'
                      } disabled:opacity-80`}
                    >
                      {isSubmitting && !saved && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      )}
                      {saved ? '✓ Saved' : isSubmitting ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditUser;
