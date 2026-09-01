import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { BASE_URL, GET_LEDGERSupplierId__URL, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

/**
 * Determine registration location (sxr / delhi) from a GST-registration object or string.
 */
const getRegistrationLocation = (gstReg) => {
    if (!gstReg) return null;
    const regLower = gstReg?.state?.toLowerCase() || gstReg?.toLowerCase() || '';
    if (
        regLower.includes('jammu') ||
        regLower.includes('kashmir') ||
        regLower.includes('j&k') ||
        regLower.includes('jk') ||
        regLower.includes('sxr')
    ) {
        return 'sxr';
    }
    if (regLower.includes('delhi') || regLower.includes('ncr') || regLower.includes('nct')) {
        return 'delhi';
    }
    return null;
};

/**
 * Determine party (supplier) location from the selected ledger's shipping state,
 * falling back to the ledger fetched by supplierId.
 */
const getPartyLocation = (selectedLedgerOption, custAddress) => {
    const shippingState = selectedLedgerOption?.obj?.shippingState;
    if (shippingState === '01') return 'sxr';
    if (shippingState === '07') return 'delhi';
    if (custAddress === '01') return 'sxr';
    if (custAddress === '07') return 'delhi';
    return null;
};

/**
 * Purchase rate calculation.
 * - Supplier is "Regular" (isRegular = true): MRP is inclusive of GST, so we
 *   strip GST out to get the excl.-GST base price, and separately track the
 *   GST amount (this GST amount is postable to an Input GST ledger for ITC,
 *   and the supplier is owed the FULL mrp, not just the base price).
 * - Supplier is anything other than Regular (composition/unregistered/etc):
 *   no GST is applicable on this purchase at all — base price = mrp,
 *   gstAmount = 0, and nothing gets posted to any GST ledger.
 */
const calculatePurchaseRate = (mrp, gstRatePercent, isRegular) => {
    const rate = isRegular ? (gstRatePercent || 0) : 0;

    const basePrice = rate > 0 ? mrp / (1 + rate / 100) : mrp;
    const gstAmount = mrp - basePrice;

    return {
        basePrice,
        gstAmount,
        totalAmount: mrp,
        gstRate: rate
    };
};

const CreateVoucherPurchase = () => {
    const { id } = useParams();
    const location = useLocation();

    const [ledgerId, setledgerId] = useState(null)
    const [regType, setregType] = useState('')
    const [custaddress, setcustaddress] = useState('')
    const [openingbal, setopeningbal] = useState(0)
    // Gate the form's mount until the supplier ledger is known — the initial
    // paymentDetails rows are built as soon as the form mounts, so we wait
    // for the supplier fetch to resolve before rendering the form.
    const [ledgerLoaded, setLedgerLoaded] = useState(false)

    // Whether the currently-selected supplier is a "Regular" registered dealer.
    // This is the single switch that decides whether GST is stripped from MRP
    // and posted to an Input GST ledger, or ignored entirely.
    const isRegularSupplier = (regType || '').toLowerCase() === 'regular';

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers, handleCreateVoucher } = useVoucher();
    const [voucherNos, setvoucherNos] = useState([])
    const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);

    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Destructure location state
    const {
        supplierId = '',
        orders = [],
    } = location.state || {};

    console.log(orders,"47896547896555555555555555555555");


    // Real, user-editable order selection (orders passed in via location.state is
    // just the initial candidate list — it never changes, so it must NOT be used
    // directly to drive the multi-select's `value`).
    const [selectedOrderIds, setSelectedOrderIds] = useState(
        orders?.map(ord => ord?.orderId).filter(Boolean) || []
    );

    // ---- Fetch supplier ledger info ----
    const getLedgerId = async () => {
        try {
            const response = await fetch(`${GET_LEDGERSupplierId__URL}/${supplierId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setledgerId(data?.id);
            setopeningbal(data?.openingBalances || 0)
            setregType(data?.registrationType || '')
            setcustaddress(data?.shippingState || '')
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        } finally {
            setLedgerLoaded(true);
        }
    }

    useEffect(() => {
        if (supplierId) {
            getLedgerId()
        } else {
            // No supplier passed in — nothing to wait for, unblock the form.
            setLedgerLoaded(true);
        }
    }, [])

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
        getLedgerIncome();
    }, []);

    // Filter ledgers for suppliers
    const getFilteredLedgers = () => {
        if (!Ledger) return [];
        return Ledger.filter(ledg => ledg?.supplier !== null);
    };

    const LedgerData = getFilteredLedgers()?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        gstType:ledg.registrationType,
        balance: ledg?.openingBalances,
        type: ledg?.ledgerType,
        isSupplier: ledg?.supplier !== null
    }));

    console.log(LedgerData,"4444444444444444440");


    // Destination Ledger Options (income/purchase-side ledgers)
    const destinationLedger = LedgerIncome?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    })) || [];

    // Input GST Ledger options — only relevant for Regular suppliers, where the
    // GST amount stripped out of MRP needs somewhere to post for ITC purposes.
    // Sourced from the same ledger list as the destination ledger; if you keep
    // GST ledgers in a separate list, swap this source accordingly.
    const gstLedgerOptions = LedgerIncome?.filter(ledg =>
        ledg?.name?.toLowerCase().includes('gst')
    )?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
    })) || [];

    /**
     * Pick a single destination ledger. No GST split is posted alongside this
     * one — it always receives the excl.-GST base amount, regardless of
     * whether the supplier is Regular or not.
     */
    const determineDestinationLedger = (voucherData, destOptions) => {
        if (!destOptions || destOptions.length === 0) return null;
        const baseType = 'purchase';

        return destOptions.find(opt =>
            opt.label?.toLowerCase().includes(baseType) &&
            !opt.label?.toLowerCase().includes('export')
        )?.value || destOptions.find(opt =>
            opt.label?.toLowerCase().includes(baseType)
        )?.value || null;
    };

    /**
     * Pick a single Input GST ledger — e.g. "Input IGST", "Input CGST".
     * Prefers a label containing "input" + "gst"; falls back to any "gst" ledger.
     */
    const determineGstLedger = (gstOptions) => {
        if (!gstOptions || gstOptions.length === 0) return null;
        return gstOptions.find(opt =>
            opt.label?.toLowerCase().includes('input') &&
            opt.label?.toLowerCase().includes('gst')
        )?.value || gstOptions[0]?.value || null;
    };

    // ---- Voucher numbering ----
    const GetVoucherNos = async () => {
        try {
            const response = await fetch(`${GET_VoucherNos_URL}/${Vouchers.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();
            console.log(data,'4444444444444444444444444444444444444444444444444444444444448');
            
            if (response.ok) {
                setvoucherNos(data);
                return data;
            } else {
                toast.error(data.errorMessage || "Error");
                setvoucherNos([]);
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

    let lastvoucher = 0;
    if (voucherNos.nextReceipt) {
        lastvoucher = Number(voucherNos.nextReceipt) || 0;
    }
    
    const nextVoucher = lastvoucher + 1;
    console.log(nextVoucher,"333333333333330");

    // ---- Fetch products for the currently-selected orders ----
    const handleOrderSelect = async (selectedValues) => {
        setAvailableProducts([]);
        if (!selectedValues || selectedValues.length === 0) return;

        setLoadingProducts(true);
        try {
            const orderIdsParam = selectedValues.join(',');
            const response = await fetch(`${BASE_URL}/order/order-products/by-order-ids?orderIds=${orderIdsParam}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                const productOptions = data.map(prod => ({
                    value: prod.product.id,
                    orderProdId: prod.id,
                    orderId: prod.orderId,
                    label: prod.product.productId,
                    productName: prod.product?.productDescription,
                    price: prod.product?.retailMrp,
                    hsnCode: prod.product?.hsnCode || {},
                    gstRate: prod.product?.hsnCode?.igst ?? 0,
                    obj: prod
                }));
                setAvailableProducts(productOptions);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    }

    // Fetch products for the initial order selection once on mount
    useEffect(() => {
        if (selectedOrderIds.length > 0) {
            handleOrderSelect(selectedOrderIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUsedProductIds = (values, currentIndex) => {
        return values.paymentDetails
            .filter((_, index) => index !== currentIndex)
            .map(item => item.productsId)
            .filter(Boolean);
    };

    const getAvailableProductsForRow = (values, currentIndex) => {
        const usedProductIds = getUsedProductIds(values, currentIndex);
        return availableProducts.filter(product =>
            !usedProductIds.includes(product.value)
        );
    };

    const calculateTotals = (values) => {
        let totalBasePrice = 0;   // Excl. GST — always goes to the Destination ledger
        let totalGSTAmount = 0;   // Only posted to an Input GST ledger if supplier is Regular
        let totalMRP = 0;         // Inc. GST — what the supplier is actually owed if Regular
        let totalQuantity = 0;

        (values.paymentDetails || []).forEach(entry => {
            const quantity = entry.quantity || 1;
            const basePrice = entry.basePrice ?? entry.rate ?? entry.mrp ?? 0;
            const mrp = entry.mrp || 0;

            totalBasePrice += basePrice * quantity;
            totalMRP += mrp * quantity;
            totalQuantity += quantity;
            totalGSTAmount += (entry.gstAmount || 0) * quantity;
        });

        return {
            totalBasePrice: totalBasePrice.toFixed(2),
            totalGSTAmount: totalGSTAmount.toFixed(2),
            totalMRP: totalMRP.toFixed(2),
            totalQuantity
        };
    };

    const validationSchema = Yup.object().shape({
        recieptNumber: Yup.string().required('Voucher number is required'),
        supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
        date: Yup.date().required('Date is required'),
        ledgerId: Yup.string().required('Party account is required'),
    });

    const buildInitialPaymentDetails = () => {
        const rows = [];
        selectedOrderIds.forEach(orderId => {

            const order = orders.find(o => o?.orderId === orderId);
            console.log(order,"454545");
            if (!order) return;

            if (Array.isArray(order.products) && order.products.length > 0) {
                order.products.forEach(orderProduct => {
                    const mrp = orderProduct?.product?.retailMrp || 0;
                    // GST rate always lives at product.hsnCode.igst
                    const gstRate = orderProduct?.product?.hsnCode?.igst || 0;
                    const quantity = orderProduct?.receivedQuantity || 1;
                    const rateCalc = calculatePurchaseRate(mrp, gstRate, isRegularSupplier);

                    rows.push({
                        id: uuidv4(),
                        productsId: orderProduct?.product?.id || null,
                        orderProductId: orderProduct?.id || null,
                        orderId: order?.orderId,
                        productName: orderProduct?.product?.productDescription || '',
                        mrp,
                        rate: rateCalc.basePrice,
                        basePrice: rateCalc.basePrice,
                        gstRate,
                        gstAmount: rateCalc.gstAmount,
                        discount: 0,
                        quantity,
                        value: rateCalc.basePrice * quantity,
                        voucherAmount: rateCalc.basePrice * quantity,
                    });
                });
            } else {
                const mrp = order?.productCost || 0;
                // GST rate always lives at hsnCode.igst
                const gstRate = order?.product?.hsnCode?.igst || order?.igst || 0;
                const quantity = order?.receivedQty || 1;
                const rateCalc = calculatePurchaseRate(mrp, gstRate, isRegularSupplier);

                rows.push({
                    id: uuidv4(),
                    productsId: order?.productId || null,
                    orderProductId: null,
                    orderId: order?.orderId,
                    productName: order?.ProductIdString || '',
                    mrp,
                    rate: rateCalc.basePrice,
                    basePrice: rateCalc.basePrice,
                    gstRate,
                    gstAmount: rateCalc.gstAmount,
                    discount: 0,
                    quantity,
                    value: rateCalc.basePrice * quantity,
                    voucherAmount: rateCalc.basePrice * quantity,
                });
            }
        });

        return rows.filter(row => row.quantity > 0);
    };

    if (!ledgerLoaded) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName="Configurator/Create Voucher" />
                <div className="flex items-center justify-center p-10 text-gray-500">
                    Loading supplier details...
                </div>
            </DefaultLayout>
        );
    }
    console.log(Vouchers,"111111111111111111111111111");


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Voucher" />
            <div>
                <Formik
                key={nextVoucher}
                 
                    initialValues={{
                        recieptNumber: nextVoucher,
                        supplierInvoiceNumber: '',
                        date: new Date().toISOString().split('T')[0],
                        voucherId: Number(id),
                        ledgerId: null,
                        orderIds: selectedOrderIds,
                        currentBalance: 0,
                        gstRegistration: Vouchers?.defGstRegist?.state || "",
                        destinationLedgerId: null,
                        gstLedgerId: null,
                        locationId:Vouchers?.defGstRegist?.id,
                        narration: "",
                        modeOfPayment: "",
                        chequeNumber: "",
                        cardNumber: "",
                        transactionId: "",
                        totalAmount: 0,
                        paymentDetails: buildInitialPaymentDetails()
                    }}
                    enableReinitialize={false}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const totals = calculateTotals(values);

                        const payload = {
                            ...values,
                            // Destination (purchase) ledger always gets the excl.-GST base amount.
                            destinationAmount: parseFloat(totals.totalBasePrice),
                            // Regular supplier: full MRP (incl. GST) is what's actually owed, and
                            // the GST portion is booked separately to the Input GST ledger for ITC.
                            // Non-regular supplier: nothing to split, owed amount = base amount,
                            // no GST ledger posting at all.
                            totalAmount: isRegularSupplier
                                ? parseFloat(totals.totalMRP)
                                : parseFloat(totals.totalBasePrice),
                            gstAmount: isRegularSupplier ? parseFloat(totals.totalGSTAmount) : 0,
                            gstLedgerId: isRegularSupplier ? values.gstLedgerId : null,
                            locationId:Vouchers.defGstRegist.id,
                        };

                        await handleCreateVoucher(payload);
                    }}
                >
                    {({ isSubmitting, setFieldValue, values }) => {
                        const totals = calculateTotals(values);

                        // Seed ledgerId ONCE from the fetched supplier — never overwrite a
                        // user's manual selection afterward.
                        useEffect(() => {
                            if (ledgerId && !values.ledgerId) {
                                setFieldValue('ledgerId', ledgerId);
                                setFieldValue('currentBalance', openingbal || 0);
                            }
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [ledgerId]);

                        // Keep totalAmount in sync — full MRP if Regular (what's owed to
                        // supplier), excl.-GST base amount otherwise.
                        useEffect(() => {
                            setFieldValue(
                                'totalAmount',
                                isRegularSupplier ? parseFloat(totals.totalMRP) : parseFloat(totals.totalBasePrice)
                            );
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [totals.totalBasePrice, totals.totalMRP, isRegularSupplier]);

                        // Supplier's registration type changed (new supplier picked, or the
                        // initial fetch resolved) — recompute every row's excl.-GST rate since
                        // whether GST applies at all now depends on isRegularSupplier.
                        // Rebuilt in one setFieldValue call to avoid the stale-row race where
                        // only the last-touched row picks up the new rate.
                        useEffect(() => {
                            if (!values.paymentDetails || values.paymentDetails.length === 0) return;

                            const updatedPaymentDetails = values.paymentDetails.map(entry => {
                                const mrp = entry.mrp || 0;
                                const gstRate = entry.gstRate || 0;
                                const quantity = entry.quantity || 1;
                                const rateCalculation = calculatePurchaseRate(mrp, gstRate, isRegularSupplier);

                                return {
                                    ...entry,
                                    basePrice: rateCalculation.basePrice,
                                    rate: rateCalculation.basePrice,
                                    gstAmount: rateCalculation.gstAmount,
                                    value: rateCalculation.basePrice * quantity,
                                    voucherAmount: rateCalculation.basePrice * quantity,
                                };
                            });

                            setFieldValue('paymentDetails', updatedPaymentDetails);
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [isRegularSupplier]);

                        // Auto-pick destination ledger once options are available
                        useEffect(() => {
                            if (Vouchers?.typeOfVoucher?.toLowerCase() === "purchase" && destinationLedger.length > 0) {
                                const selectedValue = determineDestinationLedger(Vouchers, destinationLedger);
                                if (selectedValue && selectedValue !== values.destinationLedgerId) {
                                    setFieldValue('destinationLedgerId', selectedValue);
                                }
                            }
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [Vouchers?.typeOfVoucher, destinationLedger.length]);

                        // Auto-pick Input GST ledger — only when the supplier is Regular and
                        // there's actually GST to post; cleared otherwise.
                        useEffect(() => {
                            if (isRegularSupplier && gstLedgerOptions.length > 0) {
                                const selectedValue = determineGstLedger(gstLedgerOptions);
                                if (selectedValue && selectedValue !== values.gstLedgerId) {
                                    setFieldValue('gstLedgerId', selectedValue);
                                }
                            } else if (!isRegularSupplier && values.gstLedgerId) {
                                setFieldValue('gstLedgerId', null);
                            }
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [isRegularSupplier, gstLedgerOptions.length]);

                        const handleDestinationLedgerChange = (option) => {
                            setFieldValue('destinationLedgerId', option?.value || '');
                        };

                        const handleGstLedgerChange = (option) => {
                            setFieldValue('gstLedgerId', option?.value || '');
                        };

                        const handleOrdersChange = (selectedOptions) => {
                            const selectedValues = selectedOptions?.map(option => option.value) || [];
                            setSelectedOrderIds(selectedValues);
                            setFieldValue('orderIds', selectedValues);
                            // Drop any payment rows whose order was deselected
                            setFieldValue(
                                'paymentDetails',
                                values.paymentDetails.filter(pd => selectedValues.includes(pd.orderId))
                            );
                            handleOrderSelect(selectedValues);
                        };

                        const handleRemoveProduct = (index) => {
                            const updated = values.paymentDetails.map((row, i) =>
                                i === index
                                    ? {
                                          ...row,
                                          productsId: null,
                                          orderProductId: null,
                                          productName: '',
                                          mrp: 0,
                                          rate: 0,
                                          basePrice: 0,
                                          gstAmount: 0,
                                          gstRate: 0,
                                          value: 0,
                                          voucherAmount: 0,
                                      }
                                    : row
                            );
                            setFieldValue('paymentDetails', updated);
                        };

                        const handleProductChange = (option, index, entry) => {
                            const mrp = option?.price || 0;
                            const gstRate = option?.gstRate || 0;
                            const rateCalculation = calculatePurchaseRate(mrp, gstRate, isRegularSupplier);
                            const quantity = entry.quantity || 1;

                            const updated = values.paymentDetails.map((row, i) =>
                                i === index
                                    ? {
                                          ...row,
                                          productsId: option?.value || null,
                                          orderProductId: option?.orderProdId || null,
                                          orderId: option?.orderId || row.orderId || null,
                                          productName: option?.productName || '',
                                          mrp,
                                          gstRate,
                                          basePrice: rateCalculation.basePrice,
                                          rate: rateCalculation.basePrice,
                                          gstAmount: rateCalculation.gstAmount,
                                          value: rateCalculation.basePrice * quantity,
                                          voucherAmount: rateCalculation.basePrice * quantity,
                                      }
                                    : row
                            );
                            setFieldValue('paymentDetails', updated);
                        };

                        const handleQuantityChange = (e, index) => {
                            const quantity = parseFloat(e.target.value) || 1;

                            const updated = values.paymentDetails.map((row, i) => {
                                if (i !== index) return row;
                                const basePrice = row.basePrice ?? row.mrp ?? 0;
                                return {
                                    ...row,
                                    quantity,
                                    value: basePrice * quantity,
                                    voucherAmount: basePrice * quantity,
                                };
                            });
                            setFieldValue('paymentDetails', updated);
                        };

                        return (
                            <Form>
                                <div className="flex flex-col gap-9">
                                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                                Create Entry For {Vouchers?.typeOfVoucher}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col p-6.5">
                                            {/* Top Section */}
                                            <div className='flex flex-row gap-4 mb-6'>
                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Voucher Number</label>
                                                    <Field
                                                        type="text"
                                                        name="recieptNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="recieptNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Supplier Invoice Number</label>
                                                    <Field
                                                        type="text"
                                                        name="supplierInvoiceNumber"
                                                        placeholder="Enter No"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="supplierInvoiceNumber" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Supplier Account</label>
                                                    <ReactSelect
                                                        name='ledgerId'
                                                        value={LedgerData.find(opt => opt.value === values.ledgerId) || null}
                                                        onChange={(option) => {
                                                            setFieldValue('ledgerId', option?.value || null);
                                                            setFieldValue('currentBalance', option?.balance || 0);
                                                            setregType(option?.gstType || option?.obj?.registrationType || '');
                                                            setcustaddress(option?.obj?.shippingState || '');
                                                        }}
                                                        options={LedgerData}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Supplier"
                                                        menuPortalTarget={document.body}
                                                        isClearable
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                    <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Orders</label>
                                                    <ReactSelect
                                                        name='orderIds'
                                                        value={orders
                                                            .filter(ord => selectedOrderIds.includes(ord?.orderId))
                                                            .map(ord => ({ value: ord.orderId, label: ord.orderNo }))}
                                                        onChange={handleOrdersChange}
                                                        options={orders.map(ord => ({ value: ord.orderId, label: ord.orderNo }))}
                                                        isMulti={true}
                                                        isClearable
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className='flex flex-row gap-4 mb-6'>
                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Current Balance</label>
                                                    <Field
                                                        type="text"
                                                        name="currentBalance"
                                                        placeholder="0.00"
                                                        readOnly
                                                        className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                    <Field
                                                        name="date"
                                                        type="date"
                                                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="date" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-2 min-w-[200px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Destination Ledger</label>
                                                    <ReactSelect
                                                        name='destinationLedgerId'
                                                        value={destinationLedger?.find(opt => opt.value === values.destinationLedgerId) || null}
                                                        onChange={handleDestinationLedgerChange}
                                                        options={destinationLedger}
                                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Destination Ledger"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-2 min-w-[180px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">GST Registration</label>
                                                    <Field
                                                        name="gstRegistration"
                                                        type="text"
                                                        value={Vouchers?.defGstRegist?.state || ''}
                                                        readOnly
                                                        className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-slate-800 py-3 px-5 text-black cursor-not-allowed"
                                                    />
                                                </div>

                                                {isRegularSupplier && (
                                                    <div className="flex-2 min-w-[200px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Input GST Ledger</label>
                                                        <ReactSelect
                                                            name='gstLedgerId'
                                                            value={gstLedgerOptions?.find(opt => opt.value === values.gstLedgerId) || null}
                                                            onChange={handleGstLedgerChange}
                                                            options={gstLedgerOptions}
                                                            className="react-select-container bg-white dark:bg-form-Field w-full"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Input GST Ledger"
                                                            menuPortalTarget={document.body}
                                                            styles={{
                                                                ...customStyles,
                                                                menuPortal: (base) => ({ ...base, zIndex: 100000 })
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info banner reflecting how GST is being treated for this supplier */}
                                            {regType && (
                                                isRegularSupplier ? (
                                                    <div className="mt-4 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                                        <p className="text-blue-700 dark:text-blue-400 text-sm">
                                                            ℹ️ Regular registered supplier — GST is stripped from MRP, and the GST amount is posted to the Input GST ledger (ITC eligible). Supplier is owed the full MRP.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                                        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                                            ⚠️ This supplier is registered as {regType?.toUpperCase()}. No GST is applicable — rate equals MRP, and nothing is posted to any GST ledger.
                                                        </p>
                                                    </div>
                                                )
                                            )}

                                            {/* Products Table */}
                                            <FieldArray name="paymentDetails">
                                                {({ push, remove }) => (
                                                    <div className="mb-6">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full table-fixed border-collapse">
                                                                <thead>
                                                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                                                        <th className="w-[200px] py-4 px-3 font-medium text-black dark:text-white">Product</th>
                                                                        <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white">Quantity</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">MRP (Inc. GST)</th>
                                                                        <th className="w-[140px] py-4 px-3 font-medium text-black dark:text-white">Rate (Excl. GST)</th>
                                                                        <th className="w-[100px] py-4 px-3 font-medium text-black dark:text-white">GST Amount</th>
                                                                        <th className="w-[120px] py-4 px-3 font-medium text-black dark:text-white">Total Value</th>
                                                                        <th className="w-[80px] py-4 px-3 font-medium text-black dark:text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {values?.paymentDetails.map((entry, index) => {
                                                                        const rowProducts = getAvailableProductsForRow(values, index);
                                                                        console.log(rowProducts,"000000000000000000000000000000000000000000000000000000000000");
                                                                        
                                                                        const productInfo = availableProducts.find(p => p.value === entry.productsId);

                                                                        return (
                                                                            <tr key={entry.id || index}>
                                                                                <td className="border-b py-4 px-3">
                                                                                    {entry && entry.productsId ? (
                                                                                        <div className="text-sm font-medium flex items-center justify-between gap-2">
                                                                                            <span>{productInfo?.label || entry.productName || 'Product'}</span>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => handleRemoveProduct(index)}
                                                                                                className="text-gray-400 hover:text-red-600 text-xs"
                                                                                                title="Change product"
                                                                                            >
                                                                                                ✕
                                                                                            </button>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <ReactSelect
                                                                                            value={rowProducts.find(p => p.value === entry.productsId) || null}
                                                                                            onChange={(option) => handleProductChange(option, index, entry)}
                                                                                            options={rowProducts}
                                                                                            placeholder={loadingProducts ? "Loading..." : "Select Product"}
                                                                                            isLoading={loadingProducts}
                                                                                            menuPortalTarget={document.body}
                                                                                            styles={{ ...customStyles, menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                                            isClearable
                                                                                        />
                                                                                    )}
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field
                                                                                        type="number"
                                                                                        name={`paymentDetails.${index}.quantity`}
                                                                                        placeholder="1"
                                                                                        min="1"
                                                                                        step="1"
                                                                                        className="w-full py-2 px-3 text-sm rounded border"
                                                                                        onChange={(e) => handleQuantityChange(e, index)}
                                                                                    />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.mrp`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.rate`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                    {isRegularSupplier && entry.gstRate > 0 && (
                                                                                        <span className="text-xs text-gray-500">GST @ {entry.gstRate}%</span>
                                                                                    )}
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.gstAmount`} placeholder="0.00" readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3">
                                                                                    <Field type="number" name={`paymentDetails.${index}.value`} readOnly className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border font-medium" />
                                                                                </td>

                                                                                <td className="border-b py-4 px-3 text-center">
                                                                                    {values.paymentDetails.length > 1 && (
                                                                                        <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
                                                                                            <MdDelete size={22} />
                                                                                        </button>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => push({ id: uuidv4(), productsId: null, mrp: 0, rate: 0, basePrice: 0, gstAmount: 0, gstRate: 0, quantity: 1, value: 0, voucherAmount: 0 })}
                                                            disabled={!values.ledgerId}
                                                            className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium"
                                                        >
                                                            <IoMdAdd size={20} /> Add Row
                                                        </button>

                                                        {/* Summary */}
                                                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="text-lg font-semibold mb-3">Purchase Summary</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-600">Total Quantity</p>
                                                                    <p className="font-medium">{totals.totalQuantity}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Rate (Excl. GST)</p>
                                                                    <p className="font-medium text-blue-600">₹{totals.totalBasePrice}</p>
                                                                    <p className="text-xs text-gray-500">(Goes to Destination Ledger)</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">GST {isRegularSupplier ? '(Input GST Ledger)' : '(not applicable)'}</p>
                                                                    <p className="font-medium text-gray-500">₹{isRegularSupplier ? totals.totalGSTAmount : '0.00'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-600">Owed to Supplier</p>
                                                                    <p className="font-bold text-lg text-primary">
                                                                        ₹{isRegularSupplier ? totals.totalMRP : totals.totalBasePrice}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {/* Narration */}
                                            <div className="mb-4">
                                                <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                                <Field as="textarea" name="narration" placeholder="Narration" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white" />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="flex justify-center mt-4">
                                                <button type="submit" disabled={isSubmitting} className="flex w-[200px] rounded-lg justify-center bg-primary p-3 font-medium text-white hover:bg-opacity-90">
                                                    {isSubmitting ? 'Saving...' : 'Create Voucher'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default CreateVoucherPurchase;
