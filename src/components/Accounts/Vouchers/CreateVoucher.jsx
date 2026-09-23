import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  useFormik,
} from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import {
  ADD_CUSTOMER_URL,
  BASE_URL,
  GETPRODUCTBYSUPPLIER,
  GETPRODUCTS,
  GET_INVENTORYLOCATION,
  GET_VoucherNos_URL,
  customStyles as createCustomStyles,
} from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import Modall from '../../Products/Modall';
import NumberingDetailsModal from './NumberingDetailsModal';
import { useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { use } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Modalll from '../../Order/Modallll';

const CreateVoucher = () => {
  const { id } = useParams();

  const [showGSTLedgers, setShowGSTLedgers] = useState(false);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const { GetVoucherById, Vouchers, CreateVoucherEntry, handleCreateVoucher } =
    useVoucher();
  const [voucherNos, setvoucherNos] = useState([]);
  const { getLedger, Ledger, getLedgerIncome, LedgerIncome } = useLedger();
  const theme = useSelector((state) => state?.persisted?.theme);
  const [vaaluee, setvaaluee] = useState({});
  const customStyles = createCustomStyles(theme?.mode);
  const [ledgers, setLedgers] = useState([]);
  const [openingbalance2, setopeningbalance2] = useState(0);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [isCustModelOpen, setisCustModelOpen] = useState(false);

  const [selectedOrder, setselectedOrder] = useState(null);

  const [regType, setregType] = useState('');
  const [isPaymentInParts, setIsPaymentInParts] = useState(false);

  const [availableProducts, setAvailableProducts] = useState([]);

  const [availableOrders, setavailableOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setloadingOrders] = useState(false);
  const [isExport, setisExport] = useState(false);
  const [gsttype, setgsttype] = useState('');
  const [newCustomerName, setnewCustomerName] = useState('');
  const [custaddress, setcustaddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [openingBalanceType, setOpeningBalanceType] = useState('DEBIT');
  const [openingBalance, setOpeningBalance] = useState('');

  const [addingNewProduct, setAddingNewProduct] = useState(false);
  const [newProductRowIndex, setNewProductRowIndex] = useState(null);

  const [newShippingState, setnewShippingState] = useState('');


  // Filter ledgers based on voucher type
  const getFilteredLedgers = () => {
    if (!Ledger) return [];

    if (Vouchers?.typeOfVoucher?.toLowerCase() === 'purchase') {
      // For Purchase - show only suppliers (ledgers with supplier data)
      return Ledger.filter((ledg) => ledg?.ledgerType == 'SUPPLIER');
    } else if (Vouchers?.typeOfVoucher?.toLowerCase() === 'sales') {
      // For Sales - show only customers (ledgers without supplier data)
      return Ledger.filter((ledg) => ledg?.ledgerType == 'CUSTOMER');
    } else {
      // For other voucher types (Payment, Contra) - show all ledgers
      return Ledger;
    }
  };

  const LedgerData = getFilteredLedgers()?.map((ledg) => ({
    value: ledg?.id,
    supplierId: ledg?.supplier ? ledg.supplier.id : null,
    customerId: ledg?.customer ? ledg.customer.id : null,
    label: ledg?.name,
    obj: ledg,
    balance: ledg?.openingBalances,
    type: ledg.ledgerType,
    isSupplier: ledg?.supplier !== null,
  }));

  const giftvoucherledgers = Ledger.filter(
    (ledg) => ledg?.ledgerType === 'GIFTVOUCHER',
  );

  const giftledgOptions = giftvoucherledgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  //bank ledgers Only
  const BankLedgers = Ledger.filter(
    (ledg) => ledg?.name && ledg.name.toLowerCase().includes('bank'),
  );

  const cardLedgers = Ledger.filter(
    (ledg) =>
      ledg?.name &&
      (ledg.name.toLowerCase().includes('visa') ||
        ledg.name.toLowerCase().includes('amex')),
  );

  const cardData = cardLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const bankData = BankLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const CashLedgers = Ledger.filter(
    (ledg) => ledg?.name && ledg.name.toLowerCase().includes('cash'),
  );
  const cashData = CashLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const cashLedgerId = CashLedgers.length > 0 ? CashLedgers[0].id : null;

  const destinationledger = LedgerIncome.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const discountLedgers = Ledger.filter(
    (ledg) => ledg?.name && ledg.name.toLowerCase().includes('dis'),
  );

  const discountData = discountLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const roundOffLedgers = Ledger.filter(
    (ledg) => ledg?.name && ledg.name.toLowerCase().includes('round'),
  );

  const roundOffData = roundOffLedgers?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  const courrierLedgerIds = Ledger.filter(
    (ledg) => ledg?.name && ledg.name.toLowerCase().includes('cour'),
  );

  const courrierData = courrierLedgerIds?.map((ledg) => ({
    value: ledg?.id,
    label: ledg?.name,
  }));

  useEffect(() => {
    GetVoucherById(id);
    getLedger();
    getLedgerIncome();
  }, []);

  const stateOption = [
    { value: '01', label: 'Jammu & Kashmir' },
    { value: '02', label: 'Himachal Pradesh' },
    { value: '03', label: 'Punjab' },
    { value: '04', label: 'Chandigarh' },
    { value: '05', label: 'Uttarakhand' },
    { value: '06', label: 'Haryana' },
    { value: '07', label: 'Delhi' },
    { value: '08', label: 'Rajasthan' },
    { value: '09', label: 'Uttar Pradesh' },
    { value: '10', label: 'Bihar' },
    { value: '11', label: 'Sikkim' },
    { value: '12', label: 'Arunachal Pradesh' },
    { value: '13', label: 'Nagaland' },
    { value: '14', label: 'Manipur' },
    { value: '15', label: 'Mizoram' },
    { value: '16', label: 'Tripura' },
    { value: '17', label: 'Meghalaya' },
    { value: '18', label: 'Assam' },
    { value: '19', label: 'West Bengal' },
    { value: '20', label: 'Jharkhand' },
    { value: '21', label: 'Odisha' },
    { value: '22', label: 'Chhattisgarh' },
    { value: '23', label: 'Madhya Pradesh' },
    { value: '24', label: 'Gujarat' },
    { value: '25', label: 'Daman & Diu' },
    { value: '26', label: 'Dadra & Nagar Haveli' },
    { value: '27', label: 'Maharashtra' },
    { value: '28', label: 'Andhra Pradesh' },
    { value: '29', label: 'Karnataka' },
    { value: '30', label: 'Goa' },
    { value: '31', label: 'Lakshadweep' },
    { value: '32', label: 'Kerala' },
    { value: '33', label: 'Tamil Nadu' },
    { value: '34', label: 'Puducherry' },
    { value: '35', label: 'Andaman & Nicobar Islands' },
    { value: '36', label: 'Telangana' },
    { value: '37', label: 'Andhra Pradesh (New)' },
    { value: '38', label: 'Ladakh' },
  ];

  // for gst
  // GST Ledgers filtering
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

  const handleOrderSelect = async (option) => {
    setselectedOrder(option);
    setAvailableProducts([]);

    try {
      const response = await fetch(
        `${BASE_URL}/order/order-products/by-order-ids?orderIds=${option}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log(data, 'jakata');

      if (response.ok && Array.isArray(data)) {
        const productOptions = data.map((prod) => ({
          value: prod.id,
          orderProdId: prod.id,
          label: prod.product?.productId,
          price: prod.product?.retailMrp,
          wholesalePrice: prod.product?.wholesalePrice,
          hsnCode: prod.product?.hsnCode || '',
          obj: prod,
          fromOrder: false,
        }));
        setAvailableProducts(productOptions);
      }
    } catch (error) {
      console.error('Error fetching customer products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const modeOfpayment = [
    {
      value: 'Cash',
      label: 'Cash',
    },
    {
      value: 'Card',
      label: 'Card',
    },
    {
      value: 'Cheque',
      label: 'Cheque',
    },
    {
      value: 'Bank Transfer',
      label: 'Bank Transfer',
    },
  ];

  const PaymentReceiveType = [
    {
      value: 'Credit',
      label: 'Credit',
    },
    {
      value: 'Partially',
      label: 'Partially',
    },
    {
      value: 'Fully',
      label: 'Fully',
    },
  ];

  const handleLedgerSelect = async (option) => {
    setSelectedLedger(option);
    setavailableOrders([]);

    if (Vouchers?.typeOfVoucher === 'Purchase' && option) {
      setloadingOrders(true);
      try {
        const supplierId = option.obj.supplierId;
        const response = await fetch(
          `${BASE_URL}/order/by-type?id=${supplierId}&type=supplier`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const orderOptions = data.map((ord) => ({
            value: ord.orderId,
            label: ord.orderNumber,

            obj: ord,
          }));
          setavailableOrders(orderOptions);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    } else if (Vouchers?.typeOfVoucher === 'Sales' && option) {
      // For Sales - fetch customer products
      setloadingOrders(true);
      try {
        const customerId = option?.obj.customerId;
        const response = await fetch(
          `${BASE_URL}/order/by-type?id=${customerId}&type=customer`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const orderOptions = data.map((ord) => ({
            value: ord.orderId,
            label: ord.orderNumber,

            obj: ord,
          }));
          setavailableOrders(orderOptions);
        }
      } catch (error) {
        console.error('Error fetching customer products:', error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const getUsedproductsIds = (values, currentIndex) => {
    return values.paymentDetails
      .filter((_, index) => index !== currentIndex)
      .map((item) => item.productsId)
      .filter(Boolean);
  };

  const getAvailableProductsForRow = (values, currentIndex) => {
    const usedproductsIds = getUsedproductsIds(values, currentIndex);
    return availableProducts.filter(
      (product) => !usedproductsIds.includes(product.value),
    );
  };

  const calculateLineTotal = (entry) => {
    const quantity = entry.quantity || 1;
    const discount = entry.discount || 0;

    let rate = entry.rate || 0;
    if (rate === 0 && entry.mrp && entry.gstCalculation) {
      const totalGstAmount = entry.gstCalculation.totalGstAmount || 0;
      rate = Math.max(entry.mrp - totalGstAmount, 0);
    }
    const discountedRate = rate * (1 - discount / 100);
    return (discountedRate * quantity).toFixed(2);
  };

  const calculateLineTotalForPur = (entry) => {
    // Use exclusiveGst (price including GST) as the rate for Purchase too
    const basePrice = entry.exclusiveGst || entry.rate || entry.mrp || 0;
    const quantity = entry.quantity || 1;
    return (basePrice * quantity).toFixed(2);
  };

  // Calculate totals for the summary
  const calculateTotals = (values) => {
  let subtotal = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalGST = 0;
  let grandTotal = 0;
  let totalDiscount = 0;
  let totalDiscountPer = 0;
  let totalMRP = 0;
  let totalQuantity = 0;
  let totalBasePrice = 0;
  let totalDiscountedBasePrice = 0;

  values.paymentDetails.forEach((entry) => {
    const basePrice = entry.gstCalculation?.basePrice || 0;
    const discount = entry.discount || 0;
    const quantity = entry.quantity || 1;

    // Use rate (exclusive of GST) for subtotal
    const rate = entry.rate || entry.mrp || 0;
    const discountedRate = rate * (1 - discount / 100);
    const discountedRateTotal = discountedRate * quantity;

    // Calculate base price total (without discount)
    const basePriceTotal = basePrice * quantity;
    totalBasePrice += basePriceTotal;

    // Calculate discount amount
    const discountAmount = ((rate * discount) / 100) * quantity;
    totalDiscount += discountAmount;

    // Calculate MRP total
    const mrpTotal = (entry.mrp || 0) * quantity;
    totalMRP += mrpTotal;

    // Calculate total quantity
    totalQuantity += quantity;

    // Calculate GST amounts (GST is on base price before discount)
    if (entry.gstCalculation) {
      if (entry.gstCalculation.type === 'CGST+SGST') {
        const cgstAmount = (entry.gstCalculation.cgstAmount || 0) * quantity;
        const sgstAmount = (entry.gstCalculation.sgstAmount || 0) * quantity;
        totalCGST += cgstAmount;
        totalSGST += sgstAmount;
        totalGST += cgstAmount + sgstAmount;
      } else if (entry.gstCalculation.type === 'IGST') {
        const igstAmount = (entry.gstCalculation.gstAmount || 0) * quantity;
        totalIGST += igstAmount;
        totalGST += igstAmount;
      }
    }

    // Subtotal is the discounted rate (exclusive of GST)
    subtotal += discountedRateTotal;
    totalDiscountedBasePrice += discountedRateTotal;
  });

  // Grand Total = Subtotal + GST
  grandTotal = subtotal + totalGST;

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
  };
};

  const validationSchema = Yup.object().shape({
    recieptNumber: Yup.string().required('Voucher number is required'),
    // supplierInvoiceNumber: Yup.string().required('Supplier invoice number is required'),
    // date: Yup.date().required('Date is required'),
    ledgerId: Yup.string().required('Party account is required'),
  });

  const GetVoucherNos = async () => {
    try {
      const response = await fetch(`${GET_VoucherNos_URL}/${Vouchers.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Simple and direct approach
        setvoucherNos(data.nextReceipt);
        return data.nextReceipt;
      } else {
        toast.error(data.errorMessage || 'Error');
        setvoucherNos([]);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
      return null;
    }
  };

  useEffect(() => {
    // Only call GetVoucherNos when Vouchers.id is available
    if (Vouchers?.id) {
      GetVoucherNos();
    }
  }, [Vouchers.id]);

  // Get placeholder text for party account based on voucher type
  const getPartyAccountPlaceholder = () => {
    switch (Vouchers?.typeOfVoucher) {
      case 'Purchase':
        return 'Select Supplier';
      case 'Sales':
        return 'Select Customer';
      default:
        return 'Select Ledger';
    }
  };

  // Get label text for party account based on voucher type
  const getPartyAccountLabel = () => {
    switch (Vouchers?.typeOfVoucher) {
      case 'Purchase':
        return 'Supplier Account';
      case 'Sales':
        return 'Customer Account';
      default:
        return 'Party Account Name';
    }
  };

  const [paymentMethods, setPaymentMethods] = useState([]);

  // Helper functions for multiple payment methods
  const addPaymentMethod = (defaultMode = '') => {
    const newMethod = {
      mode: defaultMode,
      amount: '',
      bankId: '',
      chequeNumber: '',
      transactionId: '',
      cardNumber: '',
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const removePaymentMethod = (index) => {
    const newMethods = [...paymentMethods];
    newMethods.splice(index, 1);
    setPaymentMethods(newMethods);
    // Update Formik fields after removal
    updateFormikFieldsFromPaymentMethods();
  };

  const updatePaymentMethod = (index, field, value) => {
    const newMethods = [...paymentMethods];
    newMethods[index] = { ...newMethods[index], [field]: value };
    setPaymentMethods(newMethods);
  };

  const calculateTotalAllocatedPayments = () => {
    return paymentMethods.reduce((total, payment) => {
      return total + (parseFloat(payment.amount) || 0);
    }, 0);
  };

  const isPaymentAllocationValid = (amountReceived) => {
    const totalAmount = parseFloat(amountReceived) || 0;
    const totalAllocated = calculateTotalAllocatedPayments();
    return Math.abs(totalAllocated - totalAmount) < 0.01;
  };

  const getBalanceColor = (amountReceived) => {
    const balance =
      (parseFloat(amountReceived) || 0) - calculateTotalAllocatedPayments();
    if (Math.abs(balance) < 0.01)
      return 'text-green-600 dark:text-green-400 font-semibold';
    if (balance > 0)
      return 'text-yellow-600 dark:text-yellow-400 font-semibold';
    return 'text-red-600 dark:text-red-400 font-semibold';
  };

  const salesChannel = [
    { value: 'WS-Domestic', label: 'WS-Domestic' },
    { value: 'Websale', label: 'Websale' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Shop-in-Shop', label: 'Shop-in-Shop' },
    { value: 'WS-International', label: 'WS-International' },
    { value: 'Event-International', label: 'Event-International' },
    { value: 'Event-Domestic', label: 'Event-Domestic' },
    { value: 'Retail-Delhi', label: 'Retail-Delhi' },
    { value: 'Retail-SXR', label: 'Retail-SXR' },
  ];

  const currencies = [
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'AED', label: 'AED - UAE Dirham' },
  ];

  const [allProducts, setAllProducts] = useState([]);
  const [loadingAllProducts, setLoadingAllProducts] = useState(false);

  // Function to fetch all products
  const fetchAllProducts = async () => {
    if (loadingAllProducts) return; // Prevent multiple calls

    setLoadingAllProducts(true);
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

      // Check if data is ready and valid
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

        // Only set state when data is fully processed
        setAllProducts(productOptions);
      } else if (data && Array.isArray(data) && data.length === 0) {
        // Handle empty response
        setAllProducts([]);
        toast.info('No products found');
      } else {
        // Handle invalid response structure
        console.error('Unexpected data structure:', data);
        setAllProducts([]);
        toast.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
      toast.error('Failed to load all products');
      setAllProducts([]);
    } finally {
      setLoadingAllProducts(false);
    }
  };

  // Call this function when component mounts or when needed
  useEffect(() => {
    // Preload all products when component mounts for faster access later
    if (
      Vouchers?.typeOfVoucher === 'Sales' ||
      Vouchers?.typeOfVoucher === 'Purchase'
    ) {
      fetchAllProducts();
    }
  }, [Vouchers?.typeOfVoucher]);

  // Updated helper function to get all products for "Add New Product" rows
  const getAllAvailableProducts = (rowProducts, values, currentIndex) => {
    const usedProductsIds = getUsedproductsIds(values, currentIndex);

    // Filter out already used products from all products
    const availableAllProducts = allProducts.filter(
      (product) => !usedProductsIds.includes(product.value),
    );

    // Combine order products with available all products
    const orderProducts = rowProducts.filter((p) => p.fromOrder);
    const nonOrderAllProducts = availableAllProducts.filter(
      (allProduct) =>
        !orderProducts.some((op) => op.value === allProduct.value),
    );

    return [
      ...orderProducts.map((op) => ({ ...op, isOrderProduct: true })),
      ...nonOrderAllProducts.map((p) => ({
        ...p,
        isOrderProduct: false,
        label: `${p.label} (new)`,
      })),
    ];
  };

  const [SelectedINVENTORYData, setSelectedINVENTORYData] = useState([]);
  const [isINVENTORYModalOpen, setIsINVENTORYModalOpen] = useState(false);

  const openINVENTORYModal = (id) => {
    const getInventory = async () => {
      try {
        const response = await fetch(`${GET_INVENTORYLOCATION}/${id}`, {
          method: 'GET',
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // setLocation(data);
        setSelectedINVENTORYData(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Product');
      }
    };

    getInventory();
    setIsINVENTORYModalOpen(true);
  };

  const closeINVENTORYModal = () => {
    setIsINVENTORYModalOpen(false);
    setSelectedINVENTORYData(null);
  };

  const getInventoryByLocation = async () => {
    try {
      const response = await fetch(`${GET_INVENTORYLOCATION}/${id}`, {
        method: 'GET',
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // setLocation(data);
      setSelectedINVENTORYData(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch Product');
    }
  };

  const calculateGrandTotalWithAdjustments = (values, totals) => {
    const discountAmount = parseFloat(values.discountAmount) || 0;
    const roundOffAmount = parseFloat(values.roundOffAmount) || 0;
    const courrierAmount = parseFloat(values.courrierAmount) || 0;
    const giftVoucherAmount = parseFloat(values.giftVoucherAmount) || 0;

    // Start with subtotal from products
    let grandTotal = parseFloat(totals.subtotal) || 0;

    // Apply adjustments
    grandTotal = grandTotal - discountAmount; // Subtract discount
    grandTotal = grandTotal - roundOffAmount; // Add round off (could be negative)
    grandTotal = grandTotal + courrierAmount; // Add courrier charges
    grandTotal = grandTotal - giftVoucherAmount; // Subtract gift voucher

    return grandTotal >= 0 ? grandTotal : 0;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Configurator/Create Voucher" />
      <div>
        <Formik
          initialValues={{
            recieptNumber: `${voucherNos}`,
            supplierInvoiceNumber: '',
            date: '' || today,
            voucherId: Number(id),
            formAction: '',
            paymentDate: '',
            ledgerId: '',
            orderIds: [],
            currentBalance: '',
            currentBalance2: '',
            gstRegistration: Vouchers?.defGstRegist?.id || '',
            locationId: Vouchers?.defGstRegist?.id || '',
            narration: '',
            modeOfPayment: '',
            chequeNumber: '',
            cardNumber: '',
            totalWithoutgst: 0,
            transactionId: '',
            salesChannel: '',
            giftVoucherAmount: 0,
            giftVoucherLedgerId: null,
            isGiftVoucherUsed: false,
            customerNewDeliveryShippingAddress: '',
            customerNewDeliveryShippingState: '',

            cashAmount: null,
            cashLedgerId: null,

            cardAmount: null,
            cardLedgerId: null,

            bankAmount: null,
            bankLedgerId: null,

            chequeAmount: null,
            chequeLedgerId: null,

            igstLedgerId: null,
            cgstLedgerId: null,
            sgstLedgerId: null,

            discountLedgerId: null,
            discountAmount: 0,
            roundOffLedgerId: null,
            roundOffAmount: 0,
            courrierLedgerId: null,
            courrierAmount: 0,

            totalDiscountPer: null,

            typeOfVoucher: Vouchers?.typeOfVoucher || '',
            isExport: false,
            totalAmount: 0,
            totalIgst: 0,
            totalSgst: 0,
            totalCgst: 0,
            toLedgerId: null,
            remainingBalance: 0,
            amountReceived: 0,
            amount: 0,
            paymentReceivedType: '',

            totalGst: 0,
            currency: 'INR',
            currencyValue: 1,
            totalCurrencyValue: 0,
            paymentDetails: [
              {
                productsId: null,
                orderProductId: null,
                mrp: 0, // MRP including GST
                basePrice: 0, // Price excluding GST (calculated)
                rate: 0,
                exclusiveGst: 0,
                discount: 0,
                quantity: 1,
                value: 0,
                voucherAmount: 0,
                igstRate: 0,
                gstAmount: 0, // Total GST amount for this line
                gstCalculation: null,
              },
            ],
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const action = values.formAction || 'save';
            handleCreateVoucher(values, action, setSubmitting);
          }}
        >
          {({ isSubmitting, setFieldValue, values, submitForm }) => {
            const totals = calculateTotals(values);
            const updateFormikFieldsFromPaymentMethods = () => {
              // Clear all individual fields first
              setFieldValue('chequeNumber', '');
              setFieldValue('cardNumber', '');
              setFieldValue('transactionId', '');
              setFieldValue('cashAmount', null);
              setFieldValue('cardAmount', null);
              setFieldValue('bankAmount', null);
              setFieldValue('chequeAmount', null);
              setFieldValue('cashLedgerId', null);
              setFieldValue('cardLedgerId', null);
              setFieldValue('bankLedgerId', null);
              setFieldValue('chequeLedgerId', null);

              // Aggregate values by payment method type
              let cashTotal = 0;
              let cardTotal = 0;
              let bankTotal = 0;
              let chequeTotal = 0;

              // For multiple payments, we need to handle multiple entries of the same type
              const chequeEntries = [];
              const cardEntries = [];
              const bankEntries = [];

              paymentMethods.forEach((payment) => {
                const amount = parseFloat(payment.amount) || 0;

                switch (payment.mode) {
                  case 'Cash':
                    cashTotal += amount;
                    setFieldValue('cashLedgerId', CashLedgers[0]?.id || null);
                    break;
                  case 'Card':
                    cardTotal += amount;
                    if (payment.bankId) {
                      cardEntries.push({
                        ledgerId: payment.bankId,
                        cardNumber: payment.cardNumber || '',
                        amount: amount,
                      });
                    }
                    break;
                  case 'Bank Transfer':
                    bankTotal += amount;
                    if (payment.bankId) {
                      bankEntries.push({
                        ledgerId: payment.bankId,
                        transactionId: payment.transactionId || '',
                        amount: amount,
                      });
                    }
                    break;
                  case 'Cheque':
                    chequeTotal += amount;
                    if (payment.bankId) {
                      chequeEntries.push({
                        ledgerId: payment.bankId,
                        chequeNumber: payment.chequeNumber || '',
                        amount: amount,
                      });
                    }
                    break;
                }
              });

              // Set totals for each payment type
              setFieldValue('cashAmount', cashTotal > 0 ? cashTotal : null);
              setFieldValue('cardAmount', cardTotal > 0 ? cardTotal : null);
              setFieldValue('bankAmount', bankTotal > 0 ? bankTotal : null);
              setFieldValue(
                'chequeAmount',
                chequeTotal > 0 ? chequeTotal : null,
              );

              if (chequeEntries.length > 0) {
                setFieldValue('chequeLedgerId', chequeEntries[0].ledgerId);
                setFieldValue('chequeNumber', chequeEntries[0].chequeNumber);
              }
              if (cardEntries.length > 0) {
                setFieldValue('cardLedgerId', cardEntries[0].ledgerId);
                setFieldValue('cardNumber', cardEntries[0].cardNumber);
              }
              if (bankEntries.length > 0) {
                setFieldValue('bankLedgerId', bankEntries[0].ledgerId);
                setFieldValue('transactionId', bankEntries[0].transactionId);
              }
            };

            function determineDestinationLedger(
              Vouchers,
              custAddress,
              isExport,
              destinationledgerOptions,
              newShippingState,
            ) {
              const typeOfVoucher =
                Vouchers?.typeOfVoucher?.toLowerCase() || '';
              const defGstRegist = Vouchers?.defGstRegist || '';
              if (isExport) {
                const exportOption = destinationledgerOptions?.find((option) =>
                  option.label?.toLowerCase().includes('export'),
                );
                return exportOption?.value || null;
              }

              // Determine registration location from GST registration
              const getRegistrationLocation = (gstReg) => {
                if (!gstReg) return null;
                const regLower = gstReg?.state?.toLowerCase();

                if (
                  regLower.includes('jammu') ||
                  regLower.includes('kashmir') ||
                  regLower.includes('j&k') ||
                  regLower.includes('jk')
                ) {
                  return 'jammu_and_kashmir';
                } else if (
                  regLower.includes('delhi') ||
                  regLower.includes('ncr') ||
                  regLower.includes('nct')
                ) {
                  return 'delhi';
                }
                return null;
              };

              // Extract GST code from customer address (assuming GST code is in the address)
              const getCustGstCode = (address) => {
                if (!address) return null;
                const gstCodeMatch = address.match(/\b(0[1-9]|[1-9][0-9])\b/);
                return gstCodeMatch ? gstCodeMatch[0] : null;
              };

              const baseType =
                typeOfVoucher === 'Purchase' ? 'Purchase' : 'Sales';

              const determineLedgerType = () => {
                const rawRegLocation = getRegistrationLocation(defGstRegist);

                let regLocation =
                  rawRegLocation === 'jammu_and_kashmir'
                    ? 'SXR'
                    : rawRegLocation === 'delhi'
                    ? 'Delhi'
                    : rawRegLocation;

                if (regLocation?.toLowerCase() === 'sxr') regLocation = 'SXR';
                if (regLocation?.toLowerCase() === 'delhi')
                  regLocation = 'Delhi';

                const custGstCode = getCustGstCode(custAddress);

                const baseType =
                  Vouchers.typeOfVoucher === 'Purchase' ? 'Purchase' : 'Sale';

                if (regLocation) {
                  if (isExport === true) {
                    return `${baseType} Export`; // Export case
                  }
                } else if (!regLocation) {
                  return `${baseType} IGST-Delhi`; // Default with hyphen format
                }

                const gstCodeMapping = {
                  '01': 'SXR', // Capital SXR for J&K
                  '07': 'Delhi', // Capital Delhi
                };

                const custLocation = custGstCode
                  ? gstCodeMapping[custGstCode]
                  : null;

                const newShippingStateLocation = newShippingState
                  ? gstCodeMapping[newShippingState]
                  : null;

                if (newShippingStateLocation) {
                  if (regLocation === newShippingStateLocation) {
                    return `${baseType} Local-${regLocation}`;
                  } else {
                    return `${baseType} IGST-${regLocation}`;
                  }
                }
                else if (!custLocation) {
                  if (Vouchers?.typeOfVoucher === 'Purchase') {
                    return `${baseType} ${regLocation}`;
                  } else if (Vouchers?.typeOfVoucher === 'Payment') {
                    return `${(Vouchers?.typeOfVoucher).toUpperCase()}`;
                  }
                  return `${baseType} IGST-${regLocation}`;
                }

                if (regLocation === custLocation) {
                  return `${baseType} Local-${regLocation}`;
                } else {
                  return `${baseType} IGST-${regLocation}`;
                }
              };

              const ledgerType = determineLedgerType();

              const matchedOption = destinationledgerOptions?.find(
                (option) =>
                  option.label
                    ?.toLowerCase()
                    .includes(ledgerType.toLowerCase()) ||
                  option.value
                    ?.toString()
                    .toLowerCase()
                    .includes(ledgerType.toLowerCase()),
              );

              return matchedOption?.value || null;
            }

            const determineGSTLedgers = (
              Vouchers,
              custAddress,
              isExport,
              newShippingState,
              values,
            ) => {
              const defGstRegist = Vouchers?.defGstRegist || '';
              const typeOfVoucher = Vouchers?.typeOfVoucher || '';

              // Determine registration location from GST registration
              const getRegistrationLocation = (gstReg) => {
                if (!gstReg) return null;
                const regLower = gstReg?.state?.toLowerCase();

                if (
                  regLower.includes('jammu') ||
                  regLower.includes('kashmir') ||
                  regLower.includes('j&k') ||
                  regLower.includes('jk') ||
                  regLower.includes('sxr')
                ) {
                  return 'sxr';
                } else if (
                  regLower.includes('delhi') ||
                  regLower.includes('ncr') ||
                  regLower.includes('nct')
                ) {
                  return 'delhi';
                }
                return null;
              };

              // Get supplier/customer state from selected ledger or new shipping state
              const getPartyState = () => {
                if (newShippingState) {
                  if (newShippingState === '01') return 'sxr';
                  if (newShippingState === '07') return 'delhi';
                }

                const selectedLedgerOption = LedgerData.find(
                  (opt) => opt.value === values.ledgerId,
                );
                if (selectedLedgerOption?.obj?.shippingState) {
                  const state = selectedLedgerOption.obj.shippingState;
                  if (state === '01') return 'sxr';
                  if (state === '07') return 'delhi';
                }

                return null;
              };

              const registrationLocation =
                getRegistrationLocation(defGstRegist);
              const partyLocation = getPartyState();

              // Default values
              let igstLedgerId = null;
              let cgstLedgerId = null;
              let sgstLedgerId = null;

              // If export, no GST
              if (isExport) {
                return { igstLedgerId, cgstLedgerId, sgstLedgerId };
              }

              // If no registration location, default logic
              if (!registrationLocation) {
                if (typeOfVoucher === 'Purchase') {
                  const anyIgst = igstOptions.find(
                    (opt) =>
                      opt.label.toLowerCase().includes('input') &&
                      opt.label.toLowerCase().includes('igst'),
                  );
                  igstLedgerId = anyIgst?.value || null;
                } else {
                  const anyIgst = igstOptions.find((opt) =>
                    opt.label.toLowerCase().includes('igst'),
                  );
                  igstLedgerId = anyIgst?.value || null;
                }
                return { igstLedgerId, cgstLedgerId, sgstLedgerId };
              }

              // Check if same state or different state
              if (registrationLocation === partyLocation && partyLocation) {
                // Same state transaction
                if (typeOfVoucher.toLowerCase() === 'purchase') {
                  let cgstState = null;
                  let sgstState = null;

                  if (registrationLocation === 'sxr') {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('cgst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );

                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('sgst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );
                  } else {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('cgst') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );

                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('sgst') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );
                  }

                  if (!cgstState) {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('cgst'),
                    );
                  }
                  if (!sgstState) {
                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('sgst'),
                    );
                  }

                  cgstLedgerId = cgstState?.value || null;
                  sgstLedgerId = sgstState?.value || null;
                } else {
                  let cgstState = null;
                  let sgstState = null;

                  if (registrationLocation === 'sxr') {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('cgst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );

                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('sgst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );
                  } else {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('cgst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );

                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('sgst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );
                  }

                  if (!cgstState) {
                    cgstState = cgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('cgst') &&
                        !opt.label.toLowerCase().includes('input'),
                    );
                  }
                  if (!sgstState) {
                    sgstState = sgstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('sgst') &&
                        !opt.label.toLowerCase().includes('input'),
                    );
                  }

                  cgstLedgerId = cgstState?.value || null;
                  sgstLedgerId = sgstState?.value || null;
                }
              } else {
                // Different state transaction
                if (typeOfVoucher === 'Purchase') {
                  let igstState = null;

                  if (registrationLocation === 'sxr') {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('igst') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );
                  } else {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('igst') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );
                  }

                  if (!igstState) {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('igst'),
                    );
                  }

                  igstLedgerId = igstState?.value || null;
                } else {
                  let igstState = null;

                  if (registrationLocation === 'sxr') {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('igst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        (opt.label.toLowerCase().includes('sxr') ||
                          opt.label.toLowerCase().includes('j&k') ||
                          opt.label.toLowerCase().includes('jammu') ||
                          opt.label.toLowerCase().includes('kashmir')),
                    );
                  } else {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('igst') &&
                        !opt.label.toLowerCase().includes('input') &&
                        opt.label.toLowerCase().includes('delhi'),
                    );
                  }

                  if (!igstState) {
                    igstState = igstOptions.find(
                      (opt) =>
                        opt.label.toLowerCase().includes('igst') &&
                        !opt.label.toLowerCase().includes('input'),
                    );
                  }

                  igstLedgerId = igstState?.value || null;
                }
              }

              return { igstLedgerId, cgstLedgerId, sgstLedgerId };
            };

            useEffect(() => {
              // Auto-select GST ledgers when conditions change
              if (
                Vouchers?.typeOfVoucher === 'Sales' &&
                Vouchers?.defGstRegist
              ) {
                if (values.isExport) {
                  setFieldValue('igstLedgerId', null);
                  setFieldValue('cgstLedgerId', null);
                  setFieldValue('sgstLedgerId', null);
                  return;
                }
                const { igstLedgerId, cgstLedgerId, sgstLedgerId } =
                  determineGSTLedgers(
                    Vouchers,
                    custaddress,
                    values.isExport,
                    newShippingState,
                    values,
                  );

                // Only update if values are different to avoid infinite loops
                if (igstLedgerId && igstLedgerId !== values.igstLedgerId) {
                  setFieldValue('igstLedgerId', igstLedgerId);
                }
                if (cgstLedgerId && cgstLedgerId !== values.cgstLedgerId) {
                  setFieldValue('cgstLedgerId', cgstLedgerId);
                }
                if (sgstLedgerId && sgstLedgerId !== values.sgstLedgerId) {
                  setFieldValue('sgstLedgerId', sgstLedgerId);
                }
              }
            }, [
              Vouchers?.typeOfVoucher,
              Vouchers?.defGstRegist,
              values.isExport,
              custaddress,
              newShippingState,
              values.ledgerId,
            ]);

            useEffect(() => {
              // Auto-select GST ledgers for Purchase when conditions change
              // Only run for regular GST registration
              if (
                Vouchers?.typeOfVoucher === 'Purchase' &&
                Vouchers?.defGstRegist &&
                regType?.toLowerCase() === 'regular'
              ) {
                const { igstLedgerId, cgstLedgerId, sgstLedgerId } =
                  determineGSTLedgers(
                    Vouchers,
                    custaddress,
                    values.isExport,
                    newShippingState,
                    values,
                  );

                // Only update if values are different to avoid infinite loops
                if (igstLedgerId && igstLedgerId !== values.igstLedgerId) {
                  setFieldValue('igstLedgerId', igstLedgerId);
                }
                if (cgstLedgerId && cgstLedgerId !== values.cgstLedgerId) {
                  setFieldValue('cgstLedgerId', cgstLedgerId);
                }
                if (sgstLedgerId && sgstLedgerId !== values.sgstLedgerId) {
                  setFieldValue('sgstLedgerId', sgstLedgerId);
                }
              } else if (
                Vouchers?.typeOfVoucher === 'Purchase' &&
                regType?.toLowerCase() !== 'regular'
              ) {
                // Clear GST ledgers for non-regular suppliers
                setFieldValue('igstLedgerId', null);
                setFieldValue('cgstLedgerId', null);
                setFieldValue('sgstLedgerId', null);
              }
            }, [
              Vouchers?.typeOfVoucher,
              Vouchers?.defGstRegist,
              regType,
              custaddress,
              newShippingState,
              values.ledgerId,
              values.isExport,
            ]);

            const handleIgstLedgerChange = (option) => {
              setFieldValue('igstLedgerId', option?.value || '');
            };

            const handleCgstLedgerChange = (option) => {
              setFieldValue('cgstLedgerId', option?.value || '');
            };

            const handleSgstLedgerChange = (option) => {
              setFieldValue('sgstLedgerId', option?.value || '');
            };

            useEffect(() => {
              if (isPaymentInParts && paymentMethods.length > 0) {
                updateFormikFieldsFromPaymentMethods();
              }
            }, [paymentMethods, isPaymentInParts]);

            useEffect(() => {
              if (isPaymentInParts) {
                // Clear modeOfPayment field since we're using multiple methods
                setFieldValue('modeOfPayment', '');
              }
            }, [isPaymentInParts]);

            useEffect(() => {
                const totalAmountWithGst = (
    parseFloat(totals.subtotal) + parseFloat(totals.totalGST)
  ).toFixed(2);
              if (
                Vouchers?.typeOfVoucher === 'Purchase' &&
                regType?.toLowerCase() === 'regular'
              ) {
                setFieldValue('totalAmount', totals.subtotal);
                setFieldValue('totalGst', totals.totalGST);
                setFieldValue('totalCgst', totals.totalCGST);
                setFieldValue('totalIgst', totals.totalIGST);
                setFieldValue('totalSgst', totals.totalSGST);
              } else if (
                Vouchers?.typeOfVoucher === 'Purchase' &&
                regType?.toLowerCase() !== 'regular'
              ) {
                setFieldValue('totalAmount', totals.totalBasePrice);
                setFieldValue('totalGst', totals.totalGST);
                setFieldValue('totalCgst', totals.totalCGST);
                setFieldValue('totalIgst', totals.totalIGST);
                setFieldValue('totalSgst', totals.totalSGST);
              } else if (Vouchers?.typeOfVoucher === 'Sales') {
                setFieldValue('totalAmount', totalAmountWithGst);
                setFieldValue('totalGst', totals.totalGST);
                setFieldValue('totalCgst', totals.totalCGST);
                setFieldValue('totalIgst', totals.totalIGST);
                setFieldValue('totalSgst', totals.totalSGST);
              }
            }, [
              totals.subtotal,
              totals.totalGST,
              totals.totalCGST,
              totals.totalIGST,
              totals.totalSGST,
              setFieldValue,
              Vouchers?.typeOfVoucher,
            ]);

            useEffect(() => {
              // Auto-select destination ledger when conditions change
              if (
                Vouchers?.typeOfVoucher &&
                Vouchers?.defGstRegist &&
                destinationledger.length > 0
              ) {
                const selectedValue = determineDestinationLedger(
                  Vouchers,
                  custaddress,
                  values.isExport,
                  destinationledger,
                  newShippingState,
                );

                if (
                  selectedValue &&
                  selectedValue !== values.destinationLedgerId
                ) {
                  setFieldValue('destinationLedgerId', selectedValue);
                }
              }
            }, [
              Vouchers?.typeOfVoucher,
              Vouchers?.defGstRegist,
              values.isExport,
              custaddress,
              destinationledger,
            ]);

            // Function to handle manual selection
            const handleDestinationLedgerChange = (option) => {
              setFieldValue('destinationLedgerId', option?.value || '');
            };

            const handleAddCustomer = async (customerData) => {
              try {
                const response = await fetch(ADD_CUSTOMER_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(customerData),
                });

                const data = await response.json();

                if (response.ok) {
                  toast.success('Customer added successfully');

                  // Simply refetch all customers after successful addition
                  await getLedger();

                  setisCustModelOpen(false);
                } else {
                  toast.error(data.errorMessage || 'Failed to add customer');
                }
              } catch (error) {
                console.error(error);
                toast.error('An error occurred');
              }
            };

            // Helper function to find the selected product in any product list
            const getSelectedProductValue = (
              productsId,
              rowProducts,
              values,
              index,
            ) => {
              if (!productsId) return null;

              // First, try to find in rowProducts (order products)
              const foundInRowProducts = rowProducts.find(
                (p) => p.value === productsId,
              );
              if (foundInRowProducts) return foundInRowProducts;

              // If not found in order products, try to find in all products
              if (allProducts.length > 0) {
                const foundInAllProducts = allProducts.find(
                  (p) => p.value === productsId,
                );
                if (foundInAllProducts) {
                  return {
                    ...foundInAllProducts,
                    label: `${foundInAllProducts.label} (All Products)`,
                  };
                }
              }

              // If still not found, check if it's in the combined list for new products
              if (
                values.paymentDetails[index]?.isNewProduct ||
                newProductRowIndex === index
              ) {
                const combinedProducts = getAllAvailableProducts(
                  rowProducts,
                  values,
                  index,
                );
                const foundInCombined = combinedProducts.find(
                  (p) => p.value === productsId,
                );
                if (foundInCombined) return foundInCombined;
              }

              return null;
            };

            // GST calculation - always computed the same way regardless of export;
            // export only clears the GST ledger selections (handled above) and hides
            // the GST UI for the row/section (handled in the JSX below).
            const calculateGST = (
              mrp,
              hsnCode,
              gstRegistration,
              customerAddress,
              discount = 0,
              customerState,
            ) => {
              // MRP is inclusive of GST
              const igstRate = hsnCode?.igst || 0;
              const cgstRate = hsnCode?.cgst || 0;
              const sgstRate = hsnCode?.sgst || 0;

              // Calculate total GST rate
              const totalGstRate = igstRate || cgstRate + sgstRate;

              // Calculate base price (exclusive of GST) - THIS SHOULD NOT CHANGE WITH DISCOUNT
              const basePrice = mrp / (1 + totalGstRate / 100);

              // Calculate GST amount based on base price (without discount)
              let cgstAmount = 0;
              let sgstAmount = 0;
              let gstAmount = 0;
              let totalGstAmount = 0;

              // Normalize state codes
              const registrationCode = String(gstRegistration || '').trim();
              const customerStateCode = String(customerState || '').trim();
              const newShippingStateCode = newShippingState
                ? String(newShippingState).trim()
                : null;

              // Function to convert state name to state code if needed
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
              let customerStateToCompare = newShippingStateCode;

              if (!customerStateToCompare || customerStateToCompare === '') {
                customerStateToCompare = getStateCode(customerStateCode);
              } else {
                customerStateToCompare = getStateCode(newShippingStateCode);
              }

              const isSameState =
                registrationStateCode === customerStateToCompare &&
                (registrationStateCode === '01' ||
                  registrationStateCode === '07');

              if (isSameState) {
                // Same state - apply CGST + SGST on base price (without discount)
                cgstAmount = basePrice * (cgstRate / 100);
                sgstAmount = basePrice * (sgstRate / 100);
                totalGstAmount = cgstAmount + sgstAmount;

                if (typeof setgsttype === 'function') {
                  setgsttype('SGST+CGST');
                }

                // Calculate final price after discount
                const discountedBasePrice =
                  discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                const finalPrice = discountedBasePrice + totalGstAmount;

                return {
                  type: 'CGST+SGST',
                  cgstRate,
                  sgstRate,
                  igstRate: 0,
                  basePrice: basePrice, // This stays as original base price (excl. GST)
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
                    registrationStateCode === '01'
                      ? 'Jammu And Kashmir'
                      : 'Delhi',
                  usedShippingState: newShippingStateCode
                    ? 'newShippingState'
                    : 'customerState',
                };
              } else {
                // Different state - apply IGST on base price (without discount)
                gstAmount = basePrice * (igstRate / 100);
                totalGstAmount = gstAmount;

                if (typeof setgsttype === 'function') {
                  setgsttype('IGST');
                }

                // Calculate final price after discount
                const discountedBasePrice =
                  discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                const finalPrice = discountedBasePrice + totalGstAmount;

                return {
                  type: 'IGST',
                  igstRate,
                  cgstRate: 0,
                  sgstRate: 0,
                  basePrice: basePrice, // This stays as original base price (excl. GST)
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
                  usedShippingState: newShippingStateCode
                    ? 'newShippingState'
                    : 'customerState',
                };
              }
            };

            useEffect(() => {
              // This will run whenever ledgerId or newShippingState changes
              if (values?.paymentDetails?.length > 0 && values?.ledgerId) {
                // Get the selected ledger details
                const selectedLedgerOption = LedgerData.find(
                  (opt) => opt.value === values.ledgerId,
                );

                if (selectedLedgerOption) {
                  const customerAddress =
                    selectedLedgerOption?.obj?.shippingAddress || '';
                  const customerState =
                    selectedLedgerOption?.obj?.shippingState || '';
                  const gstRegistration = Vouchers?.defGstRegist?.state || '';

                  // Recalculate GST for each row in paymentDetails
                  values.paymentDetails.forEach((entry, index) => {
                    if (entry.productsId) {
                      // Find the product details
                      const product =
                        allProducts.find((p) => p.value === entry.productsId) ||
                        availableProducts.find(
                          (p) => p.value === entry.productsId,
                        );

                      if (product) {
                        const mrp = entry.mrp || product.price || 0;
                        const hsnCode = product.hsnCode || {};
                        const currentDiscount =
                          Vouchers?.typeOfVoucher === 'Sales'
                            ? entry.discount || 0
                            : 0; // Only apply discount for Sales

                        // Calculate GST with current values
                        const gstCalculation = calculateGST(
                          mrp,
                          hsnCode,
                          gstRegistration,
                          customerAddress,
                          currentDiscount,
                          customerState,
                        );

                        // Update form fields with new GST calculation
                        setFieldValue(
                          `paymentDetails.${index}.gstCalculation`,
                          gstCalculation,
                        );
                        setFieldValue(
                          `paymentDetails.${index}.gstAmount`,
                          gstCalculation.totalGstAmount,
                        );
                        setFieldValue(
                          `paymentDetails.${index}.exclusiveGst`,
                          gstCalculation.finalPrice,
                        );

                        // Update rate (exclusive of GST) for both Sales and Purchase
                        const displayRate = Math.max(
                          entry.mrp - (gstCalculation.totalGstAmount || 0),
                          0,
                        );
                        setFieldValue(
                          `paymentDetails.${index}.rate`,
                          displayRate,
                        );

                        // Calculate line total
                        const lineTotal = calculateLineTotal({
                          ...entry,
                          exclusiveGst: gstCalculation.finalPrice,
                          rate: displayRate,
                          quantity: entry.quantity || 1,
                        });

                        setFieldValue(
                          `paymentDetails.${index}.value`,
                          lineTotal,
                        );
                        setFieldValue(
                          `paymentDetails.${index}.voucherAmount`,
                          lineTotal,
                        );
                      }
                    }
                  });
                }
              }
            }, [
              values?.ledgerId,
              newShippingState,
              allProducts,
              availableProducts,
              Vouchers?.typeOfVoucher,
            ]);

            // Also add this useEffect for when newShippingState changes from the delivery address field
            useEffect(() => {
              // When newShippingState changes from the delivery address, trigger GST recalculation
              if (
                values?.isDeliveryDifferent &&
                values?.customerNewDeliveryShippingState
              ) {
                setnewShippingState(values.customerNewDeliveryShippingState);
              }
            }, [
              values?.customerNewDeliveryShippingState,
              values?.isDeliveryDifferent,
            ]);

            // Add this function to handle product selection with proper GST calculation
            const handleProductSelect = (
              index,
              option,
              setFieldValue,
              entry,
              selectedLedger,
              Vouchers,
            ) => {
              const mrp = option?.price || 0;
              const hsnCode = option?.hsnCode || {};
              const customerAddress = selectedLedger?.obj?.shippingAddress || '';
              const customerState = selectedLedger?.obj?.shippingState || '';
              const gstRegistration = Vouchers?.defGstRegist?.state || '';
              const currentDiscount =
                Vouchers?.typeOfVoucher === 'Sales' ? entry.discount || 0 : 0;

              // Calculate GST based on location and discount
              const gstCalculation = calculateGST(
                mrp,
                hsnCode,
                gstRegistration,
                customerAddress,
                currentDiscount,
                customerState,
              );

              // Rate = MRP - GST Amount (Exclusive of GST)
              const displayRate = Math.max(
                mrp - (gstCalculation.totalGstAmount || 0),
                0,
              );

              setFieldValue(
                `paymentDetails.${index}.productsId`,
                option?.obj?.product?.id || option?.obj.id || null,
              );
              setFieldValue(
                `paymentDetails.${index}.orderProductId`,
                option?.orderProdId || null,
              );
              setFieldValue(`paymentDetails.${index}.mrp`, mrp);
              setFieldValue(
                `paymentDetails.${index}.igstRate`,
                hsnCode?.igst || 0,
              );
              setFieldValue(
                `paymentDetails.${index}.gstAmount`,
                gstCalculation.totalGstAmount,
              );
              setFieldValue(
                `paymentDetails.${index}.exclusiveGst`,
                gstCalculation.finalPrice,
              );
              setFieldValue(`paymentDetails.${index}.rate`, displayRate); // This is the exclusive price
              setFieldValue(
                `paymentDetails.${index}.gstCalculation`,
                gstCalculation,
              );

              const lineTotal = calculateLineTotal({
                ...entry,
                mrp,
                discount: currentDiscount,
                quantity: entry.quantity || 1,
                gstCalculation,
                rate: displayRate,
              });

              setFieldValue(`paymentDetails.${index}.value`, lineTotal);
              setFieldValue(`paymentDetails.${index}.voucherAmount`, lineTotal);
            };

            // Add this useEffect inside your Formik render props, after the totals calculation
            useEffect(() => {
              const totalBasePrice = parseFloat(totals.totalBasePrice) || 0;

              const totalDiscount = parseFloat(totals.totalDiscount) || 0;

              setFieldValue('totalWithoutgst', totalBasePrice - totalDiscount);
            }, [totals.totalBasePrice, totals.totalDiscount, setFieldValue]);

            useEffect(() => {
              let totalDiscountPer = 0;

              values?.paymentDetails.forEach((entry) => {
                totalDiscountPer += parseFloat(entry.discount) || 0;
              });
              setFieldValue('totalDiscountPer', totalDiscountPer);
            }, [values?.paymentDetails, setFieldValue]);

            return (
              <Form>
                <div className="flex flex-col gap-9">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        {Vouchers?.name}
                      </h3>
                    </div>

                    <div className="flex flex-col p-6.5 ">
                      {/* Top Section - Party Account Details */}
                      <div className="flex flex-row gap-4 max-h-[130px]">
                        <div className="flex-2 max-w-[120px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            {' '}
                            Voucher Number
                          </label>
                          <Field
                            type="text"
                            name="recieptNumber"
                            placeholder="Enter No"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage
                            name="recieptNumber"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                        {Vouchers?.typeOfVoucher == 'Payment' && (
                          <>
                            <div className="flex-2 min-w-[250px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Select Account{' '}
                                <span className="text-red-600 ml-1">*</span>
                              </label>
                              <ReactSelect
                                name="ledgerId"
                                value={LedgerData.find(
                                  (opt) => opt.value === values.ledgerId,
                                )}
                                onChange={(option) => {
                                  // Check if selected option is credit type
                                  if (
                                    option?.type?.toLowerCase() === 'credit'
                                  ) {
                                    toast.error(
                                      'Cannot select ledger with Credit balance. Please select a Debit balance ledger.',
                                    );
                                    return; // Don't set the value
                                  }

                                  setFieldValue(
                                    'ledgerId',
                                    option?.value || '',
                                  );
                                  setFieldValue(
                                    'currentBalance',
                                    option?.balance + ' ' + option.type || 0,
                                  );
                                  handleLedgerSelect(option);
                                }}
                                // Filter out credit type ledgers from options
                                options={LedgerData.filter((opt) => {
                                  const name = opt.label?.toLowerCase() || '';
                                  return (
                                    name.includes('cash') ||
                                    name.includes('bank')
                                  );
                                })}
                                className="react-select-container bg-white dark:bg-form-Field w-full"
                                classNamePrefix="react-select"
                                placeholder={getPartyAccountPlaceholder()}
                                menuPortalTarget={document.body}
                                styles={{
                                  ...customStyles,
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 100000,
                                  }),
                                }}
                              />
                              {/* Show warning message if current selection is credit type */}
                              {values.ledgerId &&
                                LedgerData.find(
                                  (opt) =>
                                    opt.value === values.ledgerId &&
                                    opt.type?.toLowerCase() === 'credit',
                                ) && (
                                  <div className="text-red-500 text-xs mt-1 flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    This ledger has Credit balance. Please
                                    select a Debit balance ledger.
                                  </div>
                                )}
                              <ErrorMessage
                                name="ledgerId"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </div>
                            <div className="flex-2 min-w-[250px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Payment Date & Time
                              </label>
                              <Field
                                name="paymentDate"
                                type="datetime-local"
                                defaultValue={new Date()
                                  .toISOString()
                                  .slice(0, 16)}
                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                              />
                              <ErrorMessage
                                name="paymentDate"
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          </>
                        )}

                        {Vouchers?.typeOfVoucher === 'Purchase' && (
                          <div className="flex-2 min-w-[250px]">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Supplier Invoice Number
                            </label>
                            <Field
                              type="text"
                              name="supplierInvoiceNumber"
                              placeholder="Enter No"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                            />
                            <ErrorMessage
                              name="supplierInvoiceNumber"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        )}

                        {(Vouchers?.typeOfVoucher === 'Sales' ||
                          Vouchers?.typeOfVoucher === 'Purchase') && (
                          <>
                            <div className="flex-2 min-w-[150px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Date
                              </label>
                              <Field
                                name="date"
                                type="date"
                                placeholder="Enter Date"
                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                              />
                              <ErrorMessage
                                name="date"
                                component="div"
                                className="text-red-500"
                              />
                            </div>

                            <div className="flex-2 min-w-[200px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                {getPartyAccountLabel()}
                              </label>
                              <ReactSelect
                                name="ledgerId"
                                value={LedgerData.find(
                                  (opt) => opt.value === values.ledgerId,
                                )}
                                onChange={(option) => {
                                  setFieldValue(
                                    'ledgerId',
                                    option?.value || '',
                                  );
                                  setFieldValue(
                                    'currentBalance',
                                    option?.balance || 0,
                                  );
                                  handleLedgerSelect(option);
                                  setcustaddress(
                                    option?.obj?.shippingState || '',
                                  );

                                  setregType(option?.obj.registrationType);
                                }}
                                options={LedgerData}
                                className="react-select-container bg-white dark:bg-form-Field w-full"
                                classNamePrefix="react-select"
                                placeholder={getPartyAccountPlaceholder()}
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
                                name="ledgerId"
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                              {Vouchers?.typeOfVoucher === 'Sales' && (
                                <div
                                  style={{ backgroundColor: '#333A48' }}
                                  className="flex w-[150px] items-center gap-2 rounded-xl cursor-pointer  mx-2 px-2 text-white mt-2 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                                  onClick={() => {
                                    setisCustModelOpen(true);
                                  }}
                                >
                                  <IoMdAdd size={20} />
                                  <span className="cursor-pointer text-sm">
                                    Add Customer
                                  </span>
                                </div>
                              )}
                            </div>
                           {!Vouchers?.name?.toLowerCase().includes('pos') && (
  <div className="flex-2 min-w-[200px] ">
    <label className="mb-2.5 block text-black dark:text-white">
      {getPartyAccountLabel()}-Orders
    </label>
    <ReactSelect
      name="orderIds"
      style={{ height: '20px' }}
      value={availableOrders.filter((opt) =>
        values.orderIds?.includes(opt.value),
      )}
      onChange={(selectedOptions) => {
        const selectedValues =
          selectedOptions?.map((option) => option.value) || [];
        setFieldValue('orderIds', selectedValues);

        handleOrderSelect(selectedValues);
      }}
      options={availableOrders}
      isMulti={true}
      className="h-[200px]"
      menuPortalTarget={document.body}
      styles={{
        ...customStyles,
        control: (base, state) => ({
          ...base,
          minHeight: '42px',
          maxHeight: '42px',
          overflowY: 'auto',
          borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
          '&:hover': {
            borderColor: '#9ca3af',
          },
        }),
        valueContainer: (base) => ({
          ...base,
          maxHeight: '38px',
          overflowY: 'auto',
          flexWrap: 'nowrap',
          display: 'flex',
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: '#3b82f6',
          borderRadius: '4px',
          margin: '2px',
          flexShrink: 0,
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: 'white',
          padding: '2px 6px',
          fontSize: '12px',
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: 'white',
          ':hover': {
            backgroundColor: '#2563eb',
            color: 'white',
          },
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: '40px',
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 100000,
        }),
      }}
      components={{
        DropdownIndicator: null,
        IndicatorSeparator: null,
      }}
    />
    <ErrorMessage
      name="orderId"
      component="div"
      className="text-red-500 text-xs mt-1"
    />
  </div>
)}

                            <div className="flex-2 max-w-[120px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Gst Registration
                              </label>
                              <Field
                                name="gstRegistration"
                                value={Vouchers?.defGstRegist?.state || ''}
                                type="text"
                                placeholder="Enter gst Registration"
                                className=" w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                              />
                              <ErrorMessage
                                name="gstRegistration"
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                          </>
                        )}
                        {/* Supply Location Section */}
                        {Vouchers?.typeOfVoucher === 'Sales' && (
                          <div
                            className="relative"
                            style={{
                              minHeight: values.isDeliveryDifferent
                                ? '200px'
                                : 'auto',
                            }}
                          >
                            {/* Checkbox row - stays in normal flow */}
                            <div className="flex flex-col gap-3 min-w-[250px] justify-content-between">
                              <label className="whitespace-nowrap text-black dark:text-white">
                                Supply Location
                              </label>
                              <div className="flex items-center gap-3">
                                <Field
                                  type="checkbox"
                                  name="isDeliveryDifferent"
                                  className="h-5 ml-9 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setFieldValue(
                                      'isDeliveryDifferent',
                                      isChecked,
                                    );

                                    // Clear the delivery address fields when unchecked
                                    if (!isChecked) {
                                      setFieldValue(
                                        'customerNewDeliveryShippingAddress',
                                        '',
                                      );
                                      setFieldValue(
                                        'customerNewDeliveryShippingState',
                                        '',
                                      );
                                      setnewShippingState(''); // Reset the shipping state variable
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {/* Expanded content - positioned absolutely below */}
                            {values.isDeliveryDifferent && (
                              <div className="absolute left-0 right-0 top-[40px] z-20 mt-4 mb-4 animate-fadeIn bg-white">
                                <div className="flex flex-wrap gap-4 mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="flex-1 min-w-[200px]">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      New Delivery Address
                                    </label>
                                    <Field
                                      as="textarea"
                                      name="customerNewDeliveryShippingAddress"
                                      placeholder="Enter Delivery Address"
                                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage
                                      name="customerNewDeliveryShippingAddress"
                                      component="div"
                                      className="text-red-500"
                                    />
                                  </div>

                                  <div className="flex-1 min-w-[220px]">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                      New Shipping State{' '}
                                      <span className="text-red-600">*</span>
                                    </label>
                                    <ReactSelect
                                      value={stateOption.find(
                                        (opt) =>
                                          opt.value ===
                                          values.customerNewDeliveryShippingState,
                                      )}
                                      onChange={(option) => {
                                        setFieldValue(
                                          'customerNewDeliveryShippingState',
                                          option?.value || '',
                                        );
                                        setnewShippingState(
                                          option?.value || '',
                                        );
                                      }}
                                      options={stateOption}
                                      styles={customStyles}
                                      className="bg-white dark:bg-form-input"
                                      classNamePrefix="react-select"
                                      placeholder="Select Shipping State"
                                      menuPortalTarget={document.body}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-4 mb-3">
                        <div className="flex-2 max-w-[120px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Current Balance
                          </label>
                          <Field
                            type="text"
                            name="currentBalance"
                            placeholder="0.00"
                            readOnly
                            className="w-full bg-gray-100 dark:bg-slate-800 rounded border border-gray-300 py-3 px-5 text-black cursor-not-allowed"
                          />
                        </div>

                        {(Vouchers?.typeOfVoucher === 'Sales' ||
                          (Vouchers?.typeOfVoucher === 'Purchase' &&
                            regType?.toLowerCase() == 'regular')) && (
                          <>
                            <div className="flex-2 min-w-[250px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Destination Ledger
                              </label>
                              <ReactSelect
                                name="destinationLedgerId"
                                value={destinationledger.find(
                                  (opt) =>
                                    opt.value === values.destinationLedgerId,
                                )}
                                onChange={handleDestinationLedgerChange}
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
                          </>
                        )}

                        {Vouchers?.typeOfVoucher === 'Sales' && (
                          <>
                            <div className="flex-2 min-w-[250px]">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Sales Channel
                              </label>
                              <ReactSelect
                                name="salesChannel"
                                value={salesChannel.find(
                                  (option) =>
                                    option.value === values.salesChannel,
                                )}
                                onChange={(option) =>
                                  setFieldValue('salesChannel', option.value)
                                }
                                options={salesChannel}
                                styles={customStyles}
                                className="bg-white dark:bg-form-input"
                                classNamePrefix="react-select"
                                placeholder="Select"
                              />
                              <ErrorMessage
                                name="salesChannel"
                                component="div"
                                className="text-red-500"
                              />
                            </div>

                            <div className="flex-2 min-w-[250px] ml-5">
                              <label className="mt-7 mb-2  block text-black dark:text-white">
                                Is Export
                              </label>
                              <div className="flex items-center gap-3">
                                <Field
                                  name="isExport"
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark dark:bg-form-input"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {values.isExport
                                    ? 'Yes (Export)'
                                    : 'No (Domestic)'}
                                </span>
                              </div>
                              <ErrorMessage
                                name="isExport"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        {(Vouchers?.typeOfVoucher === 'Sales' ||
                          (Vouchers?.typeOfVoucher === 'Purchase' &&
                            regType?.toLowerCase() == 'regular')) &&
                          !values.isExport && (
                          <>
                            {/* Collapsible Header */}
                            <div
                              className="flex items-center gap-2 cursor-pointer mt-4 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setShowGSTLedgers(!showGSTLedgers)}
                            >
                              {showGSTLedgers ? (
                                <FaChevronUp
                                  className="text-gray-600 dark:text-gray-400"
                                  size={16}
                                />
                              ) : (
                                <FaChevronDown
                                  className="text-gray-600 dark:text-gray-400"
                                  size={16}
                                />
                              )}
                              <span className="font-medium text-black dark:text-white">
                                GST Ledgers{' '}
                                {showGSTLedgers
                                  ? '(Click to hide)'
                                  : '(Click to show)'}
                                <span className="text-red-600">
                                  {' '}
                                  Important To Check These Ledgers Before Submit
                                </span>
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                (IGST, CGST, SGST)
                              </span>
                            </div>

                            {/* Collapsible Content */}
                            {showGSTLedgers && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-4 animate-fadeIn">
                                {/* IGST Ledger */}
                                <div className="flex-1 min-w-[250px]">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    IGST Ledger
                                  </label>
                                  <ReactSelect
                                    name="igstLedgerId"
                                    value={igstOptions.find(
                                      (opt) =>
                                        opt.value === values.igstLedgerId,
                                    )}
                                    onChange={handleIgstLedgerChange}
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
                                      (opt) =>
                                        opt.value === values.cgstLedgerId,
                                    )}
                                    onChange={handleCgstLedgerChange}
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
                                      (opt) =>
                                        opt.value === values.sgstLedgerId,
                                    )}
                                    onChange={handleSgstLedgerChange}
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
                            )}
                          </>
                        )}

                        {/* Show message for non-regular suppliers in Purchase */}
                        {Vouchers?.typeOfVoucher === 'Purchase' &&
                          regType &&
                          regType?.toLowerCase() !== 'regular' && (
                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                ⚠️ This supplier is registered as{' '}
                                {regType?.toUpperCase()}. GST is not applicable
                                for this transaction.
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Products Table - Only for Sales and Purchase */}
                      {(Vouchers?.typeOfVoucher === 'Sales' ||
                        Vouchers?.typeOfVoucher === 'Purchase') && (
                        <FieldArray name="paymentDetails">
                          {({ push, remove }) => (
                            <div className="mb-6">
                              <div className="overflow-x-auto">
                                <table className="w-full table-fixed border-collapse">
                                  <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                      {[
                                        'Product',
                                        'View Inventory',
                                        'Quantity',
                                        ...(Vouchers?.typeOfVoucher ===
                                          'Purchase' &&
                                        regType?.toLowerCase() === 'regular'
                                          ? ['MRP', 'Purchase Price']
                                          : []),
                                        ...(Vouchers?.typeOfVoucher === 'Sales'
                                          ? ['MRP', 'Rate', 'Discount %']
                                          : []),
                                        ...(Vouchers?.typeOfVoucher ===
                                          'Purchase' &&
                                        regType?.toLowerCase() !== 'regular'
                                          ? ['Purchase Price']
                                          : []),

                                        'Total Value',
                                        ...((Vouchers?.typeOfVoucher ===
                                          'Sales' ||
                                          (Vouchers?.typeOfVoucher.toLowerCase() ===
                                            'purchase' &&
                                            regType?.toLowerCase() ===
                                              'regular')) &&
                                        !values.isExport
                                          ? ['GST Type']
                                          : []),
                                        ,
                                        'Action',
                                      ].map((header, i) => (
                                        <th
                                          key={i}
                                          className="w-[220px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300 truncate"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {values.paymentDetails.map(
                                      (entry, index) => {
                                        const rowProducts =
                                          getAvailableProductsForRow(
                                            values,
                                            index,
                                          );

                                        return (
                                          <tr
                                            key={entry.id || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                          >
                                            {/* Product Dropdown */}
                                            <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                              {selectedLedger ? (
                                                <ReactSelect
                                                  name={`paymentDetails.${index}.productsId`}
                                                  value={getSelectedProductValue(
                                                    entry.productsId,
                                                    rowProducts,
                                                    values,
                                                    index,
                                                  )}
                                                  onChange={(option) => {
                                                    if (!option) {
                                                      // Clear the row
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
                                                      setFieldValue(
                                                        `paymentDetails.${index}.voucherAmount`,
                                                        0,
                                                      );
                                                      return;
                                                    }

                                                    const mrp = option?.price || 0;
                                                    const hsnCode =
                                                      option?.hsnCode || {};

                                                    const customerAddress =
                                                      selectedLedger?.obj
                                                        ?.shippingAddress || '';
                                                    const customerState =
                                                      selectedLedger?.obj
                                                        ?.shippingState || '';
                                                    const gstRegistration =
                                                      Vouchers?.defGstRegist
                                                        ?.state || '';
                                                    const currentDiscount =
                                                      Vouchers?.typeOfVoucher ===
                                                      'Sales'
                                                        ? entry.discount || 0
                                                        : 0;

                                                    const gstCalculation =
                                                      calculateGST(
                                                        mrp,
                                                        hsnCode,
                                                        gstRegistration,
                                                        customerAddress,
                                                        currentDiscount,
                                                        customerState,
                                                      );

                                                    // Rate = MRP - GST (Exclusive of GST)
                                                    const displayRate = Math.max(
                                                      mrp -
                                                        (gstCalculation.totalGstAmount ||
                                                          0),
                                                      0,
                                                    );

                                                    setFieldValue(
                                                      `paymentDetails.${index}.productsId`,
                                                      option?.obj?.product?.id ||
                                                        option?.obj?.id ||
                                                        null,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.orderProductId`,
                                                      option?.orderProdId ||
                                                        null,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.mrp`,
                                                      mrp,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.rate`,
                                                      displayRate,
                                                    ); // This is the exclusive price
                                                    setFieldValue(
                                                      `paymentDetails.${index}.igstRate`,
                                                      hsnCode?.igst || 0,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.gstAmount`,
                                                      gstCalculation.totalGstAmount,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.exclusiveGst`,
                                                      gstCalculation.finalPrice,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.gstCalculation`,
                                                      gstCalculation,
                                                    );

                                                    const lineTotal =
                                                      calculateLineTotal({
                                                        ...entry,
                                                        mrp,
                                                        discount:
                                                          currentDiscount,
                                                        quantity:
                                                          entry.quantity || 1,
                                                        gstCalculation,
                                                        rate: displayRate,
                                                      });

                                                    setFieldValue(
                                                      `paymentDetails.${index}.value`,
                                                      lineTotal,
                                                    );
                                                    setFieldValue(
                                                      `paymentDetails.${index}.voucherAmount`,
                                                      lineTotal,
                                                    );
                                                  }}
                                                  options={
                                                    // Show all products for rows marked as new product, otherwise show order products
                                                    entry.isNewProduct ||
                                                    newProductRowIndex === index
                                                      ? getAllAvailableProducts(
                                                          rowProducts,
                                                          values,
                                                          index,
                                                        )
                                                      : rowProducts
                                                  }
                                                  placeholder={
                                                    loadingAllProducts
                                                      ? 'Loading...'
                                                      : 'Select Product'
                                                  }
                                                  className="react-select-container w-[220px]"
                                                  classNamePrefix="react-select"
                                                  menuPortalTarget={
                                                    document.body
                                                  }
                                                  styles={{
                                                    ...customStyles,
                                                    menuPortal: (base) => ({
                                                      ...base,
                                                      zIndex: 9999,
                                                    }),
                                                  }}
                                                  formatOptionLabel={(
                                                    option,
                                                  ) => (
                                                    <div className="flex flex-col">
                                                      <div className="flex items-center justify-between">
                                                        <span>
                                                          {option.label}
                                                        </span>
                                                        {option.fromOrder && (
                                                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            Order Product
                                                          </span>
                                                        )}
                                                      </div>
                                                      {option.orderInfo && (
                                                        <span className="text-xs text-gray-500 mt-1">
                                                          {option.orderInfo}
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                  isClearable
                                                  isDisabled={
                                                    loadingAllProducts
                                                  }
                                                />
                                              ) : (
                                                <div className="text-sm text-gray-400">
                                                  Select party account first
                                                </div>
                                              )}
                                              <ErrorMessage
                                                name={`paymentDetails.${index}.productsId`}
                                                component="div"
                                                className="text-red-500 text-xs mt-1"
                                              />
                                            </td>
                                            <td>
                                              <div>
                                                <span
                                                  onClick={() =>
                                                    openINVENTORYModal(
                                                      entry?.productsId,
                                                    )
                                                  }
                                                  className="bg-green-100 text-green-800 text-[10px] font-medium me-6 ml-5 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[120px]"
                                                >
                                                  {' '}
                                                  VIEW INVENTORY
                                                </span>
                                              </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                              <Field
                                                type="number"
                                                name={`paymentDetails.${index}.quantity`}
                                                placeholder="1"
                                                min="1"
                                                step="1"
                                                className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                onChange={(e) => {
                                                  const quantity =
                                                    parseFloat(
                                                      e.target.value,
                                                    ) || 1;
                                                  setFieldValue(
                                                    `paymentDetails.${index}.quantity`,
                                                    quantity,
                                                  );
                                                  setFieldValue(
                                                    `paymentDetails.${index}.value`,
                                                    calculateLineTotal({
                                                      ...entry,
                                                      quantity: quantity,
                                                    }),
                                                  );
                                                  setFieldValue(
                                                    `paymentDetails.${index}.voucherAmount`,
                                                    calculateLineTotal({
                                                      ...entry,
                                                      quantity: quantity,
                                                    }),
                                                  );
                                                }}
                                              />
                                            </td>

                                            {/* MRP (Inc. GST) */}
                                            {(Vouchers?.typeOfVoucher ===
                                              'Sales' ||
                                              (Vouchers?.typeOfVoucher ===
                                                'Purchase' &&
                                                regType?.toLowerCase() ===
                                                  'regular')) && (
                                              <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                <Field
                                                  type="number"
                                                  name={`paymentDetails.${index}.mrp`}
                                                  placeholder="0.00"
                                                  readOnly
                                                  className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                />
                                              </td>
                                            )}

                                            {/* Base Price (Excl. GST) - NEW COLUMN */}
                                            {(Vouchers?.typeOfVoucher.toLowerCase() ===
                                              'sales' ||
                                              Vouchers?.typeOfVoucher.toLowerCase() ===
                                                'purchase') && (
                                              <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                <Field
                                                  type="number"
                                                  name={`paymentDetails.${index}.basePrice`}
                                                  value={
                                                    entry.gstCalculation?.basePrice?.toFixed(
                                                      2,
                                                    ) || 0
                                                  }
                                                  placeholder="0.00"
                                                  readOnly
                                                  className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                                />
                                              </td>
                                            )}

                                            {/* Discount % */}
                                            {Vouchers?.typeOfVoucher.toLowerCase() ===
                                              'sales' && (
                                              <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                <Field
                                                  type="number"
                                                  name={`paymentDetails.${index}.discount`}
                                                  placeholder="0"
                                                  min="0"
                                                  max="100"
                                                  step="1"
                                                  className="w-full py-2 px-3 text-sm rounded border focus:border-primary"
                                                  value={
                                                    values.paymentDetails?.[
                                                      index
                                                    ]?.discount === 0
                                                      ? ''
                                                      : values.paymentDetails?.[
                                                          index
                                                        ]?.discount
                                                  }
                                                  onChange={(e) => {
                                                    let discount =
                                                      e.target.value === ''
                                                        ? 0
                                                        : parseFloat(
                                                            e.target.value,
                                                          );

                                                    // Handle empty or invalid input
                                                    if (isNaN(discount)) {
                                                      discount = 0;
                                                    }

                                                    // Validate discount doesn't exceed 100%
                                                    if (discount > 100) {
                                                      toast.warning(
                                                        'Discount cannot exceed 100%',
                                                      );
                                                      discount = 100;
                                                      setFieldValue(
                                                        `paymentDetails.${index}.discount`,
                                                        100,
                                                      );
                                                    } else {
                                                      setFieldValue(
                                                        `paymentDetails.${index}.discount`,
                                                        discount,
                                                      );
                                                    }

                                                    // Recalculate when discount changes
                                                    if (entry.productsId) {
                                                      const mrp = entry.mrp || 0;
                                                      const hsnCode =
                                                        (
                                                          availableProducts.find(
                                                            (p) =>
                                                              p.value ===
                                                              entry.productsId,
                                                          ) ||
                                                          allProducts.find(
                                                            (p) =>
                                                              p.value ===
                                                              entry.productsId,
                                                          )
                                                        )?.hsnCode || {};

                                                      const customerAddress =
                                                        selectedLedger?.obj
                                                          ?.shippingAddress ||
                                                        '';
                                                      const customerState =
                                                        selectedLedger?.obj
                                                          ?.shippingState || '';
                                                      const gstRegistration =
                                                        Vouchers?.defGstRegist
                                                          ?.state || '';

                                                      const gstCalculation =
                                                        calculateGST(
                                                          mrp,
                                                          hsnCode,
                                                          gstRegistration,
                                                          customerAddress,
                                                          discount,
                                                          customerState,
                                                        );

                                                      const displayRate =
                                                        gstCalculation.finalPrice ??
                                                        mrp;

                                                      setFieldValue(
                                                        `paymentDetails.${index}.gstCalculation`,
                                                        gstCalculation,
                                                      );
                                                      setFieldValue(
                                                        `paymentDetails.${index}.gstAmount`,
                                                        gstCalculation.totalGstAmount,
                                                      );
                                                      setFieldValue(
                                                        `paymentDetails.${index}.exclusiveGst`,
                                                        gstCalculation.finalPrice ??
                                                          mrp,
                                                      );
                                                      setFieldValue(
                                                        `paymentDetails.${index}.rate`,
                                                        displayRate,
                                                      );

                                                      const lineTotal =
                                                        calculateLineTotal({
                                                          ...entry,
                                                          mrp,
                                                          discount,
                                                          quantity:
                                                            entry.quantity || 1,
                                                          gstCalculation,
                                                        });

                                                      setFieldValue(
                                                        `paymentDetails.${index}.value`,
                                                        lineTotal,
                                                      );
                                                      setFieldValue(
                                                        `paymentDetails.${index}.voucherAmount`,
                                                        lineTotal,
                                                      );
                                                    }
                                                  }}
                                                  onFocus={(e) => {
                                                    // Clear the field when focused if it's 0
                                                    if (
                                                      values.paymentDetails?.[
                                                        index
                                                      ]?.discount === 0
                                                    ) {
                                                      setFieldValue(
                                                        `paymentDetails.${index}.discount`,
                                                        '',
                                                      );
                                                    }
                                                  }}
                                                  onBlur={(e) => {
                                                    // Set to 0 when blurred if empty
                                                    const currentValue =
                                                      values.paymentDetails?.[
                                                        index
                                                      ]?.discount;
                                                    if (
                                                      currentValue === '' ||
                                                      currentValue ===
                                                        undefined ||
                                                      currentValue === null
                                                    ) {
                                                      setFieldValue(
                                                        `paymentDetails.${index}.discount`,
                                                        0,
                                                      );
                                                    }
                                                  }}
                                                />
                                              </td>
                                            )}

                                            <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark font-medium">
                                              <Field
                                                type="number"
                                                name={`paymentDetails.${index}.value`}
                                                value={(() => {
                                                  const rate = entry.rate || 0;
                                                  const discount =
                                                    entry.discount || 0;
                                                  const quantity =
                                                    entry.quantity || 1;
                                                  const discountedRate =
                                                    rate * (1 - discount / 100);
                                                  return (
                                                    discountedRate * quantity
                                                  ).toFixed(2);
                                                })()}
                                                readOnly
                                                className="w-full bg-gray-50 dark:bg-slate-800 py-2 px-3 text-sm rounded border"
                                              />
                                            </td>

                                            {/* GST Type */}
                                            {(Vouchers?.typeOfVoucher ===
                                              'Sales' ||
                                              (Vouchers?.typeOfVoucher ===
                                                'Purchase' &&
                                                regType?.toLowerCase() ===
                                                  'regular')) &&
                                              !values.isExport && (
                                              // GST Type column - update the display
                                              <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                                {entry.gstCalculation && (
                                                  <div className="flex flex-col">
                                                    <span
                                                      className={`text-xs font-medium px-2 py-1 rounded ${
                                                        entry.gstCalculation
                                                          .type === 'CGST+SGST'
                                                          ? 'bg-blue-100 text-blue-800'
                                                          : entry.gstCalculation
                                                              .type === 'IGST'
                                                          ? 'bg-green-100 text-green-800'
                                                          : 'bg-gray-100 text-gray-800'
                                                      }`}
                                                    >
                                                      {
                                                        entry.gstCalculation
                                                          .type
                                                      }
                                                    </span>
                                                    {entry.gstCalculation
                                                      .discountApplied && (
                                                      <span className="text-xs text-orange-600 mt-1">
                                                        {
                                                          entry.gstCalculation
                                                            .discountPercentage
                                                        }
                                                        % Discount Applied
                                                      </span>
                                                    )}
                                                  </div>
                                                )}
                                              </td>
                                            )}

                                            {/* Delete Button */}
                                            <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark text-center">
                                              {values.paymentDetails.length >
                                                1 && (
                                                <button
                                                  type="button"
                                                  onClick={() => remove(index)}
                                                  className="text-red-600 hover:text-red-800 transition"
                                                >
                                                  <MdDelete size={22} />
                                                </button>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              {/* Add Row Button */}

                              <div className="flex items-center gap-4 mt-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      id: uuidv4(),
                                      productsId: null,
                                      mrp: 0,
                                      rate: 0,
                                      exclusiveGst: 0,
                                      discount: 0,
                                      quantity: 1,
                                      value: 0,
                                      igstRate: 0,
                                      gstAmount: 0,
                                      gstCalculation: null,
                                    })
                                  }
                                  disabled={!selectedLedger}
                                  className="flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                  <IoMdAdd size={20} /> Add Row
                                </button>

                                <span className="text-gray-400">|</span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    // Clean up empty rows before adding new one
                                    const cleanupEmptyRows = () => {
                                      const rowsToKeep = [];
                                      const rowsToRemove = [];

                                      values.paymentDetails.forEach(
                                        (entry, index) => {
                                          const isEmpty =
                                            !entry.productsId ||
                                            entry.productsId === null;

                                          if (isEmpty) {
                                            rowsToRemove.push(index);
                                          } else {
                                            rowsToKeep.push(entry);
                                          }
                                        },
                                      );

                                      if (rowsToRemove.length > 0) {
                                        const lastNonEmptyIndex = Math.max(
                                          ...values.paymentDetails
                                            .map((_, i) => i)
                                            .filter(
                                              (i) => !rowsToRemove.includes(i),
                                            ),
                                          -1,
                                        );

                                        const emptyRowsAtEnd =
                                          rowsToRemove.filter(
                                            (i) => i > lastNonEmptyIndex,
                                          );

                                        emptyRowsAtEnd
                                          .sort((a, b) => b - a)
                                          .forEach((index) => {
                                            remove(index);
                                          });

                                        if (emptyRowsAtEnd.length > 0) {
                                          toast.info(
                                            `Removed ${emptyRowsAtEnd.length} empty row(s)`,
                                          );
                                        }
                                      }
                                    };

                                    cleanupEmptyRows();

                                    setTimeout(() => {
                                      const hasSelectedProducts =
                                        values.paymentDetails.some(
                                          (entry) =>
                                            entry.productsId !== null &&
                                            entry.productsId !== undefined,
                                        );

                                      const lastRow =
                                        values.paymentDetails[
                                          values.paymentDetails.length - 1
                                        ];
                                      const isLastRowEmpty =
                                        !lastRow?.productsId ||
                                        lastRow?.productsId === null;

                                      if (!hasSelectedProducts) {
                                        const newIndex =
                                          values.paymentDetails.length;
                                        push({
                                          id: uuidv4(),
                                          productsId: null,
                                          mrp: 0,
                                          rate: 0,
                                          exclusiveGst: 0,
                                          discount: 0,
                                          quantity: 1,
                                          value: 0,
                                          igstRate: 0,
                                          gstAmount: 0,
                                          gstCalculation: null,
                                          isNewProduct: true,
                                        });
                                        setNewProductRowIndex(newIndex);
                                        setAddingNewProduct(true);
                                      } else if (isLastRowEmpty) {
                                        setFieldValue(
                                          `paymentDetails.${
                                            values.paymentDetails.length - 1
                                          }.isNewProduct`,
                                          true,
                                        );
                                        setNewProductRowIndex(
                                          values.paymentDetails.length - 1,
                                        );
                                        setAddingNewProduct(true);
                                        toast.info(
                                          "Last row converted to 'New Product' type",
                                        );
                                      } else {
                                        const newIndex =
                                          values.paymentDetails.length;
                                        push({
                                          id: uuidv4(),
                                          productsId: null,
                                          mrp: 0,
                                          rate: 0,
                                          exclusiveGst: 0,
                                          discount: 0,
                                          quantity: 1,
                                          value: 0,
                                          igstRate: 0,
                                          gstAmount: 0,
                                          gstCalculation: null,
                                          isNewProduct: true,
                                        });
                                        setNewProductRowIndex(newIndex);
                                        setAddingNewProduct(true);
                                      }
                                    }, 100);
                                  }}
                                  disabled={!selectedLedger}
                                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                  <IoMdAdd size={20} /> Add New Product (Not in
                                  Order)
                                </button>
                              </div>

                              {/* GST Summary */}
                              {Vouchers?.typeOfVoucher === 'Sales' ? (
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                                    GST Summary
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        Total (Excl. GST)
                                      </p>
                                      <p className="font-medium text-black dark:text-white">
                                        ₹
                                        {(
                                          parseFloat(totals.totalBasePrice) -
                                          parseFloat(totals.totalDiscount)
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400">
                                        Total Quantity
                                      </p>
                                      <p className="font-medium text-black dark:text-white">
                                        {totals.totalQuantity}
                                      </p>
                                    </div>
                                  {values.isExport ? (
  <div>
    <p className="text-gray-600 dark:text-gray-400">
      Export Sale NO GST Applicable
    </p>
  </div>
) : (
  <>
    {totals.totalCGST > 0 && (
      <div className="flex flex-col">
        <p className="text-gray-600 dark:text-gray-400">CGST</p>
        <Field
          type="number"
          name="totalCgst"
          value={totals.totalCGST}
          placeholder="0.00"
          readOnly
          className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
        />
      </div>
    )}
    {totals.totalSGST > 0 && (
      <div className="flex flex-col">
        <p className="text-gray-600 dark:text-gray-400">SGST</p>
        <Field
          type="number"
          name="totalSgst"
          value={totals.totalSGST}
          placeholder="0.00"
          readOnly
          className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
        />
      </div>
    )}
    {totals.totalIGST > 0 && (
      <div className="flex flex-col">
        <p className="text-gray-600 dark:text-gray-400">IGST</p>
        <Field
          type="number"
          name="totalIgst"
          value={totals.totalIGST}
          placeholder="0.00"
          readOnly
          className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
        />
      </div>
    )}
    <div>
      <p className="text-gray-600 dark:text-gray-400">Total GST</p>
      <p className="font-medium text-black dark:text-white">
        ₹{totals.totalGST}
      </p>
    </div>
  </>
)}

                               


                                    <div className="flex flex-col">
                                      <p className="text-gray-600 dark:text-gray-400">
                                        Grand Total (After Discount)
                                      </p>
                                      <Field
                                        type="number"
                                        name="totalAmount"
                                        value={totals.subtotal}
                                        placeholder="0.00"
                                        readOnly
                                        className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border font-bold"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                Vouchers?.typeOfVoucher === 'Purchase' &&
                                regType?.toLowerCase() === 'regular' && (
                                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                                      GST Summary
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Total MRP
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          ₹{totals.totalMRP}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Total Quantity
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          {totals.totalQuantity}
                                        </p>
                                      </div>
                                      {totals.totalCGST > 0 && (
                                        <div className="flex flex-col">
                                          <p className="text-gray-600 dark:text-gray-400">
                                            CGST
                                          </p>
                                          <Field
                                            type="number"
                                            name="totalCgst"
                                            value={totals.totalCGST}
                                            placeholder="0.00"
                                            readOnly
                                            className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
                                          />
                                        </div>
                                      )}
                                      {totals.totalSGST > 0 && (
                                        <div className="flex flex-col">
                                          <p className="text-gray-600 dark:text-gray-400">
                                            SGST
                                          </p>
                                          <Field
                                            type="number"
                                            name="totalSgst"
                                            value={totals.totalSGST}
                                            placeholder="0.00"
                                            readOnly
                                            className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
                                          />
                                        </div>
                                      )}
                                      {totals.totalIGST > 0 && (
                                        <div className="flex flex-col">
                                          <p className="text-gray-600 dark:text-gray-400">
                                            IGST
                                          </p>
                                          <Field
                                            type="number"
                                            name="totalIgst"
                                            value={totals.totalIGST}
                                            placeholder="0.00"
                                            readOnly
                                            className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
                                          />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Total GST
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          ₹{totals.totalGST}
                                        </p>
                                      </div>
                                      <div className="flex flex-col">
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Grand Total
                                        </p>
                                        <Field
                                          type="number"
                                          name="totalAmount"
                                          value={totals?.subtotal}
                                          placeholder="0.00"
                                          readOnly
                                          className="w-full bg-gray-50 dark:bg-slate-800 text-sm rounded border"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}

                              {/* No GST Summary for non-regular suppliers */}
                              {Vouchers?.typeOfVoucher === 'Purchase' &&
                                regType &&
                                regType?.toLowerCase() !== 'regular' && (
                                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                                      Transaction Summary
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Total Amount
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          ₹{totals.totalBasePrice}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                          Total Quantity
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          {totals.totalQuantity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </FieldArray>
                      )}

                      {/* For Payment and Contra - Simple Amount Field */}
                      {(Vouchers?.typeOfVoucher === 'Payment' ||
                        Vouchers?.typeOfVoucher === 'Contra') && (
                        <div className="mb-6">
                          <div className="overflow-x-auto">
                            <table className="w-full table-fixed border-collapse">
                              <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                  <th>Particular</th>
                                  <th>Balance</th>
                                  <th className="w-[220px] py-4 px-3 font-medium text-black dark:text-white text-sm border-b border-gray-300">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.paymentDetails.map((entry, index) => (
                                  <tr
                                    key={entry.id || index}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                  >
                                    <td>
                                      <ReactSelect
                                        name="toLedgerId"
                                        value={LedgerData.find(
                                          (opt) =>
                                            opt.value === values.toLedgerId,
                                        )}
                                        onChange={(option) => {
                                          setFieldValue(
                                            'toLedgerId',
                                            option?.value || '',
                                          );
                                          setFieldValue(
                                            'currentBalance2',
                                            option?.balance +
                                              ' ' +
                                              option.type || 0,
                                          );
                                        }}
                                        options={LedgerData.filter((opt) => {
                                          const type =
                                            opt.type?.toLowerCase() || '';
                                          return (
                                            type === 'customer' ||
                                            type === 'supplier'
                                          );
                                        })}
                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                        classNamePrefix="react-select"
                                        placeholder={'Select Particular'}
                                        menuPortalTarget={document.body}
                                        styles={{
                                          ...customStyles,
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 100000,
                                          }),
                                        }}
                                      />
                                    </td>
                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                      <Field
                                        type="text"
                                        name={`currentBalance2`}
                                        readOnly
                                        placeholder="0.00"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black dark:bg-form-Field dark:text-white focus:border-primary"
                                        min="0"
                                        step="0.01"
                                      />
                                    </td>

                                    <td className="border-b border-[#eee] py-4 px-3 dark:border-strokedark">
                                      <Field
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black dark:bg-form-Field dark:text-white focus:border-primary"
                                        min="0"
                                        step="0.01"
                                        validate={(value) => {
                                          const amount = parseFloat(value) || 0;
                                          const currentBalance =
                                            parseFloat(values.currentBalance) ||
                                            0;
                                          if (amount > currentBalance) {
                                            return `Amount cannot exceed current balance (₹${currentBalance})`;
                                          }
                                          return undefined;
                                        }}
                                      />
                                      <ErrorMessage
                                        name="amount"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {Vouchers?.typeOfVoucher === 'Sales' &&
                        Vouchers?.posInvoicing &&
                        values.paymentReceivedType !== 'Credit' && (
                          <div>
                            <label className="mb-2.5 block text-black dark:text-white">
                              Mode Of Payment
                            </label>

                            {/* Checkbox for payment in parts */}
                            <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                              <input
                                type="checkbox"
                                id="paymentInParts"
                                checked={isPaymentInParts}
                                onChange={(e) => {
                                  setIsPaymentInParts(e.target.checked);
                                  if (!e.target.checked) {
                                    // Clear all payment methods when switching to single mode
                                    setPaymentMethods([]);
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                htmlFor="paymentInParts"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                Payment in Multiple Parts
                              </label>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                (Split payment across multiple methods)
                              </span>
                            </div>

                            {!isPaymentInParts ? (
                              // OLD LOGIC - Single Payment Method
                              <div>
                                <ReactSelect
                                  name="modeOfPayment"
                                  options={modeOfpayment}
                                  value={modeOfpayment.find(
                                    (option) =>
                                      option.value === values.modeOfPayment,
                                  )}
                                  onChange={(selectedOption) => {
                                    const mode = selectedOption?.value || '';
                                    setFieldValue('modeOfPayment', mode);

                                    const amountReceived =
                                      parseFloat(values.amountReceived) || 0;

                                    setFieldValue('chequeNumber', '');
                                    setFieldValue('cardNumber', '');
                                    setFieldValue('transactionId', '');
                                    setFieldValue('cashAmount', null);
                                    setFieldValue('cardAmount', null);
                                    setFieldValue('bankAmount', null);
                                    setFieldValue('chequeAmount', null);
                                    setFieldValue('cashLedgerId', null);
                                    setFieldValue('cardLedgerId', null);
                                    setFieldValue('bankLedgerId', null);
                                    setFieldValue('chequeLedgerId', null);

                                    if (mode === 'Cash' && amountReceived > 0) {
                                      setFieldValue(
                                        'cashAmount',
                                        amountReceived,
                                      );
                                      setFieldValue(
                                        'cashLedgerId',
                                        CashLedgers[0]?.id || null,
                                      );
                                    }
                                    if (mode === 'Card' && amountReceived > 0) {
                                      setFieldValue(
                                        'cardAmount',
                                        amountReceived,
                                      );
                                    }
                                    if (
                                      mode === 'Bank Transfer' &&
                                      amountReceived > 0
                                    ) {
                                      setFieldValue(
                                        'bankAmount',
                                        amountReceived,
                                      );
                                    }
                                    if (
                                      mode === 'Cheque' &&
                                      amountReceived > 0
                                    ) {
                                      setFieldValue(
                                        'chequeAmount',
                                        amountReceived,
                                      );
                                    }
                                  }}
                                  placeholder="Select Mode Of Payment"
                                  className="react-select-container mb-4"
                                  classNamePrefix="react-select"
                                />

                                {values.modeOfPayment === 'Cheque' && (
                                  <div className="flex flex-row gap-4">
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Select Bank{' '}
                                        <span className="text-red-700">*</span>
                                      </label>
                                      <ReactSelect
                                        name="chequeLedgerId"
                                        value={bankData.find(
                                          (opt) =>
                                            opt.value === values.chequeLedgerId,
                                        )}
                                        onChange={(option) => {
                                          setFieldValue(
                                            'chequeLedgerId',
                                            option?.value || '',
                                          );
                                        }}
                                        options={bankData}
                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                        classNamePrefix="react-select"
                                        placeholder="Select Bank"
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
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Cheque Number
                                      </label>
                                      <Field
                                        type="text"
                                        name="chequeNumber"
                                        placeholder="Enter Cheque Number"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Cheque Amount
                                      </label>
                                      <Field
                                        type="number"
                                        name="chequeAmount"
                                        placeholder="Enter Amount"
                                        value={values.chequeAmount || ''}
                                        onChange={(e) => {
                                          setFieldValue(
                                            'chequeAmount',
                                            e.target.value,
                                          );
                                          setFieldValue(
                                            'amountReceived',
                                            e.target.value,
                                          );
                                        }}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                )}

                                {values.modeOfPayment === 'Cash' && (
                                  <div>
                                    {CashLedgers.length === 0 ? (
                                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                        <p className="text-red-600 dark:text-red-400 font-medium">
                                          ⚠️ No Cash Ledger Found
                                        </p>
                                        <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                                          Please create a Cash ledger to proceed
                                          with cash transactions.
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex flex-row gap-4">
                                        <div className="flex-1">
                                          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                                            <p className="text-green-600 dark:text-green-400 font-medium">
                                              Cash Account:{' '}
                                              {CashLedgers[0]?.name}
                                            </p>
                                            <Field
                                              type="hidden"
                                              name="cashLedgerId"
                                              value={CashLedgers[0]?.id || ''}
                                            />

                                            <ReactSelect
                                              name="cashLedgerId"
                                              value={cashData.find(
                                                (opt) =>
                                                  opt.value ===
                                                  values.cashLedgerId,
                                              )}
                                              onChange={(option) => {
                                                setFieldValue(
                                                  'cashLedgerId',
                                                  option?.value || '',
                                                );
                                              }}
                                              options={cashData}
                                              className="react-select-container bg-white dark:bg-form-Field w-full"
                                              classNamePrefix="react-select"
                                              placeholder="Select Cash"
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
                                        <div className="flex-1">
                                          <label className="mb-2.5 block text-black dark:text-white">
                                            Cash Amount
                                          </label>
                                          <Field
                                            type="number"
                                            name="cashAmount"
                                            placeholder="Enter Amount"
                                            value={values.cashAmount || ''}
                                            onChange={(e) => {
                                              setFieldValue(
                                                'cashAmount',
                                                e.target.value,
                                              );
                                              setFieldValue(
                                                'amountReceived',
                                                e.target.value,
                                              );
                                            }}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {values.modeOfPayment === 'Bank Transfer' && (
                                  <div className="flex flex-row gap-4">
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Select Bank{' '}
                                        <span className="text-red-700">*</span>
                                      </label>
                                      <ReactSelect
                                        name="bankLedgerId"
                                        value={bankData.find(
                                          (opt) =>
                                            opt.value === values.bankLedgerId,
                                        )}
                                        onChange={(option) => {
                                          setFieldValue(
                                            'bankLedgerId',
                                            option?.value || '',
                                          );
                                        }}
                                        options={bankData}
                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                        classNamePrefix="react-select"
                                        placeholder="Select Bank"
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
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Transaction ID
                                      </label>
                                      <Field
                                        type="text"
                                        name="transactionId"
                                        placeholder="Enter Transaction ID"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Bank Amount
                                      </label>
                                      <Field
                                        type="number"
                                        name="bankAmount"
                                        placeholder="Enter Amount"
                                        value={values.bankAmount || ''}
                                        onChange={(e) => {
                                          setFieldValue(
                                            'bankAmount',
                                            e.target.value,
                                          );
                                          setFieldValue(
                                            'amountReceived',
                                            e.target.value,
                                          );
                                        }}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                )}

                                {values.modeOfPayment === 'Card' && (
                                  <div className="flex flex-row gap-4">
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Select Card{' '}
                                        <span className="text-red-700">*</span>
                                      </label>
                                      <ReactSelect
                                        name="cardLedgerId"
                                        value={cardData.find(
                                          (opt) =>
                                            opt.value === values.cardLedgerId,
                                        )}
                                        onChange={(option) => {
                                          setFieldValue(
                                            'cardLedgerId',
                                            option?.value || '',
                                          );
                                        }}
                                        options={cardData}
                                        className="react-select-container bg-white dark:bg-form-Field w-full"
                                        classNamePrefix="react-select"
                                        placeholder="Select Card"
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
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Card Number
                                      </label>
                                      <Field
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Enter Card Number"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="mb-2.5 block text-black dark:text-white">
                                        Card Amount
                                      </label>
                                      <Field
                                        type="number"
                                        name="cardAmount"
                                        placeholder="Enter Amount"
                                        value={values.cardAmount || ''}
                                        onChange={(e) => {
                                          setFieldValue(
                                            'cardAmount',
                                            e.target.value,
                                          );
                                          setFieldValue(
                                            'amountReceived',
                                            e.target.value,
                                          );
                                        }}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // NEW LOGIC - Multiple Payment Methods - Split amountReceived
                              <div className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                                      Payment Allocation
                                    </h4>
                                    <div className="text-right">
                                      <div className="text-sm text-blue-600 dark:text-blue-400">
                                        Total to Split:{' '}
                                        <span className="font-bold text-lg">
                                          ₹{values.amountReceived || 0}
                                        </span>
                                      </div>
                                      <div
                                        className={`text-sm font-semibold ${getBalanceColor()}`}
                                      >
                                        Remaining: ₹
                                        {(
                                          values.amountReceived -
                                          calculateTotalAllocatedPayments()
                                        ).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
                                      Quick add:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => addPaymentMethod('Cash')}
                                      className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                      + Cash
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => addPaymentMethod('Cheque')}
                                      className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                      + Cheque
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addPaymentMethod('Bank Transfer')
                                      }
                                      className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                      + Bank Transfer
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => addPaymentMethod('Card')}
                                      className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                                    >
                                      + Card
                                    </button>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => addPaymentMethod('')}
                                  className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  Add Payment Method
                                </button>

                                <div className="space-y-4">
                                  {paymentMethods.map((payment, index) => {
                                    const currentAmount =
                                      parseFloat(payment.amount) || 0;
                                    const otherAmountsTotal =
                                      paymentMethods.reduce(
                                        (total, pmt, idx) => {
                                          if (idx !== index) {
                                            return (
                                              total +
                                              (parseFloat(pmt.amount) || 0)
                                            );
                                          }
                                          return total;
                                        },
                                        0,
                                      );
                                    const maxAvailable =
                                      (parseFloat(values.amountReceived) || 0) -
                                      otherAmountsTotal;

                                    return (
                                      <div
                                        key={index}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 relative"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removePaymentMethod(index)
                                          }
                                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </button>

                                        <h5 className="font-medium text-gray-800 dark:text-gray-300 mb-3 pr-8">
                                          Payment Method #{index + 1}
                                        </h5>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Payment Mode *
                                            </label>
                                            <ReactSelect
                                              value={modeOfpayment.find(
                                                (opt) =>
                                                  opt.value === payment.mode,
                                              )}
                                              onChange={(option) =>
                                                updatePaymentMethod(
                                                  index,
                                                  'mode',
                                                  option?.value || '',
                                                )
                                              }
                                              options={modeOfpayment}
                                              placeholder="Select Mode"
                                              className="react-select-container"
                                              classNamePrefix="react-select"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Amount *
                                            </label>
                                            <div className="relative">
                                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                                ₹
                                              </span>
                                              <input
                                                type="number"
                                                value={payment.amount}
                                                onChange={(e) => {
                                                  let value = e.target.value;
                                                  const floatValue =
                                                    parseFloat(value) || 0;

                                                  if (
                                                    floatValue > maxAvailable
                                                  ) {
                                                    value =
                                                      maxAvailable.toString();
                                                  }

                                                  updatePaymentMethod(
                                                    index,
                                                    'amount',
                                                    value,
                                                  );

                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                placeholder="Enter Amount"
                                                className="w-full pl-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                                max={maxAvailable}
                                                step="0.01"
                                              />
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                              Max available: ₹
                                              {maxAvailable.toFixed(2)}
                                            </div>
                                          </div>

                                          {(payment.mode === 'Cheque' ||
                                            payment.mode ===
                                              'Bank Transfer') && (
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Select Bank *
                                              </label>
                                              <ReactSelect
                                                value={bankData.find(
                                                  (opt) =>
                                                    opt.value ===
                                                    payment.bankId,
                                                )}
                                                onChange={(option) => {
                                                  updatePaymentMethod(
                                                    index,
                                                    'bankId',
                                                    option?.value || '',
                                                  );
                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                options={bankData}
                                                placeholder="Select Bank"
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
                                              />
                                            </div>
                                          )}
                                          {payment.mode === 'Card' && (
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Select Card *
                                              </label>
                                              <ReactSelect
                                                value={cardData.find(
                                                  (opt) =>
                                                    opt.value ===
                                                    payment.bankId,
                                                )}
                                                onChange={(option) => {
                                                  updatePaymentMethod(
                                                    index,
                                                    'bankId',
                                                    option?.value || '',
                                                  );
                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                options={cardData}
                                                placeholder="Select Card"
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
                                              />
                                            </div>
                                          )}

                                          {payment.mode === 'Cheque' && (
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Cheque Number *
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  payment.chequeNumber || ''
                                                }
                                                onChange={(e) => {
                                                  updatePaymentMethod(
                                                    index,
                                                    'chequeNumber',
                                                    e.target.value,
                                                  );
                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                placeholder="Enter Cheque Number"
                                                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              />
                                            </div>
                                          )}

                                          {payment.mode === 'Bank Transfer' && (
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Transaction ID *
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  payment.transactionId || ''
                                                }
                                                onChange={(e) => {
                                                  updatePaymentMethod(
                                                    index,
                                                    'transactionId',
                                                    e.target.value,
                                                  );
                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                placeholder="Enter Transaction ID"
                                                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              />
                                            </div>
                                          )}

                                          {payment.mode === 'Card' && (
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Card Number *
                                              </label>
                                              <input
                                                type="text"
                                                value={payment.cardNumber || ''}
                                                onChange={(e) => {
                                                  updatePaymentMethod(
                                                    index,
                                                    'cardNumber',
                                                    e.target.value,
                                                  );
                                                  updateFormikFieldsFromPaymentMethods();
                                                }}
                                                placeholder="Enter Card Number"
                                                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              />
                                            </div>
                                          )}

                                          {payment.mode === 'Cash' && (
                                            <div className="col-span-2">
                                              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                                                <p className="text-green-600 dark:text-green-400 font-medium">
                                                  Cash Account:{' '}
                                                  {CashLedgers[0]?.name}
                                                </p>
                                                <ReactSelect
                                                  name="cashLedgerId"
                                                  value={cashData.find(
                                                    (opt) =>
                                                      opt.value ===
                                                      values.cashLedgerId,
                                                  )}
                                                  onChange={(option) => {
                                                    setFieldValue(
                                                      'cashLedgerId',
                                                      option?.value || '',
                                                    );
                                                  }}
                                                  options={cashData}
                                                  className="react-select-container bg-white dark:bg-form-Field w-full"
                                                  classNamePrefix="react-select"
                                                  placeholder="Select Cash"
                                                  menuPortalTarget={
                                                    document.body
                                                  }
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
                                          )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">
                                              {payment.mode || 'Not selected'}
                                            </span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                              ₹{currentAmount.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {paymentMethods.length > 0 && (
                                  <div
                                    className={`p-4 rounded-lg border ${
                                      isPaymentAllocationValid(
                                        values.amountReceived,
                                      )
                                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                        : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                          isPaymentAllocationValid(
                                            values.amountReceived,
                                          )
                                            ? 'bg-green-500'
                                            : 'bg-yellow-500'
                                        }`}
                                      >
                                        {isPaymentAllocationValid(
                                          values.amountReceived,
                                        ) ? (
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        ) : (
                                          <span className="text-white text-sm font-bold">
                                            !
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <p
                                          className={`font-medium ${
                                            isPaymentAllocationValid(
                                              values.amountReceived,
                                            )
                                              ? 'text-green-700 dark:text-green-400'
                                              : 'text-yellow-700 dark:text-yellow-400'
                                          }`}
                                        >
                                          {isPaymentAllocationValid(
                                            values.amountReceived,
                                          )
                                            ? 'Payment allocation complete!'
                                            : 'Payment allocation incomplete'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                          {isPaymentAllocationValid(
                                            values.amountReceived,
                                          )
                                            ? `Total allocated: ₹${calculateTotalAllocatedPayments().toFixed(
                                                2,
                                              )} matches total amount.`
                                            : `Allocated: ₹${calculateTotalAllocatedPayments().toFixed(
                                                2,
                                              )} / Total: ₹${
                                                values.amountReceived
                                              }. Remaining: ₹${(
                                                values.amountReceived -
                                                calculateTotalAllocatedPayments()
                                              ).toFixed(2)}`}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      {/* Narration Field */}
                      <div className="mb-4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Narration
                        </label>
                        <Field
                          as="textarea"
                          name="narration"
                          placeholder="Narration"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue('formAction', 'save');
                            submitForm();
                          }}
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                />
                              </svg>
                              Save
                            </>
                          )}
                        </button>

                        {/* Save & Sync Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue('formAction', 'saveAndSync');
                            submitForm();
                          }}
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Syncing...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Save & Sync
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {isINVENTORYModalOpen && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center  z-50">
                    <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px]  w-[870px] h-[400px] mt-[60px] overflow-auto">
                      <div className="text-right">
                        <button
                          onClick={closeINVENTORYModal}
                          className="text-red-500 text-xl  font-bold"
                        >
                          &times;
                        </button>
                      </div>
                      <h2 className="text-2xl text-center mb-4 font-extrabold">
                        INVENTORY DETAILS
                      </h2>
                      <div className="inline-block min-w-full shadow-md rounded-lg overflow-auto">
                        <table className="min-w-full leading-normal">
                          <thead>
                            <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                LOCATION
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                OPENING BALANCE
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                BRANCH TRANSFER (INWARDS)
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                BRANCH TRANSFER (OUTWARDS)
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                CLOSING BALANCE
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                PURCHASE
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                SALE
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                IN PROGRESS ORDERS
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {SelectedINVENTORYData?.map((row, index) => (
                              <tr key={row.id}>
                                <td className="px-2 py-2 border-b">
                                  <p>{row?.location?.address}</p>
                                </td>
                                <td className="px-2 py-2 border-b">
                                  <p>{row?.openingBalance}</p>
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.branchTransferInwards}
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.branchTransferOutwards}
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.closingBalance}
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.purchase}
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.sale}
                                </td>
                                <td className="px-2 py-2 border-b">
                                  {row.inProgressOrders}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                {isCustModelOpen && (
                  <Modalll
                    isOpen={isCustModelOpen}
                    onRequestClose={() => setisCustModelOpen(false)}
                    className="modal mr-[200px] mt-[30px] mb-[50px] z-99999"
                    overlayClassName="modal-overlay"
                    width="800px" // Increased width to accommodate more fields
                  >
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-black">
                        Add New Customer
                      </h3>
                    </div>

                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                      <div className="flex flex-row gap-4">
                        <div className="mb-4">
                          <label className="block text-black dark:text-white mb-2">
                            Customer Name{' '}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={newCustomerName}
                            onChange={(e) => setnewCustomerName(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                            placeholder="Enter customer name"
                          />
                        </div>

                        {/* Shipping Address Field */}
                        <div className="mb-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Shipping Address{' '}
                            <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="Shipping Address"
                            rows="3"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                          />
                        </div>

                        {/* Shipping State Field */}
                        <div className="mb-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Shipping State{' '}
                            <span className="text-red-600">*</span>
                          </label>
                          <ReactSelect
                            value={
                              stateOption.find(
                                (option) => option.value === shippingState,
                              ) || null
                            }
                            onChange={(option) =>
                              setShippingState(option ? option.value : '')
                            }
                            options={stateOption}
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Shipping State"
                          />
                        </div>
                      </div>

                      {/* Opening Balance Section */}
                      <div className="mb-4 border-t border-stroke pt-4 dark:border-strokedark">
                        <h4 className="font-medium text-black dark:text-white mb-3">
                          Opening Balance:
                        </h4>

                        {/* Opening Balance Type Radio Buttons */}
                        <div className="mb-4">
                          <div className="flex items-center gap-4 mb-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="openingBalanceType"
                                value="DEBIT"
                                checked={openingBalanceType === 'DEBIT'}
                                onChange={(e) =>
                                  setOpeningBalanceType(e.target.value)
                                }
                                className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                              />
                              <span className="text-black dark:text-white">
                                Debit (DR)
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="openingBalanceType"
                                value="CREDIT"
                                checked={openingBalanceType === 'CREDIT'}
                                onChange={(e) =>
                                  setOpeningBalanceType(e.target.value)
                                }
                                className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                              />
                              <span className="text-black dark:text-white">
                                Credit (CR)
                              </span>
                            </label>
                          </div>

                          {/* Opening Balance Amount Input */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={openingBalance}
                                onChange={(e) =>
                                  setOpeningBalance(e.target.value)
                                }
                                placeholder="Opening Balance Amount"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                              />
                            </div>
                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                              {openingBalanceType === 'CREDIT' ? 'Cr.' : 'Dr.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-300">
                        <button
                          type="button"
                          onClick={() => setisCustModelOpen(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddCustomer({
                              customerName: newCustomerName,

                              shippingAddress: shippingAddress,
                              shippingState: shippingState,
                              typeOfopeningBalance: openingBalanceType,
                              openingBalances: openingBalance,
                              previousOpType: openingBalanceType,
                              previousOpBalance: openingBalance,
                            })
                          }
                          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
                          disabled={
                            !newCustomerName.trim() ||
                            !shippingAddress.trim() ||
                            !shippingState
                          }
                        >
                          Add Customer
                        </button>
                      </div>
                    </div>
                  </Modalll>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default CreateVoucher;
