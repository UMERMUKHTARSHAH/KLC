import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form, ErrorMessage } from 'formik'
//  import Flatpickr from 'react-flatpickr';
import { DELETE_ORDER_URL, DOWNLOADCSV_REPORT, DOWNLOADINPROGRESSBYDATECSV_REPORT, DOWNLOADINPROGRESSBYDATE_REPORT, DOWNLOADPENDINGORDERCSV_REPORT, DOWNLOADPENDINGPDFBYDATE_REPORT, DOWNLOAD_REPORT, VIEW_ALL_ORDERS, VIEW_CREATED_ORDERS, VIEW_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';




const productgrp = [
    { value: 'BrandA', label: 'Brand A' },
    { value: 'BrandB', label: 'Brand B' },
    { value: 'BrandC', label: 'Brand C' },
];


const FinanceReportByDate = () => {



    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
    const [report, setreport] = useState()

    const { token } = currentUser;

    // console.log(productIdd,"huhuuhuuuuuuuuuuuuuuuuu");




    // const supplier = useSelector(state => state?.nonPersisted?.supplier);












    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
    });




    const renderTableRows = () => {
        console.log(report);
        if (!report || !report.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
                        <p className="text-gray-900 whitespace-no-wrap text-center">No Order Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;











    };




    const handlegeneratepdf = async (values,urlll,name) => {

        if (!values.fromDate || !values.toDate) {
            toast.error("Please specify both From and To dates");
            return;
        }
        const filters = {

            fromDate: values.fromDate,
            toDate: values.toDate,
        };

        console.log(filters, "lala");

        try {
            const response = await fetch(`${urlll}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters), // Convert body to JSON string
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob(); // Get the binary CSV file

            // Extract the filename from the Content-Disposition header
            const disposition = response.headers.get("Content-Disposition");
            let filename = "report.csv"; // Default filename
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name); // Use the filename from the header

            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };



    const handlegenerateCsv = async (values, urll,namee) => {
        // Validate that both fromDate and toDate are provided
        if (!values.fromDate || !values.toDate) {
            toast.error("Please specify both From and To dates");
            return;
        }
    
        // Prepare filters to send to the backend
        const filters = {
            fromDate: values.fromDate,
            toDate: values.toDate,
        };
    
        try {
            // Make the request to the backend for CSV report
            const response = await fetch(urll, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters), // Send filters in the request body
            });
    
            // Check if the response is successful
            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }
    
            // Try to extract the Content-Disposition header from the response
            const disposition = response.headers.get("Content-Disposition");
    
            console.log("Content-Disposition header:", disposition);
    
            // Fallback if filename extraction failed
            let filename = "report.csv"; // Default filename if header is missing
    
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1]; // Extracted filename from header
                }
            }
    
            // Get the binary content (CSV file)
            const blob = await response.blob();
    
            // Create an object URL for the blob (CSV file)
            const objectUrl = window.URL.createObjectURL(blob);
    
            // Create an anchor element to trigger the download
            const link = document.createElement("a");
            link.href = objectUrl;
            link.setAttribute("download", namee); // Use the extracted filename
    
            // Append the link to the document and trigger the click event to start the download
            document.body.appendChild(link);
            link.click();
    
            // Clean up by removing the link and revoking the object URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
    
            // Show a success message
            toast.success("Report downloaded successfully");
    
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };
    
    
    













    return (
        <DefaultLayout>
            <Breadcrumb pageName="/Report/RetailWholeSaleReport" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between'>
                        <h2 className="text-xl font-semibold leading-tight">Financial Report</h2>
                        {/* <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800`}>
                            TOTAL PRODUCTS: {pagination.totalItems}
                        </p> */}
                    </div>


                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{

                                fromDate: '',
                                toDate: ''



                            }}
                            validate={values => {
                                const errors = {};
        
                                if (!values.fromDate || values.fromDate === " ") {
                                    errors.fromDate = 'Please Specify Date';
                                }
                                if (!values.toDate || values.toDate === " ") {
                                    errors.toDate = 'Please Specify Date';
                                }
        
                                return errors;
                            }}

                        >
                            {({ setFieldValue, values, handleBlur }) => (
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
                                             <ErrorMessage name="fromDate" component="div" className="text-red-500" />
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
                                             <ErrorMessage name="toDate" component="div" className="text-red-500" />
                                        </div>
                                    </div>

                                    <div className="flex flex-row ">




                                        <button
                                            type="button"
                                            onClick={() => handlegeneratepdf(values,DOWNLOADINPROGRESSBYDATE_REPORT,"InProgressOrders")}
                                            className=" mr-3 mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            In Progress Orders Financial Report
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlegeneratepdf(values,DOWNLOADPENDINGPDFBYDATE_REPORT,"PendingOrders")}
                                            className="flex mr-3 mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Pending Orders Financial Report
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlegeneratepdf(values)}
                                            className="flex mr-3  mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Extra Qty Financial Report
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() => handlegeneratepdf(values)}
                                            className=" mr-3 mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Received Qty Financial Report
                                        </button>






                                    </div>

                                    <div className="flex flex-row ">


                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values,DOWNLOADINPROGRESSBYDATECSV_REPORT,"InProgressOrdersCsv")}
                                            className="flex mr-3 mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            In Progress Orders Report(csv)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values,DOWNLOADPENDINGORDERCSV_REPORT,"pendingOrdersReportCsv")}
                                            className="flex mr-3  mb-4 md:w-[260px] w-[220px] md:h-[50px] h-[40px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                        >
                                            Pending Orders Report(csv)
                                        </button>





                                 
                                    </div>

                                </Form>
                            )}
                        </Formik>
                    </div>






                </div>

            </div>

        </DefaultLayout>
    )
}

export default FinanceReportByDate 
