import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Field, Formik, Form } from 'formik';
import { VIEW_LOYALTY_REPORT, DOWNLOAD_LOYALTY_REPORT } from "../../Constants/utils";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import Pagination from '../Pagination/Pagination';
import { FiDownload } from 'react-icons/fi';

const LoyaltyPointsSystemReport = () => {
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const [report, setReport] = useState([]);

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
    });

    // Fetch loyalty report from backend
    const fetchLoyaltyReport = async (page = 1, filters = {}) => {
        setLoading(true);
        try {
            const response = await fetch(`${VIEW_LOYALTY_REPORT}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                // body: JSON.stringify(filters),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to fetch loyalty report");
            }

            const data = await response.json();
            console.log("Loyalty report data:", data);

            if (data?.content) {
                setReport(data.content);
            } else if (Array.isArray(data)) {
                setReport(data);
            } else {
                setReport([]);
            }

            setPagination({
                totalItems: data?.totalElements || data?.length || 0,
                data: data?.content || data || [],
                totalPages: data?.totalPages || 1,
                currentPage: (data?.number !== undefined ? data.number + 1 : page),
                itemsPerPage: data?.size || data?.length || 10,
            });
        } catch (error) {
            console.error("Error fetching loyalty report:", error);
            toast.error(error.message || "Failed to fetch loyalty report");
            setReport([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchLoyaltyReport(1);
    }, []);

    // Handle pagination change
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        fetchLoyaltyReport(newPage);
    };

    // Download CSV/PDF report
    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const response = await fetch(`${DOWNLOAD_LOYALTY_REPORT}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob();
            const disposition = response.headers.get("Content-Disposition");
            let filename = "loyalty_report.csv";
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) filename = match[1];
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        } finally {
            setDownloading(false);
        }
    };

    // Format currency/number
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "-";
        return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString();
    };

    const renderTableRows = () => {
        if (loading) {
            return (
                <tr className="bg-white dark:bg-slate-700 dark:text-white">
                    <td colSpan="13" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        Loading...
                    </td>
                </tr>
            );
        }

        if (!report || report.length === 0) {
            return (
                <tr className="bg-white dark:bg-slate-700 dark:text-white">
                    <td colSpan="13" className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                        No Loyalty Account Found
                    </td>
                </tr>
            );
        }

        return report.map((row, index) => (
            <tr key={row.id || index} className="bg-white dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600">
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                </td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{row.customerName || "-"}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{row.currentTier || "-"}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.personalizedEarnRatePercent)}%</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.totalPurchase)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.totalReturn)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.lifetimeSpend)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.pointsEarnedTotal)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.pointsRedeemedTotal)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatCurrency(row.pointsExpiredTotal)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap font-semibold">{formatCurrency(row.pointsBalance)}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{row.totalVouchers ?? 0}</td>
                <td className="px-5 py-3 border-b border-gray-200 text-sm whitespace-nowrap">{formatDate(row.firstPurchaseDate)}</td>
            </tr>
        ));
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Loyalty Points System Report" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5 pb-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-semibold leading-tight dark:text-white">
                            Loyalty Points System Report
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success dark:bg-white dark:text-slate-800">
                                TOTAL ACCOUNTS: {pagination.totalItems}
                            </p>
                            <button
                                type="button"
                                onClick={handleDownloadReport}
                                disabled={downloading}
                                className="flex items-center gap-2 rounded-lg bg-primary py-2 px-4 font-medium text-sm text-gray hover:bg-opacity-90 disabled:opacity-60"
                            >
                                <FiDownload size={16} />
                                {downloading ? "Downloading..." : "Download Report"}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto shadow-md rounded-lg">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-slate-900">
                                <tr className="text-left dark:text-white">
                                    <th className="px-5 py-3 font-medium text-sm">#</th>
                                    <th className="px-5 py-3 font-medium text-sm">Customer Name</th>
                                    <th className="px-5 py-3 font-medium text-sm">Current Tier</th>
                                    <th className="px-5 py-3 font-medium text-sm">Earn Rate (%)</th>
                                    <th className="px-5 py-3 font-medium text-sm">Total Purchase</th>
                                    <th className="px-5 py-3 font-medium text-sm">Total Return</th>
                                    <th className="px-5 py-3 font-medium text-sm">Lifetime Spend</th>
                                    <th className="px-5 py-3 font-medium text-sm">Points Earned</th>
                                    <th className="px-5 py-3 font-medium text-sm">Points Redeemed</th>
                                    <th className="px-5 py-3 font-medium text-sm">Points Expired</th>
                                    <th className="px-5 py-3 font-medium text-sm">Points Balance</th>
                                    <th className="px-5 py-3 font-medium text-sm">Total Vouchers</th>
                                    <th className="px-5 py-3 font-medium text-sm">First Purchase Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default LoyaltyPointsSystemReport;