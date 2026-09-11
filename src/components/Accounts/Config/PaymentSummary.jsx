import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import Breadcrumb from '../../Breadcrumbs/Breadcrumb'
import { Field, Formik, Form } from 'formik'
import ReactSelect from 'react-select';
import { FiEdit, FiTrash2, FiCreditCard, FiDollarSign, FiTrendingUp, FiTrendingDown, FiX } from 'react-icons/fi';
import { RiBankFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaUsers, FaHandHoldingUsd } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SEARCH_PAYMENTSUMMARY_URL, customStyles as createCustomStyles } from '../../../Constants/utils';

const PaymentSummary = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);
    const { token } = currentUser;

    const initialSummary = {
        bankAvailable: 0,
        cashAvailable: 0,
        supplierPayable: 0,
        supplierAdvance: 0,
        customerReceivable: 0,
        customerAdvance: 0,
        bankDetails: { debit: 0, credit: 0, net: 0, debitEntries: [], creditEntries: [] },
        cashDetails: { debit: 0, credit: 0, net: 0, debitEntries: [], creditEntries: [] },
        supplierDetails: { debit: 0, credit: 0, net: 0, payable: 0, advance: 0, debitEntries: [], creditEntries: [] },
        customerDetails: { debit: 0, credit: 0, net: 0, receivable: 0, advance: 0, debitEntries: [], creditEntries: [] },
        totalDebit: 0,
        totalCredit: 0,
        netBalance: 0,
        totalAvailableFunds: 0,
        rawData: null,
    };

    const [summaryData, setSummaryData] = useState(initialSummary);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        entries: [],
        type: '',
        totalAmount: 0,
        nature: '' // 'payable' | 'advance' | 'receivable' | 'customerAdvance' | ''
    });

    const navigate = useNavigate();

    const getPaymentSummary = async (filters = {}) => {
        try {
            const response = await fetch(`${SEARCH_PAYMENTSUMMARY_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(filters)
            });

            const data = await response.json();

            if (data) {
                const processedData = processSummaryData(data);
                setSummaryData({
                    ...processedData,
                    rawData: data
                });
            } else {
                setSummaryData(initialSummary);
            }
        } catch (error) {
            console.error("Error fetching Payment Summary:", error);
            toast.error("Failed to fetch Payment Summary");
            setSummaryData(initialSummary);
        }
    };

    const processSummaryData = (data) => {
        // ---------- RAW TOTALS ----------
        const bankDebitTotal  = parseFloat(data?.bankTotalDebitBalance || 0);
        const bankCreditTotal = parseFloat(data?.bankTotalCreditBalance || 0);
        const bankOpening     = parseFloat(data?.bankTotalOpeningBalance || 0);

        const cashDebitTotal  = parseFloat(data?.cashTotalDebitBalance || 0);
        const cashCreditTotal = parseFloat(data?.cashTotalCreditBalance || 0);
        const cashOpening     = parseFloat(data?.cashTotalOpeningBalance || 0);

        const supplierDebitTotal  = parseFloat(data?.supplierTotalDebitBalance || 0);
        const supplierCreditTotal = parseFloat(data?.supplierTotalCreditBalance || 0);

        const customerDebitTotal  = parseFloat(data?.customerTotalDebitBalance || 0);
        const customerCreditTotal = parseFloat(data?.customerTotalCreditBalance || 0);

        // ---------- NET BALANCES ----------
        // Bank & Cash: Opening balance = closing balance you actually have
        const bankNet = bankOpening;
        const cashNet = cashOpening;

        // Supplier: Credit = you owe them. Positive → Payable (Cr). Negative → Advance (Dr)
        const supplierNet = supplierCreditTotal - supplierDebitTotal;

        // Customer: Debit = they owe you. Positive → Receivable (Dr). Negative → Advance (Cr)
        const customerNet = customerDebitTotal - customerCreditTotal;

        // ---------- OVERALL ----------
        const totalDebit  = bankDebitTotal + cashDebitTotal + supplierDebitTotal + customerDebitTotal;
        const totalCredit = bankCreditTotal + cashCreditTotal + supplierCreditTotal + customerCreditTotal;
        const netBalance  = totalDebit - totalCredit;

        return {
            // Availability (positive only)
            bankAvailable: bankNet > 0 ? bankNet : 0,
            cashAvailable: cashNet > 0 ? cashNet : 0,

            // Supplier — split payable vs advance
            supplierPayable: supplierNet > 0 ? supplierNet : 0,
            supplierAdvance: supplierNet < 0 ? Math.abs(supplierNet) : 0,

            // Customer — split receivable vs advance
            customerReceivable: customerNet > 0 ? customerNet : 0,
            customerAdvance:    customerNet < 0 ? Math.abs(customerNet) : 0,

            // Raw details for modals
            bankDetails: {
                debit: bankDebitTotal,
                credit: bankCreditTotal,
                net: bankNet,
                debitEntries:  data?.bankDebitEntries  || [],
                creditEntries: data?.bankCreditEntries || [],
            },
            cashDetails: {
                debit: cashDebitTotal,
                credit: cashCreditTotal,
                net: cashNet,
                debitEntries:  data?.cashDebitEntries  || [],
                creditEntries: data?.cashCreditEntries || [],
            },
            supplierDetails: {
                debit: supplierDebitTotal,
                credit: supplierCreditTotal,
                net: supplierNet,
                payable: supplierNet > 0 ? supplierNet : 0,
                advance: supplierNet < 0 ? Math.abs(supplierNet) : 0,
                debitEntries:  data?.supplierDebitEntries  || [],
                creditEntries: data?.supplierCreditEntries || [],
            },
            customerDetails: {
                debit: customerDebitTotal,
                credit: customerCreditTotal,
                net: customerNet,
                receivable: customerNet > 0 ? customerNet : 0,
                advance: customerNet < 0 ? Math.abs(customerNet) : 0,
                debitEntries:  data?.customerDebitEntries  || [],
                creditEntries: data?.customerCreditEntries || [],
            },

            totalDebit,
            totalCredit,
            netBalance,
            totalAvailableFunds: bankNet + cashNet,
            rawData: data,
        };
    };

    useEffect(() => {
        getPaymentSummary();
    }, [])

    const handleSubmit = (values) => {
        const filters = {
            fromDate: values.fromDate || undefined,
            toDate: values.toDate || undefined,
        };
        getPaymentSummary(filters);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    // Open modal with specific data
    const openModal = (title, entries, totalAmount, type, nature = '') => {
        setModalData({
            title,
            entries: entries || [],
            type,
            totalAmount,
            nature
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalData({
            title: '',
            entries: [],
            type: '',
            totalAmount: 0,
            nature: ''
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pick entries for modal based on card type and its nature
    const getEntriesForModal = (type, nature) => {
        const raw = summaryData.rawData;
        if (!raw) return [];

        switch (type) {
            case 'bank':
                return raw.bankDebitEntries || [];
            case 'cash':
                return raw.cashDebitEntries || [];
            case 'supplier':
                // If payable → show credit entries (what you owe)
                // If advance → show debit entries (what you overpaid)
                return nature === 'advance'
                    ? (raw.supplierDebitEntries || [])
                    : (raw.supplierCreditEntries || []);
            case 'customer':
                // If receivable → show debit entries (what they owe)
                // If advance → show credit entries (what they prepaid)
                return nature === 'customerAdvance'
                    ? (raw.customerCreditEntries || [])
                    : (raw.customerDebitEntries || []);
            default:
                return [];
        }
    };

    // ---------- Summary Cards ----------
    const summaryCards = [
        {
            title: "Bank Balance",
            amount: summaryData.bankAvailable,
            icon: <RiBankFill className="text-blue-500 text-2xl" />,
            color: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
            textColor: "text-blue-700 dark:text-blue-300",
            borderColor: "border-blue-200 dark:border-blue-700",
            description: "Total money in bank accounts",
            modalType: "bank",
            nature: ""
        },
        {
            title: "Cash in Hand",
            amount: summaryData.cashAvailable,
            icon: <RiMoneyDollarCircleFill className="text-green-500 text-2xl" />,
            color: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
            textColor: "text-green-700 dark:text-green-300",
            borderColor: "border-green-200 dark:border-green-700",
            description: "Physical cash available",
            modalType: "cash",
            nature: ""
        },
        {
            title: summaryData.supplierAdvance > 0 ? "Advance Paid to Suppliers" : "Payable to Suppliers",
            amount: summaryData.supplierAdvance > 0 ? summaryData.supplierAdvance : summaryData.supplierPayable,
            // Show the "other side" as sub-line when meaningful
            subAmount: summaryData.supplierAdvance > 0 ? summaryData.supplierPayable : summaryData.supplierAdvance,
            subLabel: summaryData.supplierAdvance > 0
                ? `Payable: ${formatCurrency(summaryData.supplierPayable)}`
                : (summaryData.supplierAdvance > 0
                    ? `Advance paid: ${formatCurrency(summaryData.supplierAdvance)}`
                    : null),
            icon: <FaUsers className={summaryData.supplierAdvance > 0 ? "text-amber-500 text-2xl" : "text-red-500 text-2xl"} />,
            color: summaryData.supplierAdvance > 0
                ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30"
                : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30",
            textColor: summaryData.supplierAdvance > 0
                ? "text-amber-700 dark:text-amber-300"
                : "text-red-700 dark:text-red-300",
            borderColor: summaryData.supplierAdvance > 0
                ? "border-amber-200 dark:border-amber-700"
                : "border-red-200 dark:border-red-700",
            description: summaryData.supplierAdvance > 0
                ? "You have overpaid your suppliers"
                : "Total amount owed to suppliers",
            modalType: "supplier",
            nature: summaryData.supplierAdvance > 0 ? "advance" : "payable"
        },
        {
            title: summaryData.customerAdvance > 0 ? "Advance from Customers" : "Receivable from Customers",
            amount: summaryData.customerAdvance > 0 ? summaryData.customerAdvance : summaryData.customerReceivable,
            subAmount: summaryData.customerAdvance > 0 ? summaryData.customerReceivable : summaryData.customerAdvance,
            subLabel: summaryData.customerAdvance > 0
                ? `Receivable: ${formatCurrency(summaryData.customerReceivable)}`
                : (summaryData.customerAdvance > 0
                    ? `Customer advance: ${formatCurrency(summaryData.customerAdvance)}`
                    : null),
            icon: <FaHandHoldingUsd className={summaryData.customerAdvance > 0 ? "text-teal-500 text-2xl" : "text-purple-500 text-2xl"} />,
            color: summaryData.customerAdvance > 0
                ? "bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30"
                : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
            textColor: summaryData.customerAdvance > 0
                ? "text-teal-700 dark:text-teal-300"
                : "text-purple-700 dark:text-purple-300",
            borderColor: summaryData.customerAdvance > 0
                ? "border-teal-200 dark:border-teal-700"
                : "border-purple-200 dark:border-purple-700",
            description: summaryData.customerAdvance > 0
                ? "Customers have prepaid you"
                : "Total amount customers owe",
            modalType: "customer",
            nature: summaryData.customerAdvance > 0 ? "customerAdvance" : "receivable"
        }
    ];

    const overviewCards = [
        {
            title: "Total Debits",
            amount: summaryData.totalDebit,
            icon: <FiTrendingUp className="text-emerald-500 text-2xl" />,
            color: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30",
            textColor: "text-emerald-700 dark:text-emerald-300",
            borderColor: "border-emerald-200 dark:border-emerald-700",
            description: "All money inflows"
        },
        {
            title: "Total Credits",
            amount: summaryData.totalCredit,
            icon: <FiTrendingDown className="text-rose-500 text-2xl" />,
            color: "bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30",
            textColor: "text-rose-700 dark:text-rose-300",
            borderColor: "border-rose-200 dark:border-rose-700",
            description: "All money outflows"
        },
        {
            title: "Net Balance",
            amount: summaryData.netBalance,
            icon: <FiDollarSign className={`text-2xl ${summaryData.netBalance >= 0 ? 'text-teal-500' : 'text-amber-500'}`} />,
            color: summaryData.netBalance >= 0
                ? "bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30"
                : "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
            textColor: summaryData.netBalance >= 0
                ? "text-teal-700 dark:text-teal-300"
                : "text-amber-700 dark:text-amber-300",
            borderColor: summaryData.netBalance >= 0
                ? "border-teal-200 dark:border-teal-700"
                : "border-amber-200 dark:border-amber-700",
            description: summaryData.netBalance >= 0 ? "Positive cash flow" : "Negative cash flow"
        }
    ];

    // Entries for the currently open modal
    const modalEntries = getEntriesForModal(modalData.type, modalData.nature);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Finance / Payment Summary" />
            <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
                <div className="pt-5">
                    <div className='flex justify-between mb-6'>
                        <h2 className="text-2xl font-bold leading-tight dark:text-white">Payment Summary Dashboard</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Date Filter Form */}
                    <div className="mb-8">
                        <Formik
                            initialValues={{ fromDate: '', toDate: '' }}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Filter by Date Range</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                                                <Field
                                                    name="fromDate"
                                                    type="datetime-local"
                                                    className="form-datepicker w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-3 px-4 text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                                                <Field
                                                    name="toDate"
                                                    type="datetime-local"
                                                    className="form-datepicker w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-3 px-4 text-slate-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="submit"
                                                    className="w-full h-[46px] rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    Apply Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Summary Cards - Clickable */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">💰 Available Funds</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {summaryCards.map((card, index) => (
                                <div
                                    key={index}
                                    onClick={() => openModal(
                                        card.title,
                                        getEntriesForModal(card.modalType, card.nature),
                                        card.amount,
                                        card.modalType,
                                        card.nature
                                    )}
                                    className={`${card.color} rounded-2xl border ${card.borderColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{card.description}</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md">
                                            {card.icon}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className={`text-xl font-bold ${card.textColor}`}>
                                            {formatCurrency(card.amount)}
                                        </p>
                                        {card.subLabel && (
                                            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                                                {card.subLabel}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overview Cards */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">📊 Financial Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {overviewCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`${card.color} rounded-2xl border ${card.borderColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{card.description}</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md">
                                            {card.icon}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className={`text-3xl font-bold ${card.textColor}`}>
                                            {formatCurrency(card.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Health Indicator */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">🏦 Financial Health</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Liquidity Ratio</span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            {((summaryData.bankAvailable + summaryData.cashAvailable) / (summaryData.supplierPayable || 1)).toFixed(2)}:1
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${Math.min(100, ((summaryData.bankAvailable + summaryData.cashAvailable) / (summaryData.supplierPayable || 1)) * 10)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Position</span>
                                        <span className={`text-sm font-bold ${summaryData.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {summaryData.netBalance >= 0 ? 'Positive' : 'Negative'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${summaryData.netBalance >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                                            style={{ width: `${Math.min(100, Math.abs(summaryData.netBalance) / (Math.max(summaryData.totalDebit, summaryData.totalCredit) + 1) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        {summaryData.netBalance >= 0 ? 'Healthy cash position' : 'Monitor cash flow closely'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                                    <RiBankFill className="text-blue-600 dark:text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Bank Balance</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(summaryData.bankAvailable)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg mr-4 ${summaryData.supplierAdvance > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    <FaUsers className={`text-xl ${summaryData.supplierAdvance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {summaryData.supplierAdvance > 0 ? 'Advance Paid' : 'Total Payables'}
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(summaryData.supplierAdvance > 0 ? summaryData.supplierAdvance : summaryData.supplierPayable)}
                                    </p>
                                    {summaryData.supplierAdvance > 0 && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Payable: {formatCurrency(summaryData.supplierPayable)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                                    <RiMoneyDollarCircleFill className="text-green-600 dark:text-green-400 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Money Available</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {formatCurrency(summaryData.cashAvailable + summaryData.bankAvailable)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            {modalOpen && (
                <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-90" onClick={closeModal}></div>

                        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-slate-800 rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {modalData.title} Details
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {/* Show what the number actually means */}
                                        {modalData.type === 'supplier' && (
                                            modalData.nature === 'advance'
                                                ? <>Advance Paid (Dr): <span className="font-semibold">{formatCurrency(modalData.totalAmount)}</span></>
                                                : <>Payable (Cr): <span className="font-semibold">{formatCurrency(modalData.totalAmount)}</span></>
                                        )}
                                        {modalData.type === 'customer' && (
                                            modalData.nature === 'customerAdvance'
                                                ? <>Customer Advance (Cr): <span className="font-semibold">{formatCurrency(modalData.totalAmount)}</span></>
                                                : <>Receivable (Dr): <span className="font-semibold">{formatCurrency(modalData.totalAmount)}</span></>
                                        )}
                                        {(modalData.type === 'bank' || modalData.type === 'cash') && (
                                            <>Balance: <span className="font-semibold">{formatCurrency(modalData.totalAmount)}</span></>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                                {modalEntries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 dark:text-gray-400">No entries found</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead className="bg-gray-50 dark:bg-slate-900">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">S.No</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Debit (₹)</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credit (₹)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Voucher Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                                {modalEntries.map((entry, idx) => (
                                                    <tr key={entry.id || idx} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{idx + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(entry.receivedDate)}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">{entry.description || '—'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">
                                                            {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600 dark:text-red-400">
                                                            {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-slate-700">
                                                                {entry.voucherType || '—'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50 dark:bg-slate-900 sticky bottom-0">
                                                <tr>
                                                    <th colSpan="3" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-3 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(modalEntries.reduce((sum, e) => sum + (e.debit || 0), 0))}
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-sm font-bold text-red-600 dark:text-red-400">
                                                        {formatCurrency(modalEntries.reduce((sum, e) => sum + (e.credit || 0), 0))}
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default PaymentSummary;