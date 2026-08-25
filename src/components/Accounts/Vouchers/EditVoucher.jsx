// src/pages/Voucher/EditVoucher.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  FaSave,
  FaArrowLeft,
  FaSpinner,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import ReactSelect from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import {
  customStyles as createCustomStyles,
  EDIT_ENTRY_URL,
  GETPRODUCTS,
} from '../../../Constants/utils';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import useLedger from '../../../hooks/useLedger';

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  const { GetVoucherById, Vouchers } = useVoucher();
  const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();

  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gsttype, setgsttype] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch all products - now separate from main loading
  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${GETPRODUCTS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const productOptions = data.map((product) => ({
          value: product.id,
          label: `${product?.productId || ''} - ${product?.barcode || ''}`,
          price: product?.retailMrp || 0,
          wholesalePrice: product?.wholesalePrice || product?.retailMrp || 0,
          hsnCode: product?.hsnCode || {},
          obj: product,
          fromOrder: false,
        }));
        setAllProducts(productOptions);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const igstLedgers = Ledger.filter(
    (ledg) =>
      ledg?.name &&
      ledg.name.toLowerCase().includes('igst') &&
      !ledg.name.toLowerCase().includes('sale') &&
      !ledg.name.toLowerCase().includes('purchase'),
  );

  const cgstLedgers = Ledger.filter(
    (ledg) =>
      ledg?.name &&
      ledg.name.toLowerCase().includes('cgst') &&
      !ledg.name.toLowerCase().includes('sale') &&
      !ledg.name.toLowerCase().includes('purchase'),
  );

  const sgstLedgers = Ledger.filter(
    (ledg) =>
      ledg?.name &&
      ledg.name.toLowerCase().includes('sgst') &&
      !ledg.name.toLowerCase().includes('sale') &&
      !ledg.name.toLowerCase().includes('purchase'),
  );

  // Create options for ReactSelect
  const igstOptions = igstLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const cgstOptions = cgstLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const sgstOptions = sgstLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  // Fetch voucher data - separate from product loading
  useEffect(() => {
    const fetchVoucherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${EDIT_ENTRY_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch voucher data');
        }

        const data = await response.json();
        console.log(data, '09');

        setVoucherData(data);

        // Fetch ledgers first (these are needed for dropdowns)
        await getLedger();
        await getLedgerIncome();

        // Set initial values from fetched data
        setInitialValues({
          recieptNumber: data.recieptNumber || '',
          date: data.date || new Date().toISOString().split('T')[0],
          ledgerId: data.ledgerId || '',
          narration: data.narration || '',
          amount: data.amount || 0,
          voucherId: data.voucherId || '',
          typeOfVoucher: data.typeOfVoucher || '',
          paymentDate: data.paymentDate || '',
          modeOfPayment: data.modeOfPayment || '',
          chequeNumber: data.chequeNumber || '',
          cardNumber: data.cardNumber || '',
          transactionId: data.transactionId || '',
          cashAmount: data.cashAmount || null,
          cashLedgerId: data.cashLedgerId || null,
          cardAmount: data.cardAmount || null,
          cardLedgerId: data.cardLedgerId || null,
          bankAmount: data.bankAmount || null,
          bankLedgerId: data.bankLedgerId || null,
          chequeAmount: data.chequeAmount || null,
          chequeLedgerId: data.chequeLedgerId || null,
          destinationLedgerId: data.destinationLedgerId || null,
          igstLedgerId: data.igstLedgerId || null,
          cgstLedgerId: data.cgstLedgerId || null,
          sgstLedgerId: data.sgstLedgerId || null,
          discountLedgerId: data.discountLedgerId || null,
          discountAmount: data.discountAmount || 0,
          roundOffLedgerId: data.roundOffLedgerId || null,
          roundOffAmount: data.roundOffAmount || 0,
          courrierLedgerId: data.courrierLedgerId || null,
          courrierAmount: data.courrierAmount || 0,
          totalAmount: data.totalAmount || 0,
          totalGst: data.totalGst || 0,
          totalCgst: data.totalCgst || 0,
          totalSgst: data.totalSgst || 0,
          totalIgst: data.totalIgst || 0,
          paymentReceivedType: data.paymentReceivedType || '',
          amountReceived: data.amountReceived || 0,
          currency: data.currency || 'INR',
          currencyValue: data.currencyValue || 1,
          salesChannel: data.salesChannel || '',
          isExport: data.isExport || false,
          supplierInvoiceNumber: data.supplierInvoiceNumber || '',
          giftVoucherAmount: data.giftVoucherAmount || 0,
          giftVoucherLedgerId: data.giftVoucherLedgerId || null,
          toLedgerId: data.toLedgerId || null,
          currentBalance: data.currentBalance || '',
          currentBalance2: data.currentBalance2 || '',
          orderIds: data.orderIds || [],
          gstRegistration: data.gstRegistration || '',
          locationId: data.locationId || '',
          totalWithoutgst: data.totalWithoutgst || 0,
          isGiftVoucherUsed: data.isGiftVoucherUsed || false,
          customerNewDeliveryShippingAddress:
            data.customerNewDeliveryShippingAddress || '',
          customerNewDeliveryShippingState:
            data.customerNewDeliveryShippingState || '',
          totalDiscountPer: data.totalDiscountPer || null,
          remainingBalance: data.remainingBalance || 0,
          totalCurrencyValue: data.totalCurrencyValue || 0,
          paymentDetails:
            data.paymentDetails && data.paymentDetails.length > 0
              ? data.paymentDetails.map((item) => ({
                  ...item,
                  id: item.id || uuidv4(),
                  gstCalculation: item.gstCalculation || null,
                  quantity: parseFloat(item.quantity) || 1,
                  mrp: parseFloat(item.mrp) || 0,
                  wholesalePrice:
                    parseFloat(item.wholesalePrice) ||
                    parseFloat(item.mrp) ||
                    0,
                  discount: parseFloat(item.discount) || 0,
                  value: parseFloat(item.value) || 0,
                  rate: parseFloat(item.rate) || 0,
                  ...(item.gstCalculation &&
                    !item.gstCalculation.basePrice && {
                      gstCalculation: {
                        ...item.gstCalculation,
                        basePrice:
                          parseFloat(item.mrp) /
                            (1 +
                              parseFloat(item.gstCalculation.igstRate || 0) /
                                100) || parseFloat(item.mrp),
                        ...(item.gstCalculation.type === 'IGST' && {
                          cgstAmount: 0,
                          sgstAmount: 0,
                        }),
                        ...(item.gstCalculation.type === 'CGST+SGST' && {
                          cgstAmount:
                            parseFloat(item.gstCalculation.cgstAmount) || 0,
                          sgstAmount:
                            parseFloat(item.gstCalculation.sgstAmount) || 0,
                          gstAmount: 0,
                        }),
                      },
                    }),
                }))
              : [
                  {
                    id: uuidv4(),
                    productsId: null,
                    orderProductId: null,
                    mrp: 0,
                    basePrice: 0,
                    rate: 0,
                    exclusiveGst: 0,
                    wholesalePrice: 0,
                    discount: 0,
                    quantity: 1,
                    value: 0,
                    voucherAmount: 0,
                    igstRate: 0,
                    gstAmount: 0,
                    gstCalculation: null,
                  },
                ],
        });

        // Mark data as loaded so we can show the page
        setIsDataLoaded(true);

        // Fetch products in the background after page is rendered
        fetchAllProducts();
      } catch (error) {
        console.error('Error fetching voucher:', error);
        toast.error('Failed to load voucher data');
        navigate('/vouchers');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVoucherData();
    }
  }, [id, token]);

  // Calculate GST
  const calculateGST = (
    mrp,
    hsnCode,
    gstRegistration,
    customerAddress,
    discount = 0,
    customerState,
    isExport = false,
    wholesalePrice = null,
  ) => {
    if (isExport) {
      const basePrice = wholesalePrice || mrp;
      const discountAmount = discount > 0 ? (mrp * discount) / 100 : 0;
      const finalPrice = Math.max(basePrice - discountAmount, 0);

      if (typeof setgsttype === 'function') setgsttype('EXPORT');

      return {
        type: 'EXPORT',
        cgstRate: 0,
        sgstRate: 0,
        igstRate: 0,
        basePrice,
        wholesalePrice: wholesalePrice || mrp,
        cgstAmount: 0,
        sgstAmount: 0,
        gstAmount: 0,
        totalGstAmount: 0,
        finalPrice,
        inclusivePrice: finalPrice,
        originalMrp: mrp,
        discountedPrice: finalPrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: false,
        stateName: 'Export',
        usedShippingState: 'export',
      };
    }

    const igstRate = hsnCode?.igst || 0;
    const cgstRate = hsnCode?.cgst || 0;
    const sgstRate = hsnCode?.sgst || 0;
    const totalGstRate = igstRate || cgstRate + sgstRate;
    const basePrice = mrp / (1 + totalGstRate / 100);

    let cgstAmount = 0,
      sgstAmount = 0,
      gstAmount = 0,
      totalGstAmount = 0;

    const registrationCode = String(gstRegistration || '').trim();
    const customerStateCode = String(customerState || '').trim();

    const getStateCode = (state) => {
      const stateStr = String(state || '')
        .toLowerCase()
        .trim();
      if (
        stateStr === '01' ||
        stateStr.includes('jammu') ||
        stateStr.includes('kashmir') ||
        stateStr.includes('srinagar')
      ) {
        return '01';
      }
      if (stateStr === '07' || stateStr.includes('delhi')) {
        return '07';
      }
      return stateStr;
    };

    const registrationStateCode = getStateCode(registrationCode);
    let customerStateToCompare = getStateCode(customerStateCode);

    const isSameState =
      registrationStateCode === customerStateToCompare &&
      (registrationStateCode === '01' || registrationStateCode === '07');

    if (isSameState) {
      cgstAmount = basePrice * (cgstRate / 100);
      sgstAmount = basePrice * (sgstRate / 100);
      totalGstAmount = cgstAmount + sgstAmount;

      if (typeof setgsttype === 'function') setgsttype('SGST+CGST');

      const discountedBasePrice =
        discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const finalPrice = discountedBasePrice + totalGstAmount;

      return {
        type: 'CGST+SGST',
        cgstRate,
        sgstRate,
        igstRate: 0,
        basePrice,
        cgstAmount,
        sgstAmount,
        gstAmount: 0,
        totalGstAmount,
        finalPrice,
        originalMrp: mrp,
        discountedPrice: discountedBasePrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: true,
        registrationStateCode,
        customerStateCode: customerStateToCompare,
        stateName:
          registrationStateCode === '01' ? 'Jammu And Kashmir' : 'Delhi',
      };
    } else {
      gstAmount = basePrice * (igstRate / 100);
      totalGstAmount = gstAmount;

      if (typeof setgsttype === 'function') setgsttype('IGST');

      const discountedBasePrice =
        discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const finalPrice = discountedBasePrice + totalGstAmount;

      return {
        type: 'IGST',
        igstRate,
        cgstRate: 0,
        sgstRate: 0,
        basePrice,
        gstAmount,
        cgstAmount: 0,
        sgstAmount: 0,
        totalGstAmount,
        finalPrice,
        originalMrp: mrp,
        discountedPrice: discountedBasePrice,
        discountApplied: discount > 0,
        discountPercentage: discount,
        isSameState: false,
        registrationStateCode,
        customerStateCode: customerStateToCompare,
        stateName: 'Inter-State',
      };
    }
  };

  // Calculate Rate (MRP - GST)
  const calculateRate = (mrp, gstCalc) => {
    if (!gstCalc) return mrp;
    if (gstCalc.type === 'EXPORT') return gstCalc.wholesalePrice || mrp;

    const gstAmount = gstCalc.totalGstAmount || 0;
    return Math.max(mrp - gstAmount, 0);
  };

  // Calculate line total - Total = Rate × Quantity (after discount)
  const calculateLineTotal = (entry) => {
    const quantity = parseFloat(entry.quantity) || 1;
    const discount = parseFloat(entry.discount) || 0;
    const rate = parseFloat(entry.rate) || parseFloat(entry.mrp) || 0;

    const discountedRate = rate * (1 - discount / 100);
    const totalPerUnit = discountedRate;

    return (totalPerUnit * quantity).toFixed(2);
  };

  // Calculate totals
  const calculateTotals = (values) => {
    let subtotal = 0,
      totalCGST = 0,
      totalSGST = 0,
      totalIGST = 0;
    let totalGST = 0,
      totalDiscount = 0,
      totalMRP = 0,
      totalQuantity = 0;
    let totalBasePrice = 0,
      totalDiscountedBasePrice = 0;
      let totalWithoutGst = 0;

    values.paymentDetails.forEach((entry) => {
      const quantity = parseFloat(entry.quantity) || 1;
      const discount = parseFloat(entry.discount) || 0;
      const mrp = parseFloat(entry.mrp) || 0;
      const rate = parseFloat(entry.rate) || mrp;
      const gstCalc = entry.gstCalculation;

      totalMRP += mrp * quantity;
      totalQuantity += quantity;

      if (!gstCalc) {
        const discountedRate = rate * (1 - discount / 100);
        subtotal += discountedRate * quantity;
        totalDiscount += (rate - discountedRate) * quantity;
         totalWithoutGst += discountedRate * quantity;
        return;
      }

      const basePrice =
        gstCalc.basePrice || mrp / (1 + (gstCalc.igstRate || 0) / 100);

      const discountAmount = (rate * discount) / 100;
      const discountedRate = rate - discountAmount;

      let cgstPerUnit = 0,
        sgstPerUnit = 0,
        igstPerUnit = 0;

      if (gstCalc.type === 'CGST+SGST') {
        cgstPerUnit =
          gstCalc.cgstAmount || (basePrice * (gstCalc.cgstRate || 0)) / 100;
        sgstPerUnit =
          gstCalc.sgstAmount || (basePrice * (gstCalc.sgstRate || 0)) / 100;
        totalCGST += cgstPerUnit * quantity;
        totalSGST += sgstPerUnit * quantity;
        totalGST += (cgstPerUnit + sgstPerUnit) * quantity;
      } else if (gstCalc.type === 'IGST') {
        igstPerUnit =
          gstCalc.gstAmount || (basePrice * (gstCalc.igstRate || 0)) / 100;
        totalIGST += igstPerUnit * quantity;
        totalGST += igstPerUnit * quantity;
      }

      subtotal += discountedRate * quantity;
      totalDiscount += discountAmount * quantity;
      totalBasePrice += basePrice * quantity;
      totalDiscountedBasePrice += basePrice * (1 - discount / 100) * quantity;
      totalWithoutGst = subtotal;
    });

    const grandTotal = parseFloat(subtotal) + parseFloat(totalGST);

    return {
      subtotal: subtotal.toFixed(2),
      totalCGST: totalCGST.toFixed(2),
      totalSGST: totalSGST.toFixed(2),
      totalIGST: totalIGST.toFixed(2),
      totalGST: totalGST.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalMRP: totalMRP.toFixed(2),
      totalQuantity: totalQuantity,
      totalBasePrice: totalBasePrice.toFixed(2),
      totalDiscountedBasePrice: totalDiscountedBasePrice.toFixed(2),
      totalWithoutGst: totalWithoutGst.toFixed(2),
    };
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const totals = calculateTotals(values);

      const submissionData = {
        ...values,
        amount: parseFloat(totals.grandTotal),
        totalAmount: parseFloat(totals.grandTotal),
        totalGst: parseFloat(totals.totalGST),
        totalCgst: parseFloat(totals.totalCGST),
        totalSgst: parseFloat(totals.totalSGST),
        totalIgst: parseFloat(totals.totalIGST),
        discountAmount: parseFloat(totals.totalDiscount),
        totalWithoutgst: parseFloat(totals.subtotal),
        userName:currentUser?.user?.username,
        role:currentUser?.user.authorities[0].authority
      };

      const response = await fetch(`${EDIT_ENTRY_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update voucher');
      }

      toast.success('Voucher updated successfully!');
      navigate('/vouchers/view');
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error(error.message || 'Failed to update voucher');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Get filtered ledgers
  const getFilteredLedgers = () => {
    if (!Ledger) return [];
    if (Vouchers?.typeOfVoucher?.toLowerCase() === 'purchase') {
      return Ledger.filter((ledg) => ledg?.ledgerType === 'SUPPLIER');
    } else if (Vouchers?.typeOfVoucher?.toLowerCase() === 'sales') {
      return Ledger.filter((ledg) => ledg?.ledgerType === 'CUSTOMER');
    } else {
      return Ledger;
    }
  };

  const LedgerData = getFilteredLedgers()?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
    obj: ledg,
    balance: ledg?.openingBalances,
    type: ledg.ledgerType,
  }));

  const destinationledger = LedgerIncome.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  // Get product value
  const getProductValue = (productId) => {
    if (!productId) return null;
    return allProducts.find((p) => p.value === productId) || null;
  };

  // If still loading the main data (voucher + ledgers), show loading
  if (loading || !isDataLoaded) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading voucher...
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!initialValues) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500">Voucher not found</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Entry Payment" />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* Header */}
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
              Edit Entry Payment #{voucherData?.recieptNumber || id}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              {voucherData?.typeOfVoucher || 'Voucher'} - Update product lines
              only
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col p-6.5">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                recieptNumber: Yup.string().required(
                  'Voucher number is required',
                ),
                ledgerId: Yup.string().required('Party account is required'),
              })}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue, values }) => {
                const totals = calculateTotals(values);

                return (
                  <Form>
                    {/* Read-Only Fields Section */}
                    <div className="mb-4.5 flex flex-col gap-6">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Voucher Information (Read-Only)
                      </h3>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Voucher Number
                          </label>
                          <Field
                            type="text"
                            name="recieptNumber"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Date
                          </label>
                          <Field
                            type="text"
                            name="date"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Party Account
                          </label>
                          <Field
                            type="text"
                            name="ledgerId"
                            value={
                              LedgerData?.find(
                                (l) => l.value === values.ledgerId,
                              )?.label || 'N/A'
                            }
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Type of Voucher
                          </label>
                          <Field
                            type="text"
                            name="typeOfVoucher"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Sales Channel
                          </label>
                          <Field
                            type="text"
                            name="salesChannel"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Currency
                          </label>
                          <Field
                            type="text"
                            name="currency"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Narration
                          </label>
                          <Field
                            type="text"
                            name="narration"
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>

                        <div className="flex-1 min-w-[180px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Amount
                          </label>
                          <Field
                            type="text"
                            name="amount"
                            value={totals.grandTotal}
                            className="w-full rounded border-[1.5px] border-stroke bg-gray-100 dark:bg-gray-800 py-3 px-5 text-black dark:text-white font-bold cursor-not-allowed outline-none transition dark:border-form-strokedark"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-2 min-w-[250px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Destination Ledger
                          </label>
                          <ReactSelect
                            name="destinationLedgerId"
                            value={destinationledger.find(
                              (opt) => opt.value === values.destinationLedgerId,
                            )}
                            options={destinationledger}
                            className="react-select-container bg-white dark:bg-form-Field w-full"
                            classNamePrefix="react-select"
                            placeholder="Select Ledger"
                            menuPortalTarget={document.body}
                            styles={{
                              ...customStyles,
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 100000,
                              }),
                            }}
                          />
                          <ErrorMessage
                            name="destinationledgerId"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4 animate-fadeIn">
                          {/* IGST Ledger */}
                          <div className="flex-1 min-w-[250px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              IGST Ledger
                            </label>
                            <ReactSelect
                              name="igstLedgerId"
                              value={igstOptions.find(
                                (opt) => opt.value === values.igstLedgerId,
                              )}
                              options={igstOptions}
                              className="react-select-container bg-white dark:bg-form-Field w-full"
                              classNamePrefix="react-select"
                              placeholder="Select IGST Ledger"
                              menuPortalTarget={document.body}
                              styles={{
                                ...customStyles,
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 100000,
                                }),
                              }}
                            />
                          </div>

                          {/* CGST Ledger */}
                          <div className="flex-1 min-w-[250px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              CGST Ledger
                            </label>
                            <ReactSelect
                              name="cgstLedgerId"
                              value={cgstOptions.find(
                                (opt) => opt.value === values.cgstLedgerId,
                              )}
                              options={cgstOptions}
                              className="react-select-container bg-white dark:bg-form-Field w-full"
                              classNamePrefix="react-select"
                              placeholder="Select CGST Ledger"
                              menuPortalTarget={document.body}
                              styles={{
                                ...customStyles,
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 100000,
                                }),
                              }}
                            />
                          </div>

                          {/* SGST Ledger */}
                          <div className="flex-1 min-w-[250px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              SGST Ledger
                            </label>
                            <ReactSelect
                              name="sgstLedgerId"
                              value={sgstOptions.find(
                                (opt) => opt.value === values.sgstLedgerId,
                              )}
                              options={sgstOptions}
                              className="react-select-container bg-white dark:bg-form-Field w-full"
                              classNamePrefix="react-select"
                              placeholder="Select SGST Ledger"
                              menuPortalTarget={document.body}
                              styles={{
                                ...customStyles,
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 100000,
                                }),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products Section - Editable */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
                        Products (Editable)
                        {loadingProducts && (
                          <span className="ml-2 text-xs text-gray-400">
                            <FaSpinner className="animate-spin inline mr-1" />
                            Loading
                          </span>
                        )}
                      </h3>
                      <FieldArray name="paymentDetails">
                        {({ push, remove }) => (
                          <div>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      #
                                    </th>
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 min-w-[200px]">
                                      Product
                                    </th>
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      MRP
                                    </th>
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      Rate
                                    </th>
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      Qty
                                    </th>
                                    {
                                      voucherData?.typeOfVoucher.toLowerCase()==="sales"?
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      Discount %
                                    </th>:null
                                    }
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      Total
                                    </th>
                                    <th className="py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.paymentDetails.map((entry, index) => {
                                    const calculatedRate = calculateRate(
                                      entry.mrp,
                                      entry.gstCalculation,
                                    );

                                    return (
                                      <tr
                                        key={entry.id || index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                      >
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark text-sm">
                                          {index + 1}
                                        </td>
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark min-w-[200px]">
                                          <ReactSelect
                                            name={`paymentDetails.${index}.productsId`}
                                            value={getProductValue(
                                              entry.productsId,
                                            )}
                                            onChange={(option) => {
                                              if (!option) {
                                                setFieldValue(
                                                  `paymentDetails.${index}.productsId`,
                                                  null,
                                                );
                                                setFieldValue(
                                                  `paymentDetails.${index}.mrp`,
                                                  0,
                                                );
                                                setFieldValue(
                                                  `paymentDetails.${index}.rate`,
                                                  0,
                                                );
                                                setFieldValue(
                                                  `paymentDetails.${index}.gstCalculation`,
                                                  null,
                                                );
                                                setFieldValue(
                                                  `paymentDetails.${index}.value`,
                                                  0,
                                                );
                                                return;
                                              }

                                              const mrp = option?.price || 0;
                                              const wholesalePrice =
                                                option?.wholesalePrice || mrp;
                                              const hsnCode =
                                                option?.hsnCode || {};
                                              const isExport =
                                                values.isExport || false;

                                              const gstCalculation =
                                                calculateGST(
                                                  mrp,
                                                  hsnCode,
                                                  '',
                                                  '',
                                                  0,
                                                  '',
                                                  isExport,
                                                  wholesalePrice,
                                                );

                                              const rate = calculateRate(
                                                mrp,
                                                gstCalculation,
                                              );

                                              setFieldValue(
                                                `paymentDetails.${index}.productsId`,
                                                option?.value,
                                              );
                                              setFieldValue(
                                                `paymentDetails.${index}.mrp`,
                                                mrp,
                                              );
                                              setFieldValue(
                                                `paymentDetails.${index}.rate`,
                                                rate,
                                              );
                                              setFieldValue(
                                                `paymentDetails.${index}.gstCalculation`,
                                                gstCalculation,
                                              );

                                              const currentQuantity =
                                                parseFloat(entry.quantity) || 1;
                                              const currentDiscount =
                                                parseFloat(entry.discount) || 0;
                                              const lineTotal =
                                                calculateLineTotal({
                                                  ...entry,
                                                  rate,
                                                  discount: currentDiscount,
                                                  quantity: currentQuantity,
                                                });
                                              setFieldValue(
                                                `paymentDetails.${index}.value`,
                                                lineTotal,
                                              );
                                            }}
                                            options={allProducts}
                                            placeholder={
                                              loadingProducts
                                                ? 'Loading'
                                                : 'Select Product'
                                            }
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            menuPortalTarget={document.body}
                                            styles={{
                                              ...customStyles,
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 100000,
                                              }),
                                            }}
                                            isClearable
                                            isDisabled={loadingProducts}
                                            isLoading={loadingProducts}
                                          />
                                        </td>
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                          <Field
                                            type="number"
                                            name={`paymentDetails.${index}.mrp`}
                                            className="w-full rounded border-[1.5px] border-stroke bg-gray-50 dark:bg-gray-800 py-2 px-3 text-sm text-black dark:text-white outline-none transition dark:border-form-strokedark"
                                            readOnly
                                          />
                                        </td>
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                          <Field
                                            type="number"
                                            name={`paymentDetails.${index}.rate`}
                                            className="w-full rounded border-[1.5px] border-stroke bg-gray-50 dark:bg-gray-800 py-2 px-3 text-sm text-black dark:text-white outline-none transition dark:border-form-strokedark"
                                            readOnly
                                            value={entry.rate || calculatedRate}
                                          />
                                        </td>
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                          <Field
                                            type="number"
                                            name={`paymentDetails.${index}.quantity`}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-black dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:focus:border-primary"
                                            min="1"
                                            onChange={(e) => {
                                              const value =
                                                parseFloat(e.target.value) || 1;
                                              setFieldValue(
                                                `paymentDetails.${index}.quantity`,
                                                value,
                                              );
                                              const currentDiscount =
                                                parseFloat(entry.discount) || 0;
                                              const lineTotal =
                                                calculateLineTotal({
                                                  ...entry,
                                                  quantity: value,
                                                  discount: currentDiscount,
                                                });
                                              setFieldValue(
                                                `paymentDetails.${index}.value`,
                                                lineTotal,
                                              );
                                            }}
                                          />
                                        </td>
                                        {
                                          voucherData?.typeOfVoucher.toLowerCase()==="sales"?
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                          <Field
                                            type="number"
                                            name={`paymentDetails.${index}.discount`}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm text-black dark:text-white outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:focus:border-primary"
                                            min="0"
                                            max="100"
                                            onChange={(e) => {
                                              const value =
                                                parseFloat(e.target.value) || 0;
                                              setFieldValue(
                                                `paymentDetails.${index}.discount`,
                                                value,
                                              );

                                              const lineTotal =
                                                calculateLineTotal({
                                                  ...entry,
                                                  discount: value,
                                                  quantity: entry.quantity || 1,
                                                });
                                              setFieldValue(
                                                `paymentDetails.${index}.value`,
                                                lineTotal,
                                              );
                                            }}
                                          />
                                        </td>:null
                                        }
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark font-medium">
                                          <Field
                                            type="text"
                                            name={`paymentDetails.${index}.value`}
                                            className="w-full rounded border-[1.5px] border-stroke bg-gray-50 dark:bg-gray-800 py-2 px-3 text-sm text-black dark:text-white outline-none transition dark:border-form-strokedark"
                                            readOnly
                                          />
                                        </td>
                                        <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              remove(index);
                                              setTimeout(() => {
                                                const newTotals =
                                                  calculateTotals(values);
                                                setFieldValue(
                                                  'amount',
                                                  parseFloat(
                                                    newTotals.grandTotal,
                                                  ),
                                                );
                                              }, 0);
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            disabled={
                                              values.paymentDetails.length === 1
                                            }
                                          >
                                            <IoMdRemove
                                              size={22}
                                              className="text-red-500 hover:text-red-700"
                                            />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newEntry = {
                                  id: uuidv4(),
                                  productsId: null,
                                  mrp: 0,
                                  rate: 0,
                                  wholesalePrice: 0,
                                  discount: 0,
                                  quantity: 1,
                                  value: 0,
                                  gstCalculation: null,
                                };
                                push(newEntry);
                                setTimeout(() => {
                                  const newTotals = calculateTotals(values);
                                  setFieldValue(
                                    'amount',
                                    parseFloat(newTotals.grandTotal),
                                  );
                                }, 0);
                              }}
                              className="mt-3 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                            >
                              <IoMdAdd size={20} /> Add Product
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold mb-3 text-black dark:text-white">
                        Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total MRP
                          </p>
                          <p className="text-lg font-bold text-black dark:text-white">
                            ₹{totals.totalMRP}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total Discount
                          </p>
                          <p className="text-lg font-bold text-red-500">
                            -₹{totals.totalDiscount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Subtotal
                          </p>
                          <p className="text-lg font-bold text-black dark:text-white">
                            ₹{totals.subtotal}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total GST
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{totals.totalGST}
                          </p>
                        </div>
                        {parseFloat(totals.totalCGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              CGST
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              ₹{totals.totalCGST}
                            </p>
                          </div>
                        )}
                        {parseFloat(totals.totalSGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SGST
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              ₹{totals.totalSGST}
                            </p>
                          </div>
                        )}
                        {parseFloat(totals.totalIGST) > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              IGST
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              ₹{totals.totalIGST}
                            </p>
                          </div>
                        )}
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Grand Total
                          </p>
                          <p className="text-lg font-bold text-primary">
                            ₹{totals.grandTotal}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            (Subtotal + GST)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex md:w-[190px] w-[190px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Update
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate('/vouchers')}
                        className="flex md:w-[170px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-gray-300 dark:bg-gray-700 md:p-2.5 font-medium md:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditVoucher;
