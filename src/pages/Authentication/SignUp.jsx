import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useSignup from '../../hooks/UseSignup';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';

const Signup = () => {
    const theme = useSelector(state => state?.persisted?.theme);
    const [RoleOptions, setRoleOptions] = useState([]);
    const customStyles = createCustomStyles(theme?.mode);

    const { FormData, handleSubmit, getRole, Role } = useSignup();

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Required').notOneOf([''], 'Name should not be empty'),
        phoneNumber: Yup.string().trim().required('Required').notOneOf([''], 'Phone number should not be empty'),
        address: Yup.string().trim().required('Required').notOneOf([''], 'Address should not be empty'),
        username: Yup.string().trim().required('Field is required').notOneOf([''], 'Username should not be empty'),
        password: Yup.string()
            .required('Field is required')
            .min(8, 'Password is too short')
            .matches(/[A-Z]/, 'Password should contain at least one uppercase letter')
            .notOneOf([''], 'Password should not be empty'),
        role: Yup.object().nullable().required('Role is required'),
    });

    useEffect(() => {
        getRole();
    }, []);

    useEffect(() => {
        if (Role) {
            const formattedOptions = Role.map(role => ({
                value: role.id, 
                label: role.name, 
                roleObject: role,
            }));
            setRoleOptions(formattedOptions);
        }
    }, [Role]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Dashboard / Authentication / Add User" />
            <div>
                <Formik
                    initialValues={{ ...FormData, role: null }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
    <div className="flex gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-slate-500 text-center text-xl dark:text-slate-400">
                    Add User
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6.5">
                {/* Row 1: Name */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Name</label>
                    <Field
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>

                {/* Row 1: Role */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Role</label>
                    <ReactSelect
                        name="role"
                        styles={customStyles}
                        value={values.role}
                        onChange={(option) => setFieldValue('role', option)}
                        options={RoleOptions}
                        className="bg-white dark:bg-form-Field"
                        classNamePrefix="react-select"
                        placeholder="Select Role"
                    />
                    <ErrorMessage name="role" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Row 1: Email */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Email</label>
                    <Field
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>

                {/* Row 2: Phone Number */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Phone Number</label>
                    <Field
                        type="text"
                        name="phoneNumber"
                        placeholder="Enter Phone Number"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
                </div>

                {/* Row 2: Address */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Address</label>
                    <Field
                        type="text"
                        name="address"
                        placeholder="Enter Address"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500" />
                </div>

                {/* Row 2: Username */}
                <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Username</label>
                    <Field
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500" />
                </div>

                {/* Row 3: Password - spans full width */}
                <div className="col-span-1 md:col-span-3">
                    <label className="mb-2.5 block text-black dark:text-white">Password</label>
                    <Field
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>

                {/* Row 4: Submit Button - spans full width */}
        <div className="flex justify-center items-center col-span-1 md:col-span-3">
    <button 
        type="submit" 
        className="rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 px-6"
    >
        Add User
    </button>
</div>
            </div>
        </div>
    </div>
</Form>
                    )}


                </Formik>

            </div>
        </DefaultLayout >
    )
}

export default Signup
