import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layout/DefaultLayout'
import Breadcrumb from '../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import { DELETE_ORDER_URL, DOWNLOADCSV_REPORT, DOWNLOAD_REPORT, VIEW_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useReports from '../../hooks/useReports';

const Reports = () => {
    const { productGroup, Supplier, orderType, getSupplier,
        getOrderNo,
        getProdId, orderNo,
        prodId, getCustomer, Customer, getorderType } = useReports();

    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const [report, setreport] = useState([]);
    const { token } = currentUser;
    const navigate = useNavigate();

    const [Order, setOrder] = useState([]);
    const [currentFilters, setCurrentFilters] = useState({}); // ✅ Store current filters
    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });

    useEffect(() => {
        getSupplier();
        getOrderNo();
        getProdId();
        getCustomer();
        getorderType();
    }, []);

    console.log(report, "4521");

    const formattedProductGroup = productGroup?.map(prod => ({
        label: prod.productGroupName,
        value: prod.productGroupName
    }));

    const formattedOrderType = orderType?.map(type => ({
        label: type.orderTypeName,
        value: type.orderTypeName
    }));

    const formattedCustomer = Customer?.map(cust => ({
        label: cust.customerName,
        value: cust.customerName
    }));

    const orderStatus = [
        { label: "Pending", value: "Pending" },
        { label: "Closed", value: "Closed" },
        { label: "Partially_Pending", value: "Partially_Pending" },
        { label: "Partially_Closed", value: "Partially_Closed" },
        { label: "Forced_Closure", value: "Forced_Closure" },
        { label: "approved", value: "approved" },
        { label: "Partially_Approved", value: "Partially_Approved" },
        { label: "created", value: "created" },
        { label: "accepted", value: "accepted" },
        { label: "Partially_Accepted", value: "Partially_Accepted" },
        { label: "rejected", value: "rejected" },
    ];

    const formattedSupplier = Supplier?.map(sup => ({
        label: sup.name,
        value: sup.id
    }));

    const formattedProdId = prodId?.map(id => ({
        label: id,
        value: id
    })) || [];

    const formattedOrderNo = orderNo?.map(no => ({
        label: no,
        value: no
    })) || [];

    // ✅ FIXED: Render table rows with proper data access
    const renderTableRows = () => {
        if (!report || !report.length) {
            return (
                <tr className='bg-white dark:bg-slate-700 dark:text-white'>
                    <td colSpan="8" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        <p className="text-gray-900 dark:text-gray-300">No Orders Found</p>
                    </td>
                </tr>
            );
        }

        const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

        return report.map((item, index) => {
            // ✅ Safely access nested data
            const productData = item?.products || {};
            const productId = productData?.productId || item?.productId || 'N/A';
            const customerName = item?.customerName || item?.customer?.customerName || 'N/A';
            const orderNoValue = item?.orderNo || 'N/A';
            const receivedQuantity = item?.receivedQuantity || 0;
            const orderQuantity = item?.orderQuantity || item?.quantity || 0;
            const productStatus = item?.productStatus || item?.status || 'N/A';
            
            // ✅ Safely get suppliers
            const suppliers = item?.productSuppliers || [];
            
            return (
                <tr key={item.id || index} className='bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors'>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{startingSerialNumber + index}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap font-medium">{orderNoValue}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{customerName}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{productId}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{orderQuantity}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{receivedQuantity}</p>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            productStatus === 'LATE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            productStatus === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            productStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                            {productStatus}
                        </span>
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm">
                        {suppliers.length > 0 ? (
                            suppliers.map((supp, idx) => (
                                <p key={idx} className="text-gray-900 dark:text-white whitespace-nowrap">
                                    {supp?.supplierName || supp?.name || 'N/A'}
                                </p>
                            ))
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-xs">No supplier</span>
                        )}
                    </td>
                </tr>
            );
        });
    };

    // ✅ FIXED: Get report with filters - now stores filters in state
    const getReport = async (page, filters = {}) => {
        setLoading(true);
        try {
            // ✅ Store filters for pagination
            if (page === 1 || Object.keys(filters).length > 0) {
                setCurrentFilters(filters);
            }

            const apiPage = (page || 1);
            const url = `${VIEW_REPORT}?page=${apiPage}`;
            
            // ✅ Use stored filters if no filters provided (for pagination)
            const requestFilters = Object.keys(filters).length > 0 ? filters : currentFilters;
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestFilters)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                toast.error(`Server error: ${response.status}`);
                setreport([]);
                setPagination({
                    totalItems: 0,
                    data: [],
                    totalPages: 0,
                    currentPage: 1,
                    itemsPerPage: 10,
                });
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("✅ Parsed Data:", data);

            // ✅ Check if data has content
            if (data && data.content && Array.isArray(data.content)) {
                setreport(data.content);
                setPagination({
                    totalItems: data.totalElements || 0,
                    data: data.content || [],
                    totalPages: data.totalPages || 0,
                    currentPage: (data.number || 0) + 1,
                    itemsPerPage: data.size || 10,
                });
            } else {
                console.warn("No content in response:", data);
                setreport([]);
                setPagination({
                    totalItems: 0,
                    data: [],
                    totalPages: 0,
                    currentPage: 1,
                    itemsPerPage: 10,
                });
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch orders. Please try again.");
            setreport([]);
            setPagination({
                totalItems: 0,
                data: [],
                totalPages: 0,
                currentPage: 1,
                itemsPerPage: 10,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReport(1, {});
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
            // ✅ Pass empty filters - will use stored filters from state
            getReport(newPage, currentFilters);
        }
    };

    const handleSubmit = (values) => {
        const filters = {
            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo,
            customerName: values.customerName,
            supplierId: values.supplierName,
            productId: values.ProductId,
            fromDate: values.fromDate,
            orderStatus: values.orderStatus,
            toDate: values.toDate,
        };
        // ✅ Store filters and fetch page 1
        setCurrentFilters(filters);
        getReport(1, filters);
    };

    const handlegenerateReport = async (values) => {
        const filters = {
            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo,
            customerName: values.customerName,
            supplierId: values.supplierName,
            productId: values.ProductId,
            fromDate: values.fromDate,
            orderStatus: values.orderStatus,
            toDate: values.toDate,
        };

        try {
            const response = await fetch(DOWNLOAD_REPORT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                throw new Error("Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "report.xlsx");
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

    const handlegenerateCsv = async (values) => {
        const filters = {
            orderType: values.orderTypeName,
            group: values.productGroup,
            orderNo: values.orderNo,
            customerName: values.customerName,
            supplierId: values.supplierName,
            productId: values.ProductId,
            fromDate: values.fromDate,
            orderStatus: values.orderStatus,
            toDate: values.toDate,
        };

        try {
            const response = await fetch(DOWNLOADCSV_REPORT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters),
            });

            if (!response.ok) {
                throw new Error("Failed to download CSV");
            }

            const blob = await response.blob();
            const disposition = response.headers.get("Content-Disposition");
            let filename = "report.csv";
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("CSV downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the CSV");
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order / Reports" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                            <span>Order Reports</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                COUNT: {pagination.totalItems}
                            </span>
                        </h2>
                    </div>

                    <div className='items-center justify-center'>
                        <Formik
                            initialValues={{
                                orderTypeName: '',
                                productGroup: "",
                                orderNo: '',
                                ProductId: "",
                                supplierName: "",
                                customerName: "",
                                fromDate: '',
                                orderStatus: "",
                                toDate: ''
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order Type</label>
                                            <ReactSelect
                                                name="orderType"
                                                onChange={(option) => setFieldValue('orderTypeName', option?.value || null)}
                                                options={[{ label: 'View All', value: null }, ...formattedOrderType]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Group</label>
                                            <ReactSelect
                                                name="productGroup"
                                                onChange={(option) => setFieldValue('productGroup', option?.value || null)}
                                                options={[{ label: 'Select', value: null }, ...formattedProductGroup]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder="Select Product Group"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                                            <ReactSelect
                                                name="orderNo"
                                                onChange={(option) => setFieldValue('orderNo', option?.value || null)}
                                                options={[{ label: 'Select', value: null }, ...formattedOrderNo]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Supplier</label>
                                            <ReactSelect
                                                name="supplierName"
                                                onChange={(option) => setFieldValue('supplierName', option?.value || null)}
                                                options={formattedSupplier.length > 0 ? [{ label: 'Select', value: null }, ...formattedSupplier] : []}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-Field"
                                                classNamePrefix="react-select"
                                                placeholder={formattedSupplier.length === 0 ? "Loading suppliers..." : "Select Supplier"}
                                                isDisabled={formattedSupplier.length === 0}
                                                isLoading={formattedSupplier.length === 0}
                                                loadingMessage={() => "Loading suppliers..."}
                                                noOptionsMessage={() => "No suppliers available"}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                                            <ReactSelect
                                                name="ProductId"
                                                onChange={(option) => setFieldValue('ProductId', option?.value || null)}
                                                options={[{ label: 'Select', value: null }, ...formattedProdId]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                                            <ReactSelect
                                                name="customerName"
                                                onChange={(option) => setFieldValue('customerName', option?.value || null)}
                                                options={[{ label: 'Select', value: null }, ...formattedCustomer]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">From Date</label>
                                            <Field
                                                name='fromDate'
                                                type="date"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">To Date</label>
                                            <Field
                                                name='toDate'
                                                type="date"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white">Order Status</label>
                                            <ReactSelect
                                                name="orderStatus"
                                                onChange={(option) => setFieldValue('orderStatus', option?.value || null)}
                                                options={[{ label: 'Select', value: null }, ...orderStatus]}
                                                styles={customStyles}
                                                className="bg-white dark:bg-form-input"
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Search
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlegenerateReport(values)}
                                            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-green-700 transition-colors"
                                        >
                                            Generate XLSX FILE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlegenerateCsv(values)}
                                            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-purple-700 transition-colors"
                                        >
                                            Generate CSV
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">S.No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Order No</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ordered Qty</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Received Qty</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:bg-slate-700 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-8">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        renderTableRows()
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pagination.totalPages > 1 && (
                            <Pagination 
                                totalPages={pagination.totalPages} 
                                currentPage={pagination.currentPage} 
                                handlePageChange={handlePageChange} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Reports;