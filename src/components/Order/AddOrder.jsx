import React, { useEffect, useState, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import ReactDatePicker from 'react-datepicker';
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Modal from './Modal';
import * as Yup from 'yup';
import { MdDelete } from 'react-icons/md';
import useorder from '../../hooks/useOrder';
import useProduct from '../../hooks/useProduct';
import {
  ADD_CUSTOMER_URL,
  GET_INPROGRESSTRACK,
  GET_INVENTORYBalance,
  GET_INVENTORYLOCATION,
  GET_PRODUCTBYID_URL,
} from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from 'react-icons/io';
import Modall from './Modal';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import Modalll from './Modallll';
import { fetchCustomerGroup } from '../../redux/Slice/CustomerGroupSlice';
const AddOrder = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [supplierSelections, setSupplierSelections] = useState({});
  const { token } = currentUser;
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [isProductModalOpen, setisProductModalOpen] = useState(false);
  const [selectedCustomerGroup, setSelectedCustomerGroup] = useState(null);
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [shippingstate, setShippingState] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomerGroup(token));
  }, []);
  //customer group
  const customerGroup = useSelector(
    (state) => state?.nonPersisted?.customerGroup,
  );

  const [customerGroupList, setCustomerGroupList] = useState([]);
  console.log('jamshedpur+++++++++++', customerGroupList);

  useEffect(() => {
    if (customerGroup.data) {
      const formattedOptions = customerGroup.data.content.map((customer) => ({
        value: customer?.id,
        label: customer?.customerGroupName,
        customerObject: customer,
      }));
      setCustomerGroupList(formattedOptions);
    }
  }, [customerGroup.data]);

  const [orderTypeOptions, setorderTypeOptions] = useState([]);
  const [customerOptions, setcustomerOptions] = useState([]);
  const [prodIdOptions, setprodIdOptions] = useState([]);
  const [prodIdd, setprodIdd] = useState('');

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isINVENTORYModalOpen, setIsINVENTORYModalOpen] = useState(false);
  const [selectedINVENTORYData, setSelectedINVENTORYData] = useState(null);

  const [isInProgressModalOpen, setIsInProgressModalOpen] = useState(false);
  const [inProgressDataData, setInProgressData] = useState(null);

  const [suppId, setsuppId] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Supplier A' },
    { id: 2, name: 'Supplier B' },
    { id: 3, name: 'Supplier C' },
  ]);
  const {
    getorderType,
    orderTypee,
    productId,
    getprodId,
    getCustomer,
    customer,

    handleSubmit,
  } = useorder();

  useEffect(() => {
    getorderType();
    getCustomer();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      // Set loading to true when data starts loading
      await getprodId();

      setisLoading(false);
      // Set loading to false once data is loaded
    };

    fetchData();
  }, []);

  const [SelectedLocation, setSelectedLocation] = useState([]);
  const { getLocation, Location } = useorder();

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map((location) => ({
        value: location?.id,
        label: location.address,
        LocationObject: location,
        LocationId: { id: location.id },
      }));
      setSelectedLocation(formattedOptions);
    }
  }, [Location]);

  useEffect(() => {
    getLocation();
  }, []);

  console.log(SelectedLocation, '54545454545');

  console.log(productId, 'proddidddddd');
  console.log(customer, 'customer');

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleCheckboxChange = (selectedRowId, supplierId) => {
    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId,
      );

      if (rowIndex !== -1) {
        // Update supplierIds for the existing row
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === supplierId,
        );

        if (supplierExists) {
          // Remove the supplier if already exists
          updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
            (s) => s.supplierId !== supplierId,
          );
        } else {
          // Add new supplier to the row
          updated[rowIndex].supplierIds.push({
            supplierId,
            supplierName: '', // Optional: default supplier name if needed
          });
        }
      } else {
        // Add a new row with the selected supplier
        updated.push({
          selectedRowId,
          supplierIds: [{ supplierId, supplierName: '' }],
        });
      }
      return updated;
    });
  };

  const openSupplierModal = (id, rowIndex) => {
    setIsSupplierModalOpen(true);

    setsuppId(id); // For specific supplier modal logic
    setSelectedRowId(rowIndex); // Store the row index
  };

  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  const handleSupplierModalSubmit = () => {
    closeSupplierModal();
  };

  const [prodIdModal, setprodIdModal] = useState([]);
  const [customers, setCustomers] = useState([]); // Add this state

  useEffect(() => {
    if (orderTypee) {
      const formattedOptions = orderTypee.map((order) => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id },
      }));
      setorderTypeOptions(formattedOptions);
    }
    console.log(productId, 'japaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    if (productId) {
      const formattedProdIdOptions = productId?.map((prodId) => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id,
      }));
      setprodIdOptions(formattedProdIdOptions);
    }
    if (customer) {
      const formattedCustomerOptions = customer.map((customer) => ({
        value: customer.id,
        label: customer?.customerName,
        customerObject: customer,
        customer: customer.id,
      }));
      setcustomerOptions(formattedCustomerOptions);
    }
  }, [orderTypee, productId, customers]);

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

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width: '50%',
      height: '70%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const productgrp = [
    { value: 'KLC', label: 'KLC' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'NO T&L', label: 'NO T&L' },
  ];

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
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const validationSchema = Yup.object().shape({
    orderType: Yup.object()
      .shape({
        id: Yup.string().required('Order Type is required'),
      })
      .nullable()
      .required('Order Type is required'),

    orderDate: Yup.string().required('Order Date is required'),

    shippingDate: Yup.string().required('Shipping Date is required'),

    locationId: Yup.string().required('Location is required'),

    tagsAndLabels: Yup.string().required('Tags are required'),

    logoNo: Yup.string()
      .oneOf(['Yes', 'No'], 'Please select Yes or No')
      .required('Logo No is required'),
  });

  const handleProductIdChange = (option, setFieldValue) => {
    setFieldValue('productId', option.prodId);

    setprodIdd(option?.prodId);

    setIsModalOpen(true);
    setIsSupplierModalOpen(false);
  };

  const handleModalSubmit = (values) => {
    console.log(values, 'jump');
    if (
      values.orderCatagory === 'Embroidery' ||
      values.orderCatagory === 'Dyeing'
    ) {
      console.log('i am here');

      // Check if sourceProductId is empty object or has no id
      const isEmptyObject =
        !values.sourceProductId ||
        (typeof values.sourceProductId === 'object' &&
          Object.keys(values.sourceProductId).length === 0) ||
        !values.sourceProductId.id;

      if (isEmptyObject) {
        console.log('i am ggb here');
        toast.error(
          'Please select a source product ID for Embroidery or Dyeing category.',
        );
        return; // Stop execution - don't submit
      }
    }
    setprodIdModal((prevValues) => {
      console.log(prevValues, 'jumpss');
      // Ensure that previous values are preserved and the new ones are added.
      return [
        ...prevValues,
        {
          ...values,
          // Ensure any additional data you need to keep is added
        },
      ];
    });

    setIsModalOpen(false); // Close modal
  };
  console.log(prodIdModal, 'jumper');

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
    // useEffect(() => {
    //     getInventory()
    // }, [])
    setIsINVENTORYModalOpen(true);
  };

  const closeINVENTORYModal = () => {
    setIsINVENTORYModalOpen(false);
    setSelectedINVENTORYData(null);
  };

  const openInProgressModal = async (id, locId) => {
    setIsInProgressModalOpen(true);

    try {
      const response = await fetch(
        `${GET_INPROGRESSTRACK}${id}/location/${locId}/active`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setInProgressData(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch Product');
    }
  };

  const CloseInProgressModal = () => {
    setIsInProgressModalOpen(false);
    setInProgressData(null);
  };

  console.log(prodIdModal, 'prodddddddddddddddddddddddddd');
  const [isPopulated, setIsPopulated] = useState(false);

  console.log(selectedSuppliers, 'umerumer');

  const handleAddCustomer = async (name, group, email, state) => {
    const values = {
      customerName: name,
      customerGroup: { id: group?.id },
      shippingState: state,
      email: email,
    };

    try {
      const response = await fetch(ADD_CUSTOMER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Customer added successfully');

        // Simply refetch all customers after successful addition
        await getCustomer();

        setIsCustomerModalOpen(false);
        setNewCustomerName('');
      } else {
        toast.error(data.errorMessage || 'Failed to add customer');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };
  useEffect(() => {
    if (orderTypee) {
      const formattedOptions = orderTypee.map((order) => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id },
      }));
      setorderTypeOptions(formattedOptions);
    }
    console.log(productId, 'japaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    if (productId) {
      const formattedProdIdOptions = productId?.map((prodId) => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id,
      }));
      setprodIdOptions(formattedProdIdOptions);
    }
    if (customer) {
      const formattedCustomerOptions = customer.map((customer) => ({
        value: customer.id,
        label: customer?.customerName,
        customerObject: customer,
        customer: customer.id,
      }));
      setcustomerOptions(formattedCustomerOptions);
    }
  }, [orderTypee, productId, customers, customer]);

  console.log(prodIdModal, '88888888888888888888888888');

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Create Order" />
      <div>
        <Formik
          initialValues={{
            orderType: '',
            orderDate: '',
            shippingDate: '',
            tagsAndLabels: '',
            logoNo: '',
            productId: '',
            clientInstruction: '',
            customer: '',
            purchaseOrderNo: '',
            customisationDetails: '',
            locationId: null,

            orderProducts: [],
          }}
          validationSchema={validationSchema}
          // onSubmit={(values) => {

          //   console.log("Formik Values: ", values); // Log the entire form values
          // }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => {
            const handleDeleteSupplier = (rowIndex, supplierIndex) => {
              const updatedSuppliers = values.orderProducts[
                rowIndex
              ].productSuppliers.filter((_, idx) => idx !== supplierIndex);
              setFieldValue(
                `orderProducts[${rowIndex}].productSuppliers`,
                updatedSuppliers,
              );
            };

            const handleDeleteRow = (index) => {
              const updatedRows = prodIdModal.filter((_, i) => i !== index);
              setprodIdModal(updatedRows);

              const updatedOrderProducts = values.orderProducts.filter(
                (_, i) => i !== index,
              );
              setFieldValue('orderProducts', updatedOrderProducts);

              prevProdIdModalLength.current = updatedRows.length;
            };

            const orderCategoriesKey = values.orderProducts
              .map((p) => p?.orderCategory || '')
              .join('|');

            useEffect(() => {
              if (!values.locationId || !values.orderProducts?.length) return;
              const hasValidProduct = values.orderProducts.some(
                (p) => p?.products?.id,
              );
              if (!hasValidProduct) return;

              values.orderProducts.forEach((product, index) => {
                if (!product?.products?.id) return;
                if (product.isManualStock) return; // don't touch rows user edited manually

                const getInStock = async () => {
                  try {
                    const response = await fetch(
                      `${GET_INVENTORYBalance}/${product?.products?.id}/${values.locationId}`,
                      {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    );
                    if (!response.ok)
                      throw new Error('Failed to fetch inventory');

                    const data = await response.json();
                    if (
                      data?.closingBalance !== undefined &&
                      data?.instockRecieve !== undefined
                    ) {
                      const inStockValue =
                        data.closingBalance - data.instockRecieve;
                      setFieldValue(
                        `orderProducts[${index}].inStockQuantity`,
                        inStockValue || 0,
                      );
                    }
                  } catch (error) {
                    console.error('Error fetching inventory:', error);
                    toast.error(
                      `Failed to fetch inventory for product ${product?.products?.id}`,
                    );
                  }
                };

                getInStock();
              });
            }, [values?.locationId, orderCategoriesKey]);

            // add this import at the top:
            // import React, { useEffect, useState, useRef } from 'react';

            const prevProdIdModalLength = useRef(0);

            useEffect(() => {
              if (prodIdModal.length > prevProdIdModalLength.current) {
                const newItems = prodIdModal.slice(
                  prevProdIdModalLength.current,
                );
                const newRows = newItems.map((newItem) => ({
                  products: { id: newItem?.id || '' },
                  sourceProductId: newItem?.sourceProductId?.id || '',
                  orderCategory: newItem?.orderCatagory || '',
                  clientOrderQuantity: '',
                  inStockQuantity: '',
                  isManualStock: false,
                  quantityToManufacture: '',
                  clientShippingDate: '',
                  expectedDate: '',
                  value: '',
                  units: newItem?.units || '',
                  productSuppliers: [
                    { supplier: { id: '' }, supplierOrderQty: '' },
                  ],
                }));
                setFieldValue('orderProducts', [
                  ...values.orderProducts,
                  ...newRows,
                ]);
              }
              prevProdIdModalLength.current = prodIdModal.length;
            }, [prodIdModal]);

            // Run only on mount

            useEffect(() => {
              // Automatically populate supplier fields for each product
              prodIdModal.forEach((_, productIndex) => {
                const productSuppliers = selectedSuppliers.find(
                  (supplierRow) => supplierRow.selectedRowId === productIndex,
                )?.supplierIds;

                if (productSuppliers) {
                  productSuppliers.forEach((supplier, supplierIndex) => {
                    setFieldValue(
                      `orderProducts[${productIndex}].productSuppliers[${supplierIndex}].supplier.id`,
                      supplier?.supplierId?.id || '', // Ensure correct path to supplier ID
                    );
                  });
                }
              });
            }, [prodIdModal, selectedSuppliers, setFieldValue]);

            useEffect(() => {
              values.orderProducts.forEach((product, index) => {
                // Check if order type is WSClient
                const selectedOrderType = orderTypeOptions?.find(
                  (option) => option.value === values.orderType?.id,
                );

                selectedOrderType &&
                  console.log(
                    selectedOrderType.label,
                    'selected order type label',
                  );
                const isWSClient = selectedOrderType?.label === 'WSClients';

                // Use wholesalePrice for WSClient, otherwise use retailMrp
                console.log(prodIdModal[index], 'umi');

                const cost = isWSClient
                  ? prodIdModal[index]?.wPrice || 0
                  : prodIdModal[index]?.cost || 0;

                const quantityToManufacture =
                  product.inStockQuantity - product.clientOrderQuantity;
                const clientOrderQuantity = product.clientOrderQuantity;

                if (
                  product.clientOrderQuantity &&
                  product.inStockQuantity !== undefined
                ) {
                  if (product.clientOrderQuantity <= product.inStockQuantity) {
                    setFieldValue(
                      `orderProducts[${index}].quantityToManufacture`,
                      0,
                    );
                    setFieldValue(
                      `orderProducts[${index}].value`,
                      Math.abs(clientOrderQuantity * cost),
                    );
                  } else {
                    setFieldValue(
                      `orderProducts[${index}].quantityToManufacture`,
                      Math.abs(quantityToManufacture),
                    );
                    setFieldValue(
                      `orderProducts[${index}].value`,
                      Math.abs(clientOrderQuantity * cost),
                    );
                  }
                }
              });
            }, [
              values.orderProducts,
              values.orderType,
              setFieldValue,
              prodIdModal,
              orderTypeOptions,
            ]);

            console.log(values, '25632222');

            return (
              <Form>
                <div className="flex flex-col gap-9">
                  {/* Form fields */}
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3
                        className="font-medium text-slate-500 text-center text-xl dark:text-white"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          letterSpacing: '0.05em',
                          marginBottom: '1rem',
                        }}
                      >
                        ADD ORDER
                      </h3>
                    </div>
                    <div className="p-6.5">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Order Type{' '}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <ReactSelect
                            name="orderType"
                            value={
                              orderTypeOptions?.find(
                                (option) =>
                                  option.value === values.orderType.id,
                              ) || null
                            }
                            onChange={
                              (option) =>
                                setFieldValue(
                                  'orderType',
                                  option ? { id: option.value } : null,
                                ) // Send only ID
                            }
                            options={orderTypeOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Order Type"
                          />

                          <ErrorMessage
                            name="orderType"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Order Date{' '}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="orderDate"
                            type="date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                          />

                          <ErrorMessage
                            name="orderDate"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Order Location
                          </label>
                          <ReactSelect
                            name="locationId"
                            options={SelectedLocation}
                            value={
                              SelectedLocation.find(
                                (option) => option.value === values.locationId,
                              ) || null
                            }
                            onChange={(option) =>
                              setFieldValue('locationId', option.value)
                            }
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Select Source Location"
                          />
                          <ErrorMessage
                            name="locationId"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>
                      </div>

                      {(() => {
                        const selectedOrderType = orderTypeOptions.find(
                          (option) => option.value === values.orderType?.id,
                        );

                        return (
                          selectedOrderType &&
                          (selectedOrderType.label === 'RetailClients' ||
                            selectedOrderType.label === 'WSClients') && (
                            <div>
                              <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-[250px] mt-4">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Customer
                                  </label>
                                  <div className="flex gap-2">
                                    <ReactSelect
                                      name="Customer"
                                      value={
                                        customerOptions?.find(
                                          (option) =>
                                            option.value ===
                                            values.customer?.id,
                                        ) || null
                                      }
                                      onChange={(option) =>
                                        setFieldValue(
                                          'customer',
                                          option ? { id: option.value } : null,
                                        )
                                      }
                                      options={customerOptions}
                                      styles={customStyles}
                                      className="flex-1 bg-white dark:bg-form-Field"
                                      classNamePrefix="react-select"
                                      placeholder="Select Customer"
                                    />
                                  </div>
                                  <ErrorMessage
                                    name="Customer"
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-[250px] mt-4">
                                  <button
                                    type="button"
                                    onClick={() => setIsCustomerModalOpen(true)}
                                    className="mt-10 max-w-xs px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
                                  >
                                    Add New Customer
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px] mt-7">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Customer Purchase Order No
                                  </label>
                                  <Field
                                    name="purchaseOrderNo"
                                    placeholder="Enter Prchase Order"
                                    className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                  />
                                  <ErrorMessage
                                    name="purchaseOrderNo"
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-[200px] mt-7">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    PO Date
                                  </label>
                                  <Field name="poDate">
                                    {({ field, form }) => (
                                      <ReactDatePicker
                                        {...field}
                                        selected={
                                          (field.value &&
                                            new Date(field.value)) ||
                                          null
                                        }
                                        onChange={(date) =>
                                          form.setFieldValue(
                                            'poDate',
                                            date
                                              ? format(date, 'yyyy-MM-dd')
                                              : '', // Format to yyyy-MM-dd
                                          )
                                        }
                                        showPreviousDates={false}
                                        dateFormat="yyyy-MM-dd" // Display format in the picker
                                        placeholderText="Select Purchase Order Date"
                                        className="form-datepicker w-[430px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                      />
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    name="poDate"
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[300px] mt-4">
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
                                      setFieldValue(
                                        'salesChannel',
                                        option.value,
                                      )
                                    }
                                    onBlur={handleBlur}
                                    options={salesChannel}
                                    styles={customStyles}
                                    className="bg-white dark:bg-form-input"
                                    classNamePrefix="react-select"
                                    placeholder="Select"
                                  />
                                  <ErrorMessage
                                    name="tags"
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </div>

                                <div className="flex-1 min-w-[200px] mt-4">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Employee Name
                                  </label>
                                  <Field
                                    name="employeeName"
                                    placeholder="Enter Employee Name"
                                    className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                  />
                                  <ErrorMessage
                                    name="employeeName"
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        );
                      })()}

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Shipping Date{' '}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Field
                            name="shippingDate"
                            type="date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage
                            name="shippingDate"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>

                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Tags <span className="text-red-500 ml-1">*</span>
                          </label>
                          <ReactSelect
                            name="tagsAndLabels"
                            value={productgrp.find(
                              (option) => option.value === values.tags,
                            )}
                            onChange={(option) =>
                              setFieldValue('tagsAndLabels', option.value)
                            }
                            onBlur={handleBlur}
                            options={productgrp}
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Select"
                          />
                          <ErrorMessage
                            name="tagsAndLabels"
                            component="div"
                            className="text-red-600 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex ">
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Logo No <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div>
                            <label className="flex items-center">
                              <Field type="radio" name="logoNo" value="Yes" />
                              <span className="ml-1">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <Field type="radio" name="logoNo" value="No" />
                              <span className="ml-1">No</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="logoNo"
                            component="div"
                            className="text-red-600 text-sm"
                          />
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
                                  {selectedINVENTORYData?.map((row, index) => (
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
                                      {/* <td className="px-2 py-2 border-b">
                                                        <FiTrash2 size={17} className='text-red-500 hover:text-red-700 mx-2' title='Delete BOM' />

                                                    </td> */}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* <pre>{JSON.stringify(selectedBOMData, null, 2)}</pre> */}
                          </div>
                        </div>
                      )}

                      {isInProgressModalOpen && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
                          <div className="bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[200px] w-[870px] h-[400px] mt-[60px] overflow-auto relative">
                            {/* Close button inside scrollable container but positioned sticky */}
                            <div className="sticky top-0 z-10 flex justify-end bg-slate-100 pb-2">
                              <button
                                onClick={CloseInProgressModal}
                                className="text-red-500 text-xl font-bold hover:text-red-700"
                              >
                                &times;
                              </button>
                            </div>

                            <h2 className="text-2xl text-center mb-4 font-extrabold">
                              In Progress Orders Tracking.
                            </h2>

                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-auto">
                              <table className="min-w-full leading-normal">
                                <thead>
                                  <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Allocated Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Fulfilled Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      order No
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Product Id
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Product Description
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      location Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Allocated Quantity
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Received Quantity
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Remaining Quantity
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inProgressDataData?.length > 0 ? (
                                    inProgressDataData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="px-2 py-2 border-b">
                                          {row.allocatedDate}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.fulfilledDate}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row?.orderNo}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row?.productId}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.productDescription}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.locationName}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.allocatedQuantity}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.receivedQuantity}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.remainingQuantity}
                                        </td>
                                        <td className="px-2 py-2 border-b">
                                          {row.status}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="10"
                                        className="px-2 py-4 text-center"
                                      >
                                        <span>No Data Found</span>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {orderType && (
                        <div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px] mt-7">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Employee Name
                              </label>
                              <Field
                                name="employeeName"
                                placeholder="Enter Prchase Order"
                                className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                              />
                              <ErrorMessage
                                name="customer"
                                component="div"
                                className="text-red-600 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Product Id{' '}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <ReactSelect
                          name="productId"
                          value={
                            prodIdOptions?.find(
                              (option) => option.value === values.productId?.id,
                            ) || null
                          }
                          onChange={(option) =>
                            handleProductIdChange(option, setFieldValue)
                          }
                          isLoading={isLoading}
                          options={prodIdOptions || 'Loading'}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder={
                            isLoading
                              ? 'Loading Products...'
                              : 'Select ProductId'
                          }
                        />
                        <ErrorMessage
                          name="productId"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      {/* <div className="flex-1 min-w-[250px] mt-4">
                        <button
                          type="button"
                          onClick={() => setisProductModalOpen(true)}
                          className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Add New Product
                        </button>
                      </div> */}

                      {prodIdModal.length > 0 && (
                        <div className="  shadow-md rounded-lg  mt-3 overflow-scroll">
                          <table className="min-w-full leading-normal overflow-auto">
                            <thead>
                              <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                                <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ">
                                  Source Product Id
                                </th>
                                <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ">
                                  Product Id
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Order Category
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Client Order Qty
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[200px]">
                                  Units
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  In Stock Qty
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  View Product Inventory
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Qty To Manufacture
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Value
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Client Shipping Date
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Expected Date
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Add Weaver/Embroider
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Supplier Details
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Action
                                </th>

                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                              </tr>
                            </thead>

                            <tbody>
                              {prodIdModal?.map((item, index) => (
                                <tr
                                  key={index}
                                  className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                >
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    {item.orderCatagory
                                      .split(' ')
                                      .join('')
                                      .toLowerCase() === 'dyeing' ||
                                    item.orderCatagory
                                      .split(' ')
                                      .join('')
                                      .toLowerCase() === 'embroidery' ? (
                                      <div>
                                        <Field
                                          name={`orderProducts[${index}].sourceProductId.id`}
                                          value={
                                            item?.sourceProductId?.productId ||
                                            ''
                                          }
                                          placeholder="Enter Source Product ID"
                                          onChange={(e) => {
                                            console.log(
                                              `Source Product ID: ${e.target.value}`,
                                            ); // Log the value on change
                                          }}
                                          className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                        />
                                        <ErrorMessage
                                          name={`orderProducts[${index}].sourceProductId`}
                                          component="div"
                                          className="text-red-600 text-sm"
                                        />
                                      </div>
                                    ) : (
                                      <div>
                                        <p>Plain Order</p>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].products.id`}
                                        value={item?.productId || ''}
                                        placeholder="Enter Prchase Order"
                                        onChange={(e) => {
                                          console.log(
                                            `Product ID: ${e.target.value}`,
                                          ); // Log the value on change
                                        }}
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name={`orderProducts[${index}].products.id`}
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].orderCategory`}
                                        // value={item?.orderCatagory || ""}
                                        placeholder="Enter Order Category"
                                        onChange={(e) => {
                                          console.log(
                                            `Order Category: ${e.target.value}`,
                                          );
                                          setFieldValue(
                                            `orderProducts[${index}].orderCategory`,
                                            e.target.value,
                                          ); // Update the field value manually
                                        }}
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name="orderCategory"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].clientOrderQuantity`}
                                        // value={item?.productId}
                                        type="number"
                                        placeholder="Enter In Stock Qty"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name="clientOrderQuantity"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-1 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].units`}
                                        // value={item?.units}
                                        placeholder="Enter Units"
                                        className=" bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name="Units"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].inStockQuantity`}
                                        type="number"
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const inStockQuantity = value
                                            ? parseFloat(value)
                                            : 0;
                                          const cost = item.cost || 0;
                                          const quantity =
                                            values.orderProducts?.[index]
                                              ?.clientOrderQuantity || 0;
                                          const totalCost = cost * quantity;

                                          setFieldValue(
                                            `orderProducts[${index}].inStockQuantity`,
                                            inStockQuantity,
                                          );
                                          setFieldValue(
                                            `orderProducts[${index}].isManualStock`,
                                            true,
                                          );
                                          setFieldValue(
                                            `orderProducts[${index}].value`,
                                            totalCost,
                                          );
                                        }}
                                        placeholder="Enter In Stock Qty"
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name="InStockQty"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-2 py-5 border-b border-gray-200  text-sm gap-2">
                                    <div>
                                      <span
                                        onClick={() =>
                                          openINVENTORYModal(item?.id)
                                        }
                                        className=" mb-1 bg-green-100 view-badge text-green-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[220px]"
                                      >
                                        {' '}
                                        VIEW INVENTORY
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        onClick={() =>
                                          openInProgressModal(
                                            item?.id,
                                            values.locationId,
                                          )
                                        }
                                        className="bg-green-100 view-badge text-green-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[220px]"
                                      >
                                        {' '}
                                        In Progress Tracking
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].quantityToManufacture`}
                                        // value={item?.productId}
                                        type="number"
                                        placeholder="Enter Qty To Manufacture"
                                        className=" w-[130px] bg-white dark:bg-form-input  rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                      <ErrorMessage
                                        name="QtyToManufacture"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${index}].value`}
                                        readOnly
                                        type="number"
                                        placeholder="Calculated Value"
                                        className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                        // value={(() => {
                                        //   const cost = item.cost || 0;
                                        //   const quantity = values.orderProducts?.[index]?.clientOrderQuantity || 0;
                                        //   return cost * quantity;
                                        // })()}
                                        onChange={(e) => {
                                          e.preventDefault();
                                        }}
                                      />
                                      <ErrorMessage
                                        name="Value"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <div className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary">
                                        <ReactDatePicker
                                          selected={
                                            values.orderProducts[index]
                                              ?.clientShippingDate || null
                                          }
                                          onChange={(date) =>
                                            setFieldValue(
                                              `orderProducts[${index}].clientShippingDate`,
                                              date
                                                ? format(date, 'yyyy-MM-dd')
                                                : '',
                                            )
                                          }
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client Shipping Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                          withPortal
                                          showPreviousDates={false}
                                          portalId={`datepicker-portal-${index}`}
                                        />
                                      </div>

                                      <ErrorMessage
                                        name="ClientShippingDate"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div>
                                      <div
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                        onClick={(e) => e.stopPropagation()} // Prevents event bubbling
                                      >
                                        <ReactDatePicker
                                          selected={
                                            values.orderProducts[index]
                                              ?.expectedDate || null
                                          }
                                          onChange={(date) =>
                                            setFieldValue(
                                              `orderProducts[${index}].expectedDate`,
                                              date
                                                ? format(date, 'yyyy-MM-dd')
                                                : '',
                                            )
                                          }
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client expected Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                          withPortal
                                          portalId={`datepicker-portal-${index}`}
                                        />
                                      </div>
                                      <ErrorMessage
                                        name="ExpectedDate"
                                        component="div"
                                        className="text-red-600 text-sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <td className="px-5 py-5   text-sm">
                                      <div>
                                        <IoIosAdd
                                          size={30}
                                          onClick={() => {
                                            setSelectedRowId(index);
                                            openSupplierModal(item?.id, index);
                                          }}
                                        />
                                      </div>
                                    </td>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                      <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                          <thead>
                                            <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Supplier Name
                                              </th>
                                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Supplier Quantity
                                              </th>

                                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {selectedSuppliers
                                              .find(
                                                (supplierRow) =>
                                                  supplierRow.selectedRowId ===
                                                  index,
                                              )
                                              ?.supplierIds.map(
                                                (supplier, supplierIndex) => (
                                                  <tr
                                                    key={`supplier-row-${index}-${supplierIndex}`}
                                                    className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                                  >
                                                    {/* Supplier Name Field */}
                                                    <td
                                                      key={`supplier-${supplierIndex}`}
                                                      className="px-5 py-5 border-b border-gray-200 text-sm"
                                                    >
                                                      <Field
                                                        name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`}
                                                        placeholder="Supplier Name"
                                                        value={
                                                          supplier?.supplierId
                                                            ?.supplierName || ''
                                                        }
                                                        onChange={(e) =>
                                                          setFieldValue(
                                                            `orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`,
                                                            e.target.value,
                                                          )
                                                        }
                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                      />
                                                      <ErrorMessage
                                                        name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.id`}
                                                        component="div"
                                                        className="text-red-600 text-sm"
                                                      />
                                                    </td>

                                                    {/* Supplier Quantity Field */}
                                                    <td
                                                      key={`quantity-${supplierIndex}`}
                                                      className="px-5 py-5 border-b border-gray-200 text-sm"
                                                    >
                                                      <Field
                                                        name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                        placeholder="Supplier Quantity"
                                                        type="number"
                                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                                      />
                                                      <ErrorMessage
                                                        name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                        component="div"
                                                        className="text-red-600 text-sm"
                                                      />
                                                    </td>

                                                    {/* Delete Button */}
                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                      <MdDelete
                                                        size={20}
                                                        className="text-red-500 "
                                                        onClick={() =>
                                                          handleDeleteSupplier(
                                                            index,
                                                            supplierIndex,
                                                          )
                                                        }
                                                      />
                                                    </td>
                                                  </tr>
                                                ),
                                              )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                  {/* <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">{item?.orderType?.orderTypeName}</p>
                                </td> */}

                                  <td className="px-5 py-5 border-b items-center justify-center mt-[100px]">
                                    <MdDelete
                                      className="text-red-700"
                                      size={30}
                                      onClick={() => handleDeleteRow(index)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Client Instruction{' '}
                        </label>
                        <Field
                          as="textarea"
                          name="clientInstruction"
                          placeholder="Enter client instruction"
                          className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="clientInstruction"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {(() => {
                        const selectedOrderType = orderTypeOptions.find(
                          (option) => option.value === values.orderType?.id,
                        );

                        return (
                          selectedOrderType &&
                          (selectedOrderType.label === 'RetailClients' ||
                            selectedOrderType.label === 'WSClients') && (
                            <div className="flex-1 min-w-[200px] mt-11">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Customisation Details
                              </label>
                              <Field
                                as="textarea"
                                name="customisationDetails"
                                placeholder="Enter client instruction"
                                className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                              />
                              <ErrorMessage
                                name="customisationDetails"
                                component="div"
                                className="text-red-600 text-sm"
                              />
                            </div>
                          )
                        );
                      })()}

                      <button
                        type="submit"
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          isSubmitting ||
                          !values.orderType?.id ||
                          values.orderProducts.length === 0 ||
                          !values.locationId
                        }
                      >
                        {isSubmitting ? 'Adding Order...' : 'Add Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
        {isSupplierModalOpen && (
          <SupplierModal
            suppliers={suppliers}
            selectedRowId={selectedRowId}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

        <Modall
          setIsModalOpen={setIsModalOpen}
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          prodIdd={prodIdd}
          GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
          onSubmit={handleModalSubmit}
          width="70%"
          height="80%"
          style={{ marginLeft: '70px', marginRight: '0' }} // Add this line
        />

        {isCustomerModalOpen && (
          <Modalll
            isOpen={isCustomerModalOpen}
            onRequestClose={() => setIsCustomerModalOpen(false)}
            className="modal mr-[200px] mt-[10px]"
            overlayClassName="modal-overlay"
            width="700px"
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-black">
                Add New Customer
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-black dark:text-white mb-2">
                    Customer Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Customer Group <span className="text-red-500 ml-1">*</span>
                  </label>
                  <ReactSelect
                    name="customerGroup"
                    value={
                      customerGroupList?.find(
                        (option) => option.value === selectedCustomerGroup?.id,
                      ) || null
                    }
                    onChange={(option) => {
                      setSelectedCustomerGroup(
                        option ? option.customerObject : null,
                      );
                    }}
                    options={customerGroupList}
                    styles={customStyles}
                    className="bg-white dark:bg-form-input"
                    classNamePrefix="react-select"
                    placeholder="Select customer group"
                    isClearable
                  />
                </div>
              </div>
  <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-w-[200px] mt-4">
                <label className="block text-black dark:text-white mb-2">
                  Email <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                  placeholder="Enter customer email"
                />
              </div>
              <div className="flex-1 min-w-[300px] mt-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Billing State <span className="text-red-600">*</span>
                </label>
                <ReactSelect
                  name="shippingState"
                  styles={customStyles}
                  value={
                    stateOption.find(
                      (option) => option.value === shippingstate,
                    ) || null
                  }
                  onChange={(option) =>
                    setShippingState(option ? option.value : null)
                  }
                  options={stateOption}
                  className="bg-white dark:bg-form-input"
                  classNamePrefix="react-select"
                  placeholder="Select Shipping State"
                />
              </div>
             </div>

              {/* You can add more customer fields here as needed */}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddCustomer(
                      newCustomerName,
                      selectedCustomerGroup,
                      newCustomerEmail,
                      shippingstate,
                    )
                  }
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={!newCustomerName.trim() || !newCustomerEmail.trim()}
                >
                  Add Customer
                </button>
              </div>
            </div>
          </Modalll>
        )}
        {isProductModalOpen && (
          <Modalll
            isOpen={isProductModalOpen}
            onRequestClose={() => setisProductModalOpen(false)}
            className="modal mr-[200px] mt-[80px]"
            overlayClassName="modal-overlay"
            width="500px"
          >
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-black">
                Add New Customer
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-black dark:text-white mb-2">
                  Id
                </label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Customer Group
                </label>
                <ReactSelect
                  name="customerGroup"
                  value={
                    customerGroupList?.find(
                      (option) => option.value === selectedCustomerGroup?.id,
                    ) || null
                  }
                  onChange={(option) => {
                    setSelectedCustomerGroup(
                      option ? option.customerObject : null,
                    );
                  }}
                  options={customerGroupList}
                  styles={customStyles}
                  className="bg-white dark:bg-form-input"
                  classNamePrefix="react-select"
                  placeholder="Select customer group"
                  isClearable
                />
              </div>

              {/* You can add more customer fields here as needed */}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddCustomer(newCustomerName, selectedCustomerGroup)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={!newCustomerName.trim()}
                >
                  Add Customer
                </button>
              </div>
            </div>
          </Modalll>
        )}
      </div>
    </DefaultLayout>
  );
};

export default AddOrder;
