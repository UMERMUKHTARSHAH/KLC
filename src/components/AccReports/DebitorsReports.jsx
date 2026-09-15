import React, { useEffect, useRef, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import {
    DELETE_ORDER_URL,
    DOWNLOADACCCSVDebi_REPORT,
    DOWNLOADACCCSV_REPORT,
    DOWNLOADCSV_REPORT,
    DOWNLOAD_REPORT,
    VIEW_ALL_ORDERS,
    VIEW_CREATED_ORDERS,
    VIEW_REPORT
} from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';
import { FaDownload } from 'react-icons/fa6';

const PAGE_SIZE = 20; // Must match backend default

const DebitorsReports = () => {
    const [loading, setLoading] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [currentPageData, setCurrentPageData] = useState([]);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: PAGE_SIZE,
    });

    // Keep filters in a ref so handlePageChange always sees the latest values
    const currentFiltersRef = useRef({ fromDate: '', toDate: '' });

    // ---------------------------------------------------------------
    // Fetch a specific page from the API
    // ---------------------------------------------------------------
    const fetchPageData = async (page, filters) => {
        console.log("📤 Fetching page:", page, "filters:", filters);

        if (!filters.fromDate || !filters.toDate) {
            console.warn("⚠️ Missing dates, aborting fetch");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${DOWNLOADACCCSVDebi_REPORT}/preview?page=${page - 1}`,  // backend is 0-indexed
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        fromDate: filters.fromDate,
                        toDate: filters.toDate,
                          // backend is 0-indexed
                        size: PAGE_SIZE
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch page data");
            }

            const data = await response.json();
            console.log("📥 Response meta:", {
                number: data.number,
                size: data.size,
                totalPages: data.totalPages,
                totalElements: data.totalElements,
                first: data.first,
                last: data.last
            });

            setCurrentPageData(data.content || []);

            setPagination({
                totalItems: data?.totalElements || 0,
                data: data?.content || [],
                totalPages: data?.totalPages || 0,
                currentPage: (data?.number || 0) + 1,
                itemsPerPage: PAGE_SIZE,   // keep constant
            });

        } catch (error) {
            console.error(error);
            toast.error("Failed to load page data");
            setCurrentPageData([]);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------
    // View button handler (first fetch)
    // ---------------------------------------------------------------
    const handleViewReport = async (values) => {
        if (!values.fromDate || !values.toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }

        const filters = {
            fromDate: values.fromDate,
            toDate: values.toDate
        };

        // Save to ref AND state
        currentFiltersRef.current = filters;

        await fetchPageData(1, filters);
        setIsDataFetched(true);
    };

    // ---------------------------------------------------------------
    // CSV download handler
    // ---------------------------------------------------------------
    const handlegenerateCsv = async (values) => {
        if (!values.fromDate || !values.toDate) {
            toast.warning("Please select both From Date and To Date");
            return;
        }

        const filters = {
            fromDate: values.fromDate,
            toDate: values.toDate,
        };

        try {
            const response = await fetch(`${DOWNLOADACCCSVDebi_REPORT}/download`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Debitors_report_${values.fromDate}_to_${values.toDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };

    // ---------------------------------------------------------------
    // Pagination handler — reads from ref, always fresh
    // ---------------------------------------------------------------
    const handlePageChange = async (page) => {
        console.log("🖱️ Page clicked:", page, "current:", pagination.currentPage, "filters:", currentFiltersRef.current);

        if (page === pagination.currentPage) return;              // no-op
        if (page < 1 || page > pagination.totalPages) return;     // bounds

        await fetchPageData(page, currentFiltersRef.current);
    };

    // ---------------------------------------------------------------
    // Table rows
    // ---------------------------------------------------------------
    const renderTableRows = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="7" className="px-5 py-10 text-center">
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!isDataFetched) {
            return (
                <tr>
                    <td colSpan="7" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Select dates and click "View" to load report</p>
                    </td>
                </tr>
            );
        }

        if (!currentPageData.length) {
            return (
                <tr>
                    <td colSpan="7" className="px-5 py-10 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No data found for the selected date range</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber =
            (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return currentPageData.map((item, index) => (
            <tr
                key={item.ledgerId || index}
                className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {startingSerialNumber + index}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white">
                    {item.ledgerName || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {item.previousOpeningBalance || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {Number(item.debitTransaction || 0)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-right text-gray-700 dark:text-gray-300">
                    {Number(item.creditTransaction || 0)}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.openingBalance || '-'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : '-'}
                </td>
            </tr>
        ));
    };

    // ---------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------
    return (
        <DefaultLayout>
            <Breadcrumb pageName="/Report/DebitorsReports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                            Debitors Report
                        </h2>
                        {isDataFetched && (
                            <p className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary">
                                TOTAL RECORDS: {pagination.totalItems}
                            </p>
                        )}
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                fromDate: '',
                                toDate: '',
                                groupName: "Sundry Debitors"
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                From Date
                                            </label>
                                            <Field
                                                name='fromDate'
                                                type="date"
                                                placeholder="Enter From Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                To Date
                                            </label>
                                            <Field
                                                name='toDate'
                                                type="date"
                                                placeholder="Enter To Date"
                                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleViewReport(values)}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[180px] w-[200px] md:h-[45px] h-[45px] rounded-lg bg-primary text-white font-medium hover:bg-opacity-90 transition-all"
                                        >
                                            <FiEye size={18} />
                                            View Report
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values)}
                                            className="flex items-center justify-center gap-2 mb-4 md:w-[200px] w-[220px] md:h-[45px] h-[45px] rounded-lg bg-success text-white font-medium hover:bg-opacity-90 transition-all"
                                        >
                                            <FaDownload size={18} />
                                            Generate Report
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Table Section */}
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Opening Balance</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Debit</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Credit</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Closing Balance</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Age Of Debt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {isDataFetched && pagination.totalItems > 0 && (
                            <div className="mt-4">
                                <Pagination
                                    totalPages={pagination.totalPages}
                                    currentPage={pagination.currentPage}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default DebitorsReports