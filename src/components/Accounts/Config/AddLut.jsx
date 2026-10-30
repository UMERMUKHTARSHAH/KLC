import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useAddLut from '../../../hooks/useAddLut';
import Pagination from '../../Pagination/Pagination';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";


import { TOGGLE_Lut_URL } from '../../../Constants/utils';

const AddLut = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

    const {
        AddLut,
        edit,
        currentAddLut,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        getLut,
        Luts
    } = useAddLut();

    useEffect(() => {
        getLut();
    }, []);

    const oneyearadd = (fromdate) => {
        if (!fromdate) return '';
        const date = new Date(fromdate);
        date.setFullYear(date.getFullYear() + 1);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split("T")[0];
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB');
        } catch (error) {
            return '-';
        }
    };

    // Function to toggle LUT active status
    const toggleLutActive = async (lutId, lut) => {
     

        try {
            const response = await fetch(`${TOGGLE_Lut_URL}/${lutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // body: JSON.stringify({
                //     isActive: !currentStatus
                // })
            });
          


            const data = await response.json();

            if (response.ok) {
                toast.success(`LUT ${lut.isActiveLut ? 'deactivated' : 'activated'} successfully`);
                getLut(); // Refresh the list
            } else {
                toast.error(data.errorMessage || 'Failed to update LUT status');
            }
        } catch (error) {
            console.error('Error toggling LUT status:', error);
            toast.error('Failed to update LUT status', error.errorMessage);
        }
    };

    // Function to activate a specific LUT (and deactivate others)


    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update LUT" : "Configurator/Create LUT"} />
            <div>
                <Formik
                    initialValues={currentAddLut}
                    enableReinitialize={true}
                    validationSchema={Yup.object({
                        lutNumber: Yup.string().required('LUT Number is required'),
                        fromDate: Yup.date().required('From Date is required'),
                        toDate: Yup.date().required('To Date is required'),
                        isActive: Yup.boolean().default(true)
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                {/* Form Card */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "Update LUT" : "Create LUT"}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col p-6.5">
                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">LUT No <span className='text-red-600 ml-1'>*</span></label>
                                                    <Field
                                                        type="text"
                                                        name="lutNumber"
                                                        placeholder="Enter LUT Number"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="lutNumber" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">From Date <span className='text-red-600 ml-1'>*</span></label>
                                                    <Field
                                                        type="date"
                                                        name="fromDate"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                        onChange={(e) => {
                                                            const fromDate = e.target.value;
                                                            setFieldValue('fromDate', fromDate);
                                                            if (fromDate) {
                                                                const toDate = oneyearadd(fromDate);
                                                                setFieldValue('toDate', toDate);
                                                            }
                                                        }}
                                                    />
                                                    <ErrorMessage name="fromDate" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">To Date <span className='text-red-600 ml-1'>*</span></label>
                                                    <Field
                                                        type="date"
                                                        name="toDate"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="toDate" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>

                                                {/* Active Checkbox for new LUT */}
                                                {/* {!edit && (
                                                    <div className="flex-1 min-w-[250px] flex items-center">
                                                        <div className="mt-6">
                                                            <label className="flex items-center">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="isActive"
                                                                    className="mr-2 h-4 w-4"
                                                                />
                                                                <span className="text-black dark:text-white">
                                                                    Make this LUT active
                                                                </span>
                                                            </label>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Only one LUT can be active at a time
                                                            </p>
                                                        </div>
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-4 items-center">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex md:w-[150px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Saving...' : (edit ? "Update LUT" : "Create LUT")}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* LUT Records Table */}
                                {!edit && Luts.length > 0 && (
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                                    LUT Records
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                                        Total: {Luts.length}
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                        Active: {Luts.filter(lut => lut.isActive).length}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Table Container */}
                                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                S.No
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                LUT Number
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                From Date
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                To Date
                                                            </th>

                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Active/InActive
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                                        {Luts.map((lut, index) => {
                                                            const serialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;
                                                            const currentDate = new Date();
                                                            const toDate = new Date(lut.toDate);
                                                            const isExpired = currentDate > toDate;
                                                            const isActive = lut.isActiveLut && !isExpired;

                                                            return (
                                                                <tr key={lut.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                        {serialNumber}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                        {lut.lutNumber || '-'}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatDisplayDate(lut.fromDate)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatDisplayDate(lut.toDate)}
                                                                    </td>


                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                        <button
                                                                            type='button'
                                                                            onClick={() => toggleLutActive(lut.id, lut)}
                                                                            disabled={isExpired}
                                                                            className={`p-2 rounded-full transition-all ${lut.isActiveLut
                                                                                    ? ' text-green-600 '
                                                                                    : 'text-gray-400'
                                                                                } ${isExpired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                            title={isExpired ? 'Cannot activate expired LUT' : (lut.isActiveLut ? 'Deactivate' : 'Activate')}
                                                                        >
                                                                            <span className='flex gap-2'>
                                                                            {lut.isActiveLut ? <FaToggleOn size={26} /> : <FaToggleOff size={26} />}  <span className={` flex px-3 py-1 rounded-full text-xs font-medium ${isExpired
                                                                                    ? 'bg-red-100 text-red-800'
                                                                                    : isActive
                                                                                        ? 'bg-green-100 text-green-800'
                                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                                }`}>
                                                                                {  (isActive ? 'Active' : 'Inactive')}
                                                                            </span>
                                                                            </span>
                                                                        </button>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                                        <div className="flex space-x-3">
                                                                            <button
                                                                                onClick={(e) => handleUpdate(e, lut)}
                                                                                className="text-blue-600 hover:text-blue-800 transition"
                                                                                title="Edit LUT"
                                                                            >
                                                                                <FiEdit size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => handleDelete(e, lut.id)}
                                                                                className="text-red-600 hover:text-red-800 transition"
                                                                                title="Delete LUT"
                                                                            >
                                                                                <FiTrash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <Pagination
                                                totalPages={pagination.totalPages}
                                                currentPage={pagination.currentPage}
                                                handlePageChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    )
}

export default AddLut;