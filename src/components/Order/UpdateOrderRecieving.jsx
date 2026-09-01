import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // Import a Flatpickr theme
import Modal from './Modal';
import * as Yup from 'yup';
import useorder from '../../hooks/useOrder';
import ReactDatePicker from 'react-datepicker';
import useProduct from '../../hooks/useProduct';
import {
  customStyles as createCustomStyles,
  GET_PRODUCTBYID_URL,
  GET_ORDERBYID_URL,
  UPDATE_ORDER_URL,
  VIEW_ORDER_PRODUCT,
  UPDATE_ORDERPRODUCT_ALL,
  UPDATE_ISSUECHALLAN,
  UPDATE_ORDERRECIEVED,
  VIEW_SUPPLIERHISTORY,
  UPDATE_ReceivedQuantity_URL,
  VIEW_FABRIC_DETAIL,
} from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from 'react-icons/io';
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SupplierModall from './SupplierModall';
import { Table } from 'react-bootstrap';

const UpdateOrderRecieving = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add this state in your component
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [orderTypeOptions, setorderTypeOptions] = useState([]);
  const [prodIdOptions, setprodIdOptions] = useState([]);
  const [prodIdd, setprodIdd] = useState('');
  const [order, setOrder] = useState(null); // To store fetched product data
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [suppId, setsuppId] = useState();
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [customerOptions, setcustomerOptions] = useState([]);
  const { token } = currentUser;
  const [supplier, setsupplier] = useState([]);

  const [fabricDetails, setfabricDetails] = useState([]);
  const [orderProduct, setorderProduct] = useState([]);

  const [selectedRowId, setSelectedRowId] = useState(null);

  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Supplier A' },
    { id: 2, name: 'Supplier B' },
    { id: 3, name: 'Supplier C' },
  ]);
  const { productId, getLocation, Location } = useorder();

  useEffect(() => {
    getLocation();
  }, []);

  console.log(Location, 'llkkllkkllkk');

  const theme = useSelector((state) => state?.persisted?.theme);

  const { id } = useParams();

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedLocation, setselectedLocation] = useState([]);
  const [SupplierList, setSupplierList] = useState([]);

  const Locations = [
    { value: 'Srinagar', label: 'Srinagar' },
    { value: 'Delhi', label: 'Delhi' },
  ];

  const Status = [{ value: 'Closed', label: 'Closed' }];

  const PendingStatus = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Forced_Closure', label: 'Forced Closure' },
  ];


  const [showModal, setshowModal] = useState(false);

  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  console.log(productId, 'looool');

  const getSupplierHistory = async () => {
    try {
      const response = await fetch(
        `${VIEW_SUPPLIERHISTORY}/${id}/supplier-qty`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      console.log(data, 'jhanvi');
      setsupplier(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const getOrderById = async () => {
    try {
      const response = await fetch(`${VIEW_ORDER_PRODUCT}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      console.log(data, 'luciiiiferrrrrrrrrrrrrr');
      setOrder(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const getFabricDetails = async () => {
    try {
      const response = await fetch(`${VIEW_FABRIC_DETAIL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data,"4515");
      
      setfabricDetails(data);
    } catch (error) {
      console.error('Error fetching fabric details:', error);
    }
  };

  console.log(fabricDetails, 'fabricDetails');

  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
    getSupplierHistory();
    getFabricDetails();
  }, [id]);

  const [prodIdModal, setprodIdModal] = useState([]);

  const OrderCategoryOptions = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'PlainOrder', label: 'PlainOrder' },
  ];

  const ExecutionStatus = [
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'NeedModification', label: 'Need Modification' },
  ];

  const customStyles = createCustomStyles(theme?.mode);

  useEffect(() => {
    if (order?.productSuppliers) {
      const initialSuppliers = order.productSuppliers.map((supplier) => ({
        selectedRowId: supplier.productId, // Assuming there's a productId field
        supplierId: supplier.supplier.id,
        supplierName: supplier.supplier.name,
        supplierOrderQty: supplier.supplierOrderQty || 0,
      }));

      setSelectedSuppliers(initialSuppliers); // Set suppliers when page loads
    }
  }, [order]);
  useEffect(() => {
    if (order?.productSuppliers) {
      const Suppliers = order.productSuppliers.map((supplier) => ({
        label: supplier?.supplier.name,
        value: supplier?.supplier.id,
      }));

      setSupplierList(Suppliers); // Set suppliers when page loads
    }
  }, [order]);

  console.log('suplierrrrrrrrrrrrrr+====', order?.productSuppliers);

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map((location) => ({
        value: location?.id,
        label: `${location?.state}(${location.address})`,
        LocationObject: location,
        LocationId: { id: location.id },
      }));

      setselectedLocation(formattedOptions); // Set Location when page loads
    }
  }, [Location]);

  console.log(
    selectedSuppliers,
    'kikikikikikikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
  );

  const handleModalSubmit = (values) => {
    console.log(values, 'gfdsa');

    setprodIdModal((prevValues) => [...prevValues, values]);
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    console.log(values, 'jamhhgg');

    const formattedValues = {
      product: {
        id: values?.productsId,
      },
      sourceProductId: Number(values?.sourceProductsId),

      receivedQuantity: values.receivedQuantity,
      receivedDate: values.receivedDate,
      supplier: {
        id: values.supplier,
      },

      pendingQuantity: values.pendingQuantity,
      defectiveQuantity: values.defectiveQuantity,
      extraQuantity: values.extraQuantity,
      productStatus: values.productStatus,
      location: values.location,
    };
    console.log(formattedValues, 'nishi');

    try {
      const url = `${UPDATE_ORDERRECIEVED}/${id}`;
      const method = 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      const data = await response.json();
      if (response?.ok) {
        toast.success(`Order Recieved Status Updated successfully`);
        navigate('/order/partiallyApproved');

        // getCurrency(pagination.currentPage); // Fetch updated Currency
      } else {
        console.log(response, 'kk');
        toast.error(`${data?.errorMessage}`);
      }
    } catch (error) {
      console.error(error, 'hfff');
      toast.error(error);
    }

    // You can now send `finalData` to the backend or do any other operation with it
  };

  const handleUpdateSupplierQuantity = async () => {
    if (!selectedSupplierId) {
      toast.warning('Please select a supplier to update');
      return;
    }

    // Find the selected supplier data
    const selectedSupplier = supplier?.suppliers?.find(
      (item, index) => (item.id || index) === selectedSupplierId,
    );

    if (!selectedSupplier) {
      toast.error('Selected supplier not found');
      return;
    }

    // Prepare the data for API update
    const updateData = {
      id: selectedSupplier.id,
      qty: selectedSupplier.receivedQuantity,
      receivedDate: new Date().toISOString().split('T')[0],
      // Add any other fields your API expects
    };

    try {
      const response = await fetch(
        `${UPDATE_ReceivedQuantity_URL}/${selectedSupplier.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Updated ${selectedSupplier.supplierName} quantity successfully!`,
        );
        setSelectedSupplierId(null); // Clear selection after successful update
        // Optionally refresh the data
        // fetchSupplierData();
      } else {
        toast.error(data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating supplier quantity:', error);
      toast.error('An error occurred while updating');
    }
  };

  const nowReceivable =
    order?.quantityToManufacture -
    supplier?.suppliers?.reduce(
      (total, supplier) => total + (supplier.receivedQuantity || 0),
      0,
    );

  // console.log(nowReceivable, "22222222222222220");

  // console.log(order, "5454545");

  // console.log(selectedSupplierId, "000000000000000");
  // console.log(supplier, "11111");

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order Product" />
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            // orderNo: order?.orderNo || '',
            orderCategory: order?.orderCategory || '',
            productId: order?.products?.productId,
            sourceProductId: order?.sourceProductName || '',
            quantityToManufacture: order?.quantityToManufacture,

            expectedDate: order?.expectedDate,
            supplier: {
              id: '',
            },
            productsId: order?.products?.id,
            sourceProductsId: order?.sourceProductId,

            // quantityToManufacture: order?.quantityToManufacture,
            units: order?.units,
            expectedSupplierDate: order?.expectedSupplierDate,
            updatedBy: order?.updatedBy,

            // supplierName: product.productSuppliers?.supplier?.name || '', // Safely accessing supplier name
            // supplierOrderQty: product.productSuppliers?.[0]?.supplierOrderQty || 0,
            productSuppliers:
              order?.productSuppliers?.map((supplier) => ({
                supplier: {
                  id: supplier?.id, // Send supplier ID
                },

                supplierOrderQty: supplier.supplierOrderQty || 0,
              })) || [],

            receivedQuantity: '',
            receivedDate: '',

            pendingQuantity: '',

            defectiveQuantity: '',

            extraQuantity: '',

            productStatus: '',
            location: '',
            // expectedSupplierDate: "",
            // updatedBy: order?.updatedBy

            // customer: '',
          }}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur, isSubmitting }) => (
            <Form>
              <div className="flex flex-col gap-9">
                {/* Form fields */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                      Update Order
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="flex flex-wrap gap-3">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Order No
                        </label>
                        <ReactSelect
                          name="orderNo"
                          value={
                            order?.orderNo
                              ? { label: order.orderNo, value: order.orderNo }
                              : null
                          } // Display orderNo
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order No"
                          isDisabled={true} // Disabled field
                        />
                        <ErrorMessage
                          name="orderNo"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Order Category
                        </label>
                        <ReactSelect
                          name="orderCategory"
                          value={
                            OrderCategoryOptions.find(
                              (option) => option.value === values.orderCategory,
                            ) || null
                          }
                          onChange={(option) =>
                            setFieldValue('orderCategory', option.value)
                          } // Store only value
                          options={OrderCategoryOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          isDisabled={true}
                          placeholder="Select Order Category"
                        />

                        <ErrorMessage
                          name="salesChannel"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Product ID
                        </label>
                        <Field
                          name="sourceProductId"
                          readOnly
                          value={values?.sourceProductId} // Ensure it reflects Formik state
                          onChange={(e) =>
                            setFieldValue('sourceProductId', e.target.value)
                          } // Update Formik state
                          className="w-[270px] bg-gray-3 dark:bg-form-input rounded border-[1.5px] border-stroke  text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage
                          name="sourceProductId"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Product ID */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Product ID
                        </label>
                        <Field
                          name="productId"
                          readOnly
                          value={values?.productId} // Ensure it reflects Formik state
                          onChange={(e) =>
                            setFieldValue('productId', e.target.value)
                          } // Update Formik state
                          className="w-[270px] bg-gray-3 dark:bg-form-input rounded border-[1.5px] border-stroke  text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage
                          name="productId"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Quantity to Manufacture */}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <div className="flex-1 min-w-[250px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Unit
                        </label>
                        <Field
                          name="units"
                          className="w-[260px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke  text-black"
                          readOnly
                        />
                        <ErrorMessage
                          name="units"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div className="flex-1 ml-9 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white min-w-[10px]">
                          Supplier Order Quantity
                        </label>
                        <Field
                          name="quantityToManufacture"
                          className="w-[260px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage
                          name="quantityToManufacture"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                        {supplier && supplier?.suppliers?.length > 0 && (
                          <>
                            <div>
                              <button
                                type="button"
                                className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                                onClick={() => {
                                  setshowModal(true);
                                }}
                              >
                                View Supplier History
                              </button>
                            </div>
                            <span className="text-red-600 text-2xl text-nowrap">
                              Note:Now Receivable For Every Supplier:{' '}
                              {nowReceivable}{' '}
                              <button
                                type="button"
                                className="text-sm text-red-400"
                                onClick={() => {
                                  setshowModal(true);
                                }}
                              >
                                Check History Above
                              </button>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Order No */}

                      {/* Order Category */}
                      <div className="flex-1 ml-12 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Expected Date
                        </label>
                        <Field
                          type="date"
                          readOnly
                          // name={`orderProducts[${index}].expectedDate`}
                          value={values.expectedDate || ''}
                          className="w-[260px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          //readOnly
                        />
                        <ErrorMessage
                          name="salesChannel"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div className="flex-1  ml-11">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Expected Supplier Date
                        </label>
                        <Field
                          type="date"
                          readOnly
                          // name={`orderProducts[${index}].expectedDate`}
                          value={values.expectedSupplierDate || ''}
                          className="w-[260px]  bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-9 text-black"
                          //readOnly
                        />
                        <ErrorMessage
                          name="salesChannel"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Product ID */}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Recieved Quantity{' '}
                          <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="number"
                          name="receivedQuantity"
                          className="w-[260px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          onChange={(e) => {
                            console.log('hey');

                            const receivedQuantity =
                              parseInt(e.target.value) || 0;
                            const quantityToManufacture =
                              parseInt(values.quantityToManufacture) || 0;

                            // Determine which quantity to use as the base
                            const baseQuantity =
                              nowReceivable > 0
                                ? nowReceivable
                                : quantityToManufacture;
                            const baseFieldName =
                              nowReceivable > 0
                                ? 'nowReceivable'
                                : 'quantityToManufacture';
                            console.log(
                              'Received quantity exceeds now receivable quantity:',
                              receivedQuantity,
                              nowReceivable,
                            );

                            // if (nowReceivable > 0 && receivedQuantity > nowReceivable) {

                            //   toast.error(`Received quantity cannot exceed ${baseFieldName} quantity of ${baseQuantity}`);
                            //   return;
                            // }

                            setFieldValue('receivedQuantity', receivedQuantity);
                            setFieldValue(
                              'pendingQuantity',
                              Math.max(0, baseQuantity - receivedQuantity),
                            );
                            setFieldValue(
                              'extraQuantity',
                              Math.max(0, receivedQuantity - baseQuantity),
                            );
                          }}
                        />

                        <ErrorMessage
                          name="quantityToManufacture"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      {/* Order No */}

                      <div className="flex-1 pl-16  min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Recieved Date <span className="text-red-600">*</span>
                        </label>
                        <Field
                          type="date"
                          name="receivedDate"
                          // name={receivedDate}
                          // name={`orderProducts[${index}].expectedDate`}
                          // value={values.receivedDate || ""}
                          className="w-[260px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-9 text-black"
                          //readOnly
                        />
                        <ErrorMessage
                          name="salesChannel"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="z-20 pl-14 bg-transparent dark:bg-form-Field">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Select Supplier
                        </label>
                        <ReactSelect
                          name="supplierName"
                          // value={productgrp.find(option => option.value === values.customerName)}
                          onChange={(option) =>
                            setFieldValue(
                              'supplier',
                              option ? option.value : null,
                            )
                          }
                          // options={formattedSupplier}

                          options={[
                            { label: 'View All Suppliers', value: null },
                            ...SupplierList,
                          ]}
                          styles={customStyles} // Pass custom styles here
                          className=" w-[260px] bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select supplier Name"
                        />
                      </div>
                      <div className="flex-1 ml-9 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Pending Quantity
                        </label>
                        <Field
                          name="pendingQuantity"
                          className="w-[260px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage
                          name="pendingQuantity"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Order Category */}

                      {/* Product ID */}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Defective Quantity
                        </label>
                        <Field
                          type="number"
                          name="defectiveQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          // Read-only field
                        />
                        <ErrorMessage
                          name="defectiveQuantity"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Extra Quantity
                        </label>
                        <Field
                          name="extraQuantity"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage
                          name="extraQuantity"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Product Location
                        </label>
                        <ReactSelect
                          name="location"
                          value={
                            selectedLocation?.find(
                              (option) => option.value === values.location.id,
                            ) || null
                          }
                          // value={
                          //   salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          // } // Display the selected value
                          onChange={(option) =>
                            setFieldValue(
                              'location',
                              option ? { id: option.value } : null,
                            )
                          } // Update Formik value
                          options={selectedLocation}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Execution Status"
                        />
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Order No */}

                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Last Updated By
                        </label>
                        <Field
                          name="updatedBy"
                          className="w-[200px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage
                          name="updatedBy"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Status
                        </label>
                        <ReactSelect
                          name="productStatus"
                          // value={
                          //   salesChannelOptions.find((option) => option.value === values.salesChannel) || null
                          // } // Display the selected value
                          onChange={(option) =>
                            setFieldValue(
                              'productStatus',
                              option ? option.value : '',
                            )
                          } // Update Formik value
                          options={
                            values.pendingQuantity > 0 ||
                            values.defectiveQuantity > 0
                              ? PendingStatus
                              : Status
                          }
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Status"
                        />
                        <ErrorMessage
                          name="productStatus"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>

                      {/* Order Category */}

                      {/* Product ID */}
                    </div>

                    <div>
                      {fabricDetails && fabricDetails.length > 0 && (
                        <div className="mt-5">
                          <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white mb-3">
                            Fabric Details
                          </h3>

                          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                              <table className="min-w-full leading-normal">
                                <thead>
                                  <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Fabric Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                      Fabric Quantity
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fabricDetails.map((fabric, index) => (
                                    <tr key={index}>
                                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <input
                                          value={fabric?.fiberProductName} // Display only this fabric's name
                                          readOnly
                                          className="w-[290px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                        />
                                      </td>
                                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                        <input
                                          value={fabric?.deductedInventoryQty} // Display only this fabric's quantity
                                          readOnly
                                          className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
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
                              </tr>
                            </thead>
                            <tbody>
                              {selectedSuppliers.map((supplierData, index) => (
                                <tr key={index}>
                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <input
                                      value={supplierData.supplierName} // Display only this supplier's name
                                      readOnly
                                      className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      readOnly
                                      name={`selectedSuppliers[${index}].supplierOrderQty`}
                                      value={supplierData.supplierOrderQty}
                                      type="number"
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>
                                  <Field
                                    name={`productSuppliers[${index}].supplier.id`}
                                    type="hidden"
                                    value={supplierData.supplierId} // Send Supplier ID in Form Submission
                                  />
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* Add New Supplier Button */}

                          {/* <button
              type="button"
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                const newSupplier = { supplierName: '', supplierOrderQty: 0 };
                setFieldValue('productSuppliers', [...values.productSuppliers, newSupplier]);
              }}
            >
              Add Supplier
            </button> */}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      {' '}
                      {/* Centering the button */}
                      <button
                        // type="button" // Ensures the button does not trigger the form submission
                        // onClick={(e) => handleUpdateSubmit(values, e)}
                        className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <ModalUpdate
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          prodIdd={prodIdd}
          GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
          onSubmit={handleModalSubmit}
          width="70%"
          height="80%"
          style={{ marginLeft: '70px', marginRight: '0' }} // Add this line
        />
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[90vh]  max-w-[99vh] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Supplier History</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700 w-12">
                        Select
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Supplier Name
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        Received Date
                      </th>
                      {/* <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {supplier?.suppliers?.map((supplierData, index) => {
                      const isSelected =
                        selectedSupplierId === (supplierData.id || index);
                      const isQuantityEditable = isSelected;

                      return (
                        <tr
                          key={supplierData.id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 border-b text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                // Only allow selecting one row at a time
                                if (isSelected) {
                                  setSelectedSupplierId(null);
                                } else {
                                  setSelectedSupplierId(
                                    supplierData.id || index,
                                  );
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-900">
                            {supplierData.supplierName}
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="number"
                              value={supplierData.receivedQuantity}
                              onChange={(e) => {
                                if (!isSelected) {
                                  toast.warning(
                                    'Please select this row first to edit quantity',
                                  );
                                  return;
                                }

                                const updatedSuppliers = [
                                  ...supplier.suppliers,
                                ];
                                updatedSuppliers[index] = {
                                  ...updatedSuppliers[index],
                                  receivedQuantity:
                                    parseFloat(e.target.value) || 0,
                                };
                                setsupplier({
                                  ...supplier,
                                  suppliers: updatedSuppliers,
                                });
                              }}
                              disabled={!isQuantityEditable}
                              className={`w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isQuantityEditable
                                  ? 'border-gray-300 bg-white'
                                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                              }`}
                              min="0"
                              step="1"
                            />
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-900">
                            {new Date(
                              supplierData.receivedDate,
                            ).toLocaleDateString()}
                          </td>
                          {/* <td className="px-4 py-3 border-b">
                      <button
                        onClick={() => {
                          const updatedSuppliers = supplier.suppliers.filter((_, i) => i !== index);
                          setsupplier({ ...supplier, suppliers: updatedSuppliers });
                          // Clear selection if deleted row was selected
                          if (isSelected) {
                            setSelectedSupplierId(null);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {(!supplier?.suppliers || supplier.suppliers.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No supplier history found
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleUpdateSupplierQuantity}
                  disabled={!selectedSupplierId}
                  className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                    selectedSupplierId
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
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
                  Update Selected Quantity
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setshowModal(false);
                    setSelectedSupplierId(null); // Reset selection on close
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UpdateOrderRecieving;
