import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { CREATE_CREDITNOTE_URL, GETPRODUCTS, GET_VoucherNos_URL, GET_VoucherReceipt_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const CreateCreditNote = () => {

    const navigate= useNavigate()
    const { id } = useParams();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, } = useVoucher();
    const [voucherNos, setvoucherNos] = useState('')
    const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [salesVouchers, setSalesVouchers] = useState([]);
    const [selectedReceipt, setselectedReceipt] = useState('')
    const [isProductModalOpen, setisProductModalOpen] = useState(false)
    const [productDetail, setproductDetail] = useState([])
    const [ledgerData, setledgerData] = useState([])
    // Add state to store the GST type from the original voucher
    const [originalGstType, setOriginalGstType] = useState(null); // 'IGST' or 'CGST+SGST'

    // Filter ledgers for customers only
    const getFilteredLedgers = () => {
        if (!Ledger) return [];
        return Ledger.filter(ledg => ledg?.ledgerType === "CUSTOMER");
    };

    const LedgerData = getFilteredLedgers()?.map(ledg => ({
        value: ledg?.id,
        customerId: ledg?.customer ? ledg.customer.id : null,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.typeOfOpeningBalance
    }));

    // GST Ledgers for Output GST reversal
    const igstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('igst') && !ledg.name.toLowerCase().includes('input')
    );
    const cgstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('cgst') && !ledg.name.toLowerCase().includes('input')
    );
    const sgstLedgers = Ledger.filter(ledg =>
        ledg?.name && ledg.name.toLowerCase().includes('sgst') && !ledg.name.toLowerCase().includes('input')
    );

    const igstOptions = igstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));
    const cgstOptions = cgstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));
    const sgstOptions = sgstLedgers?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));

    const destinationledger = Ledger?.map(ledg => ({ value: ledg?.id, label: ledg?.name }));

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
        getLedgerIncome();
        fetchAllProducts();
    }, []);

    const GetVoucherNos = async () => {
        try {
            const response = await fetch(`${GET_VoucherNos_URL}/${Vouchers.id}?type=CREDIT_NOTE`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setvoucherNos(data.nextReceipt);
                return data.nextReceipt;
            } else {
                toast.error(data.errorMessage || "Error");
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

    useEffect(() => {
        if (Vouchers?.id) {
            GetVoucherNos();
        }
    }, [Vouchers.id]);
     const [loadingAllProducts, setLoadingAllProducts] = useState(false);

    const fetchAllProducts = async () => {
        setLoadingAllProducts(true);
        try {
            const response = await fetch(`${GETPRODUCTS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                const productOptions = data?.map(product => ({
                    value: product.id,
                    label: `${product?.productId} ${product.barcode}`,
                    price: product?.retailMrp,
                    hsnCode: product?.hsnCode || {},
                    obj: product
                }));
                setAllProducts(productOptions);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingAllProducts(false);
        }
    };

    const handleLedgerSelect = async (option) => {
        setSelectedLedger(option);
        // Reset GST type when customer changes
        setOriginalGstType(null);
        
        // Fetch sales vouchers for this customer
        try {
            const response = await fetch(`${GET_VoucherReceipt_URL}${option?.value}/receipt-numbers`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            console.log(data, "kkkkkk");

            if (response.ok) {
                const voucherOptions = data.map(v => ({
                    value: v,
                    label: `${v} `,
                    obj: v
                }));
                setSalesVouchers(voucherOptions);
            }
        } catch (error) {
            console.error("Error fetching sales vouchers:", error);
        }
    };

    const calculateLineTotal = (entry) => {
        const basePrice = entry.exclusiveGst || entry.rate || entry.mrp || 0;
        const quantity = entry.quantity || 1;
        return (basePrice * quantity).toFixed(2);
    };

    const calculateTotals = (values) => {
        let subtotal = 0;
        let totalCGST = 0;
        let totalSGST = 0;
        let totalIGST = 0;
        let totalGST = 0;
        let totalMRP = 0;
        let totalQuantity = 0;

        values.items.forEach(entry => {
            console.log(entry,"entryyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            
            if (entry.gstCalculation) {
                const lineTotal = parseFloat(entry.mrp || 0) * (entry.quantity || 1);
                subtotal += lineTotal;

                const mrpTotal = (entry.mrp || 0) * (entry.quantity || 1);
                totalMRP += mrpTotal;
                totalQuantity += (entry.quantity || 1);

                if (entry.gstCalculation.type === 'CGST+SGST') {
                    totalCGST += (entry.gstCalculation.cgstAmount || 0) * (entry.quantity || 1);
                    totalSGST += (entry.gstCalculation.sgstAmount || 0) * (entry.quantity || 1);
                } else if (entry.gstCalculation.type === 'IGST') {
                    totalIGST += (entry.gstCalculation.gstAmount || 0) * (entry.quantity || 1);
                }
                totalGST += (entry.gstCalculation.totalGstAmount || 0) * (entry.quantity || 1);
            }
        });

        return {
            subtotal: subtotal.toFixed(2),
            totalCGST: totalCGST.toFixed(2),
            totalSGST: totalSGST.toFixed(2),
            totalIGST: totalIGST.toFixed(2),
            totalGST: totalGST.toFixed(2),
            totalMRP: totalMRP.toFixed(2),
            totalQuantity: totalQuantity
        };
    };

    // Updated GST calculation for credit note based on original voucher type
    const calculateGSTForCreditNote = (mrp, hsnCode, originalGstType, discount = 0) => {
        const discountedPrice = discount > 0 ? mrp * (1 - discount / 100) : mrp;
        const igstRate = hsnCode?.igst || 0;
        const cgstRate = hsnCode?.cgst || 0;
        const sgstRate = hsnCode?.sgst || 0;

        console.log('Credit Note GST Calculation:', {
            originalGstType,
            igstRate,
            cgstRate,
            sgstRate,
            discountedPrice
        });

        // Use the original GST type from the sales voucher
        if (originalGstType === 'IGST') {
            const gstAmount = discountedPrice * (igstRate / 100);
            const inclusivePrice = discountedPrice + gstAmount;
            return {
                type: 'IGST',
                igstRate, cgstRate: 0, sgstRate: 0,
                gstAmount, cgstAmount: 0, sgstAmount: 0,
                totalGstAmount: gstAmount, inclusivePrice,
                originalMrp: mrp, discountedPrice,
                discountApplied: discount > 0,
                discountPercentage: discount,
                originalGstType: 'IGST'
            };
        } else {
            // Default to CGST+SGST (includes cases where originalGstType is 'CGST+SGST' or null)
            const cgstAmount = discountedPrice * (cgstRate / 100);
            const sgstAmount = discountedPrice * (sgstRate / 100);
            const totalGstAmount = cgstAmount + sgstAmount;
            const inclusivePrice = discountedPrice + totalGstAmount;

            return {
                type: 'CGST+SGST',
                cgstRate, sgstRate, igstRate: 0,
                cgstAmount, sgstAmount, gstAmount: 0,
                totalGstAmount, inclusivePrice,
                originalMrp: mrp, discountedPrice,
                discountApplied: discount > 0,
                discountPercentage: discount,
                originalGstType: 'CGST+SGST'
            };
        }
    };

    const validationSchema = Yup.object().shape({
        noteNumber: Yup.string().required('Voucher number is required'),
        ledgerId: Yup.string().required('Customer account is required'),
        date: Yup.date().required('Date is required'),
    });

    const handleCreateVoucher = async (values) => {
        console.log(values, "vouchercreate");

        // try {
        //     const response = await fetch(`${CREATE_CREDITNOTE_URL}/${id}/create`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(values)
        //     });

        //     let data;
        //     try {
        //         data = await response.json();
        //     } catch {
        //         console.log(data, "catccccccch");
        //         data = { errorMessage: response.errorMessage };
        //     }
            
        //     if (response.ok) {
        //         toast.success(`Voucher Entry added successfully`);
        //         navigate("/Vouchers/view");
        //     } else {
        //         console.log("i am in error else ");
        //         toast.error(`${data.errorMessage}`);
        //     }
        // } catch (error) {
        //     console.error(error);
        //     toast.error("An error occurred");
        // }
    };
    console.log(Vouchers,"....0");
    

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Credit Note" />
            <div>
                <Formik
                    initialValues={{
                        noteNumber: voucherNos,
                        date: '',
                        voucherId: Number(id),
                        locationId: Vouchers?.defGstRegist?.id || "",
                        ledgerId: "",
                        salesVoucherId: "",
                        currentBalance: "",
                        narration: "",
                        igstLedgerId: null,
                        cgstLedgerId: null,
                        totalwithoutGst: null,
                        sgstLedgerId: null,
                        entryPaymentId: null,
                        destinationLedgerId: null,
                        typeOfVoucher: "Credit Note",
                        noteType: "CREDIT_NOTE",
                        isExport: false,
                        totalAmount: 0,
                        totalIgst: 0,
                        totalSgst: 0,
                        totalCgst: 0,
                        totalGst: 0,
                        items: [{
                            productId: null,
                            mrp: 0,
                            rate: 0,
                            exclusiveGst: 0,
                            discount: 0,
                            quantity: 1,
                            value: 0,
                            igstRate: 0,
                            gstAmount: 0,
                            gstCalculation: null
                        }]
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateVoucher}
                >
                    {({ isSubmitting, setFieldValue, values }) => {
                        const totals = calculateTotals(values);
const totalAmounts = totals.subtotal - totals.totalGST;
console.log(totalAmounts,"4545454");
const totlWithOutGst= totals.totalMRP-totals.totalGST

                        useEffect(() => {
                            setFieldValue('totalAmount', totalAmounts);
                            setFieldValue('totalGst', totals.totalGST);
                            setFieldValue('totalCgst', totals.totalCGST);
                            setFieldValue('totalIgst', totals.totalIGST);
                            setFieldValue('totalSgst', totals.totalSGST);
                            setFieldValue("totalwithoutGst", totlWithOutGst)
                        }, [totals.subtotal,
                        totals.totalGST,
                        totals.totalCGST,
                        totals.totalIGST,
                        totals.totalSGST,
                        totals.totalMRP,
                            setFieldValue]);

                        // Effect to fetch ledger data when sales voucher is selected
                        useEffect(() => {
                            const handleLedgerData = async () => {
                                if (values?.ledgerId && values.salesVoucherId) {
                                    try {
                                        const response = await fetch(`${GET_VoucherReceipt_URL}${values?.ledgerId}/ledger-product?receiptNumber=${values.salesVoucherId}`, {
                                            method: "GET",
                                            headers: {
                                                "Authorization": `Bearer ${token}`
                                            },
                                        });
                                        const data = await response.json();
                                        console.log(data, "Ledger data from API");

                                        if (response.ok && data) {
                                            // Determine GST type based on which ledger IDs are present
                                            if (data.igstLedgerId) {
                                                setFieldValue('igstLedgerId', data.igstLedgerId);
                                                setOriginalGstType('IGST');
                                                console.log('Setting GST type to: IGST');
                                            }
                                            if (data.cgstLedgerId) {
                                                setFieldValue('cgstLedgerId', data.cgstLedgerId);
                                                setOriginalGstType('CGST+SGST');
                                                console.log('Setting GST type to: CGST+SGST');
                                            }
                                            if (data.sgstLedgerId) {
                                                setFieldValue('sgstLedgerId', data.sgstLedgerId);
                                                // Don't override type here as CGST+SGST is already set
                                            }

                                            if (data.entryPaymentId) {
                                                setFieldValue('entryPaymentId', data.entryPaymentId);
                                            }

                                            // Set destination ledger
                                            if (data.destinationLedgerId) {
                                                setFieldValue('destinationLedgerId', data.destinationLedgerId);
                                            }
                                            if (data.product) {
                                                setproductDetail(data.product);
                                                
                                                // Optional: Auto-populate items from the original voucher
                                                // You can map data.product to items here if needed
                                            }
                                        }
                                    } catch (error) {
                                        console.error("Error fetching ledger data:", error);
                                    }
                                }
                            };

                            handleLedgerData();
                        }, [values.salesVoucherId, values.ledgerId, token, setFieldValue]);

                        // Handle product selection with the original GST type
                        const handleProductSelect = (option, index) => {
                            if (!option) return;
                            
                            const mrp = option?.price || 0;
                            const hsnCode = option?.hsnCode || {};
                            const currentDiscount = values.items[index].discount || 0;

                            const gstCalculation = calculateGSTForCreditNote(
                                mrp, 
                                hsnCode, 
                                originalGstType, // Use the GST type from original voucher
                                currentDiscount
                            );

                            setFieldValue(`items.${index}.productId`, option?.obj.id);
                            setFieldValue(`items.${index}.mrp`, mrp);
                            setFieldValue(`items.${index}.exclusiveGst`, gstCalculation.inclusivePrice);
                            setFieldValue(`items.${index}.rate`, gstCalculation.inclusivePrice);
                            setFieldValue(`items.${index}.gstCalculation`, gstCalculation);

                            const lineTotal = calculateLineTotal({
                                exclusiveGst: gstCalculation.inclusivePrice,
                                quantity: values.items[index].quantity || 1
                            });
                            setFieldValue(`items.${index}.value`, lineTotal);
                        };

                        // Handle discount change
                        const handleDiscountChange = (e, index) => {
                            const discount = parseFloat(e.target.value) || 0;
                            const clampedDiscount = discount > 100 ? 100 : discount;
                            setFieldValue(`items.${index}.discount`, clampedDiscount);

                            if (values.items[index].productId) {
                                const mrp = values.items[index].mrp || 0;
                                const product = allProducts.find(p => p.value === values.items[index].productId);
                                const hsnCode = product?.hsnCode || {};

                                const gstCalculation = calculateGSTForCreditNote(
                                    mrp, 
                                    hsnCode, 
                                    originalGstType,
                                    clampedDiscount
                                );

                                setFieldValue(`items.${index}.gstCalculation`, gstCalculation);
                                setFieldValue(`items.${index}.exclusiveGst`, gstCalculation.inclusivePrice);
                                setFieldValue(`items.${index}.rate`, gstCalculation.inclusivePrice);

                                const lineTotal = calculateLineTotal({
                                    exclusiveGst: gstCalculation.inclusivePrice,
                                    quantity: values.items[index].quantity || 1
                                });
                                setFieldValue(`items.${index}.value`, lineTotal);
                            }
                        };

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Credit Note Entry
                                            </h3>
                                            {/* Display the GST type from original voucher */}
                                            {originalGstType && (
                                                <div className={`text-center mt-2 p-2 rounded ${
                                                    originalGstType === 'IGST' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    Original Voucher GST Type: <strong>{originalGstType}</strong>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col p-6.5">
                                            {/* Top Section */}
                                            <div className='flex flex-row gap-4 mb-6 flex-wrap'>
                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Credit Note Number</label>
                                                    <Field
                                                        type="text"
                                                        name="noteNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                                    />
                                                    <ErrorMessage name="noteNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Customer Account</label>
                                                    <ReactSelect
                                                        name='ledgerId'
                                                        value={LedgerData.find(opt => opt.value === values.ledgerId)}
                                                        onChange={(option) => {
                                                            setFieldValue('ledgerId', option?.value || '');
                                                            setFieldValue('currentBalance', option?.balance || 0);
                                                            handleLedgerSelect(option);
                                                        }}
                                                        options={LedgerData}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Customer"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                    />
                                                    <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Reference Sales Voucher</label>
                                                    <ReactSelect
                                                        name='salesVoucherId'
                                                        value={salesVouchers.find(opt => opt.value === values.salesVoucherId)}
                                                        onChange={(option) => setFieldValue('salesVoucherId', option?.value)}
                                                        options={salesVouchers}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Sales Voucher"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                        isDisabled={!values.ledgerId}
                                                    />
                                                </div>
                                                {
                                                    values?.salesVoucherId && (
                                                        <div>
                                                            <button type='button' className='bg-primary text-white px-4 py-2 rounded' onClick={() => setisProductModalOpen(true)} >View Selected Voucher Product</button>
                                                        </div>
                                                    )
                                                }
                                            </div>

                                            {/* GST Ledgers */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mb-4">
                                                <div className="flex-1 min-w-[150px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                    <Field
                                                        type="text"
                                                        name="currentBalance"
                                                        placeholder="0.00"
                                                        readOnly
                                                        className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="flex-2 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Destination Ledger</label>
                                                    <ReactSelect
                                                        name='destinationLedgerId'
                                                        value={destinationledger.find(opt => opt.value === values.destinationLedgerId)}
                                                        onChange={(option) => setFieldValue('destinationLedgerId', option?.value || '')}
                                                        options={destinationledger}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Ledger"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                    <ErrorMessage name="destinationLedgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">IGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='igstLedgerId'
                                                        value={igstOptions.find(opt => opt.value === values.igstLedgerId)}
                                                        onChange={(option) => setFieldValue('igstLedgerId', option?.value || '')}
                                                        options={igstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select IGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                        isDisabled={originalGstType === 'CGST+SGST'} // Disable if original was CGST+SGST
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">CGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='cgstLedgerId'
                                                        value={cgstOptions.find(opt => opt.value === values.cgstLedgerId)}
                                                        onChange={(option) => setFieldValue('cgstLedgerId', option?.value || '')}
                                                        options={cgstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select CGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                        isDisabled={originalGstType === 'IGST'} // Disable if original was IGST
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2.5 block text-black dark:text-white">SGST Ledger (Reversal)</label>
                                                    <ReactSelect
                                                        name='sgstLedgerId'
                                                        value={sgstOptions.find(opt => opt.value === values.sgstLedgerId)}
                                                        onChange={(option) => setFieldValue('sgstLedgerId', option?.value || '')}
                                                        options={sgstOptions}
                                                        classNamePrefix="react-select"
                                                        placeholder="Select SGST"
                                                        menuPortalTarget={document.body}
                                                        styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                        isDisabled={originalGstType === 'IGST'} // Disable if original was IGST
                                                    />
                                                </div>
                                            </div>

                                            {/* Products Table */}
                                            <FieldArray name="items">
                                                {({ push, remove }) => (
                                                    <div className="mb-6">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full table-fixed border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                        {["Product", "MRP", "Discount %", "Quantity", "Value", "GST Type", "Action"].map((header, i) => (
                                                                            <th key={i} className="w-[250px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                                                                {header}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values.items.map((entry, index) => (
                                                                        <tr key={entry.id || index}>
                                                                            <td className="border-b py-4 px-3">
                                                                                {selectedLedger ? (
                                                                                    <ReactSelect
                                                                                    className="react-select-container w-[240px] "
                                                                                    isDisabled={loadingAllProducts}
                                                                                        name={`items.${index}.productId`}
                                                                                        value={allProducts.find(p => p.value === entry.productId)}
                                                                                        onChange={(option) => handleProductSelect(option, index)}
                                                                                        options={allProducts}
                                                                                        placeholder={loadingAllProducts ? "Loading..." : "Select Product"}
                                                                                        classNamePrefix="react-select"
                                                                                        menuPortalTarget={document.body}
                                                                                        styles={{ height: ["110px"], menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                        isClearable
                                                                                    />
                                                                                ) : (
                                                                                    <div className="text-sm text-gray-400">Select customer first</div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`items.${index}.mrp`}
                                                                                    placeholder="0.00"
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`items.${index}.discount`}
                                                                                    placeholder="0"
                                                                                    min="0"
                                                                                    max="100"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => handleDiscountChange(e, index)}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`items.${index}.quantity`}
                                                                                    placeholder="1"
                                                                                    min="1"
                                                                                    className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                                                    onChange={(e) => {
                                                                                        const quantity = parseFloat(e.target.value) || 1;
                                                                                        setFieldValue(`items.${index}.quantity`, quantity);
                                                                                        setFieldValue(`items.${index}.value`, calculateLineTotal({
                                                                                            exclusiveGst: entry.exclusiveGst,
                                                                                            quantity: quantity
                                                                                        }));
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                <Field
                                                                                    type="number"
                                                                                    name={`items.${index}.value`}
                                                                                    value={calculateLineTotal(entry)}
                                                                                    readOnly
                                                                                    className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                                                />
                                                                            </td>
                                                                            <td className="border-b py-4 px-3">
                                                                                {entry.gstCalculation && (
                                                                                    <div className="flex flex-col">
                                                                                        <span className={`text-xs font-medium px-2 py-1 rounded ${entry.gstCalculation.type === 'CGST+SGST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                                                            }`}>
                                                                                            {entry.gstCalculation.type}
                                                                                        </span>
                                                                                        {entry.gstCalculation.discountApplied && (
                                                                                            <span className="text-xs text-orange-600 mt-1">
                                                                                                {entry.gstCalculation.discountPercentage}% off
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="border-b py-4 px-3 text-center">
                                                                                {values.items.length > 1 && (
                                                                                    <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
                                                                                        <MdDelete size={22} />
                                                                                    </button>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => push({
                                                                id: uuidv4(),
                                                                productId: null,
                                                                mrp: 0,
                                                                rate: 0,
                                                                exclusiveGst: 0,
                                                                discount: 0,
                                                                quantity: 1,
                                                                value: 0,
                                                                gstCalculation: null
                                                            })}
                                                            // disabled={!selectedLedger || !originalGstType}
                                                            className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium disabled:text-gray-400"
                                                        >
                                                            <IoMdAdd size={20} /> Add Row
                                                        </button>

                                                        {/* Summary */}
                                                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="text-lg font-semibold mb-3">Summary</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total MRP</p>
                                                                    <p className="font-medium">₹{totals.totalMRP}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total Quantity</p>
                                                                    <p className="font-medium">{totals.totalQuantity}</p>
                                                                </div>
                                                                {parseFloat(totals.totalCGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">CGST</p>
                                                                        <p className="font-medium">₹{totals.totalCGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalSGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">SGST</p>
                                                                        <p className="font-medium">₹{totals.totalSGST}</p>
                                                                    </div>
                                                                )}
                                                                {parseFloat(totals.totalIGST) > 0 && (
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-400">IGST</p>
                                                                        <p className="font-medium">₹{totals.totalIGST}</p>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Total GST</p>
                                                                    <p className="font-medium">₹{totals.totalGST}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600 dark:text-gray-400">Grand Total</p>
                                                                    <p className="font-bold text-primary">₹{totals.subtotal}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Narration */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field
                                                    as="textarea"
                                                    name="narration"
                                                    placeholder="Enter reason for credit note"
                                                    rows="3"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center mt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex md:w-[220px] w-full justify-center bg-primary p-3 font-medium text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                                >
                                                    {isSubmitting ? 'Creating...' : 'Create Credit Note'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isProductModalOpen && (
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50 ">
                                        <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px] w-[870px] h-[400px] mt-[60px] dark:bg-slate-600">
                                            <div className="text-right">
                                                <button onClick={() => setisProductModalOpen(false)} className="text-red-500 text-xl font-bold">&times;</button>
                                            </div>
                                            <h2 className="text-2xl text-center mb-4 font-extrabold shadow-sm">Product Detail for voucher {values.recieptNumber}</h2>
                                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                                <table className="min-w-full leading-normal">
                                                    <thead>
                                                        <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Desc.</th>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">productId</th>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">barcode </th>
                                                            <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">discount </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {productDetail && (
                                                            <>
                                                                {productDetail.map((row, index) => (
                                                                    <tr key={row.id}>
                                                                        <td className="px-2 py-2 border-b dark:text-white">
                                                                            <p>{row?.productDescription}</p>
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b dark:text-white">
                                                                            <p>{row?.productId}</p>
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b dark:text-white">
                                                                            {row.barcode}
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b dark:text-white">
                                                                            {row.discount}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default CreateCreditNote;