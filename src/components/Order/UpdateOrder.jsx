import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from "react-router-dom";
import ReactSelect from 'react-select';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import Modal from './Modal';
import * as Yup from 'yup';
import useorder from '../../hooks/useOrder';
import ReactDatePicker from "react-datepicker";
import useProduct from '../../hooks/useProduct';
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, GET_INVENTORYBalance, GET_ORDERBYIDD_URL, GET_ORDERBYIDDD_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import SupplierUpdate from './SupplierUpdate';
import { useFormikContext } from "formik";
import SupplierUpdateProduct from './SupplierUpdateProduct';

const UpdateOrder = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")
  const [order, setOrder] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isSupplierModalOpenProduct, setIsSupplierModalOpenProduct] = useState(false);
  const [suppId, setsuppId] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [customerOptions, setcustomerOptions] = useState([])
  const { token } = currentUser;
  const navigate = useNavigate();

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowIdProduct, setSelectedRowIdProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([
    // { id: 1, name: "Supplier A" },
    // { id: 2, name: "Supplier B" },
    // { id: 3, name: "Supplier C" },
  ])

  const [SelectedLocation, setSelectedLocation] = useState([])
  const {
    getLocation, Location
  } = useorder();

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map(location => ({
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

  console.log(SelectedLocation, "54545454545");

  const {
    getorderType,
    orderTypee,
    productId,
    customer,
    getprodId,
    getCustomer,
  } = useorder();

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedSuppliersProduct, setSelectedSuppliersProduct] = useState([]);

  const [prodIdModal, setprodIdModal] = useState([])

  // Helper function to check if product is new (from prodIdModal)
  const isNewProduct = (index) => {
    return index >= (order?.orderProducts?.length || 0);
  };

  const handleCheckboxChange = (selectedRowId, supplierId, supplierName) => {
    console.log('Adding supplier - RAW DATA:', { selectedRowId, supplierId, supplierName });

    let actualSupplierId;
    let actualSupplierName;

    if (supplierId && typeof supplierId === 'object') {
      actualSupplierId = supplierId.id;
      actualSupplierName = supplierId.supplierName || supplierName || '';
    } else {
      actualSupplierId = supplierId;
      actualSupplierName = supplierName || '';
    }

    console.log('Adding supplier - EXTRACTED:', {
      actualSupplierId,
      actualSupplierName,
      originalSupplierId: supplierId
    });

    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === actualSupplierId
        );

        if (supplierExists) {
          updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
            (s) => s.supplierId !== actualSupplierId
          );
        } else {
          updated[rowIndex].supplierIds.push({
            supplierId: actualSupplierId,
            supplierName: actualSupplierName,
            supplierOrderQty: 0,
          });
        }
      } else {
        updated.push({
          selectedRowId,
          supplierIds: [{
            supplierId: actualSupplierId,
            supplierName: actualSupplierName,
            supplierOrderQty: 0
          }],
        });
      }
      return updated;
    });

    toast.success(`Supplier ${actualSupplierName} added`);
  };

  // FIXED: handleCheckboxChangeProduct - Correctly extracts supplier data
  const handleCheckboxChangeProduct = (selectedRowId, supplier) => {
    console.log("=== DEBUG: Adding supplier to product ===");
    console.log("selectedRowId:", selectedRowId);
    console.log("supplier object:", supplier);

    let supplierId;
    let supplierName;

    if (supplier && typeof supplier === 'object') {
      if (supplier.id !== undefined) {
        supplierId = supplier.id;
        supplierName = supplier.supplierName || supplier.name || `Supplier ${supplier.id}`;
      }
      else if (supplier.supplierId && typeof supplier.supplierId === 'object') {
        supplierId = supplier.supplierId.id;
        supplierName = supplier.supplierId.supplierName || supplier.supplierId.name || `Supplier ${supplierId}`;
      }
      else if (supplier.supplierId) {
        supplierId = supplier.supplierId;
        supplierName = supplier.supplierName || supplier.name || `Supplier ${supplierId}`;
      }
    } else {
      supplierId = supplier;
      supplierName = `Supplier ${supplierId}`;
    }

    console.log("EXTRACTED VALUES:", { supplierId, supplierName });

    if (!supplierId) {
      console.error("No supplier ID found!");
      toast.error("Invalid supplier data");
      return;
    }

    setSelectedSuppliersProduct((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === supplierId
        );

        if (!supplierExists) {
          updated[rowIndex].supplierIds.push({
            supplierId: supplierId,
            supplierName: supplierName,
            supplierOrderQty: 0,
          });
          toast.success(`Supplier ${supplierName} added`);
        } else {
          toast.info(`Supplier ${supplierName} already added`);
        }
      } else {
        updated.push({
          selectedRowId,
          supplierIds: [{
            supplierId: supplierId,
            supplierName: supplierName,
            supplierOrderQty: 0,
          }],
        });
        toast.success(`Supplier ${supplierName} added`);
      }
      return updated;
    });
  };

  const openSupplierModal = (id, rowIndex) => {
    setIsSupplierModalOpen(true);
    setSelectedRowId(rowIndex);
    setsuppId(id)
  };

  const openSupplierModalProduct = (id, rowIndex) => {
    setIsSupplierModalOpenProduct(true);
    setSelectedRowIdProduct(rowIndex);
    setsuppId(id)
  };

  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };

  const closeSupplierModalProduct = () => {
    setIsSupplierModalOpenProduct(false);
  };

  const handleSupplierModalSubmit = () => {
    console.log("Selected Suppliers:", selectedSuppliers);

    selectedSuppliers.forEach((item, idx) => {
      console.log(`Supplier group ${idx}:`, item);
      item.supplierIds.forEach((supplier, sIdx) => {
        console.log(`  Supplier ${sIdx}:`, {
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName,
          typeOfId: typeof supplier.supplierId
        });
      });
    });

    const suppliersForCurrentProduct = selectedSuppliers.filter(
      item => item.selectedRowId === selectedRowId
    );

    closeSupplierModal();
  };

  const handleSupplierModalSubmitProduct = () => {
    console.log("Selected Suppliers Product:", selectedSuppliersProduct);
    closeSupplierModalProduct();
  };

  // FIXED: For new products - Prevents duplicate suppliers when updating quantity
  const handleSupplierQuantityUpdate = (productIndex, supplierIndex, quantity, setFieldValue, values) => {
    const qty = parseInt(quantity) || 0;

    setSelectedSuppliersProduct(prev => {
      const updated = [...prev];
      const productSuppliers = updated.find(
        item => item.selectedRowId === productIndex
      );

      if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
        productSuppliers.supplierIds[supplierIndex].supplierOrderQty = qty;
      }

      return updated;
    });

    const startingIndex = order?.orderProducts?.length || 0;
    const actualIndex = startingIndex + productIndex;

    const productSuppliers = selectedSuppliersProduct.find(
      item => item.selectedRowId === productIndex
    );

    if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
      const supplier = productSuppliers.supplierIds[supplierIndex];

      const currentSuppliers = values.orderProducts[actualIndex]?.productSuppliers || [];

      const existingIndex = currentSuppliers.findIndex(
        s => s.supplier?.id === supplier.supplierId
      );

      if (existingIndex !== -1) {
        const updatedSuppliers = [...currentSuppliers];
        updatedSuppliers[existingIndex] = {
          ...updatedSuppliers[existingIndex],
          supplierOrderQty: qty
        };
        setFieldValue(`orderProducts[${actualIndex}].productSuppliers`, updatedSuppliers);
      } else {
        setFieldValue(`orderProducts[${actualIndex}].productSuppliers`, [
          ...currentSuppliers,
          {
            supplier: {
              id: supplier.supplierId
            },
            supplierOrderQty: qty
          }
        ]);
      }
    }
  };

  // FIXED: For existing products - Prevents duplicate suppliers when updating quantity
  const handleSupplierQuantityUpdateExisting = (productIndex, supplierIndex, quantity, setFieldValue, values) => {
    const qty = parseInt(quantity) || 0;

    setSelectedSuppliers(prev => {
      const updated = [...prev];
      const productSuppliers = updated.find(
        item => item.selectedRowId === productIndex
      );

      if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
        productSuppliers.supplierIds[supplierIndex].supplierOrderQty = qty;
      }

      return updated;
    });

    const productSuppliers = selectedSuppliers.find(
      item => item.selectedRowId === productIndex
    );

    if (productSuppliers && productSuppliers.supplierIds[supplierIndex]) {
      const supplier = productSuppliers.supplierIds[supplierIndex];

      const currentSuppliers = values.orderProducts[productIndex]?.productSuppliers || [];

      const existingIndex = currentSuppliers.findIndex(
        s => s.supplier?.id === supplier.supplierId
      );

      if (existingIndex !== -1) {
        const updatedSuppliers = [...currentSuppliers];
        updatedSuppliers[existingIndex] = {
          ...updatedSuppliers[existingIndex],
          supplierOrderQty: qty
        };
        setFieldValue(`orderProducts[${productIndex}].productSuppliers`, updatedSuppliers);
      } else {
        setFieldValue(`orderProducts[${productIndex}].productSuppliers`, [
          ...currentSuppliers,
          {
            supplier: {
              id: supplier.supplierId
            },
            supplierOrderQty: qty
          }
        ]);
      }
    }
  };

  const handleDeleteSupplierProduct = (productIndex, supplierIndex, setFieldValue, values) => {
    const productSuppliers = selectedSuppliersProduct.find(
      item => item.selectedRowId === productIndex
    );

    if (!productSuppliers || !productSuppliers.supplierIds[supplierIndex]) {
      return;
    }

    const supplierId = productSuppliers.supplierIds[supplierIndex].supplierId;

    setSelectedSuppliersProduct(prev => {
      const updated = [...prev];
      const productRowIndex = updated.findIndex(
        row => row.selectedRowId === productIndex
      );

      if (productRowIndex !== -1) {
        updated[productRowIndex].supplierIds = updated[productRowIndex].supplierIds.filter(
          (_, idx) => idx !== supplierIndex
        );

        if (updated[productRowIndex].supplierIds.length === 0) {
          updated.splice(productRowIndex, 1);
        }
      }

      return updated;
    });

    const startingIndex = order?.orderProducts?.length || 0;
    const actualIndex = startingIndex + productIndex;

    const currentSuppliers = values.orderProducts[actualIndex]?.productSuppliers || [];
    const updatedSuppliers = currentSuppliers.filter(
      s => s.supplier?.id !== supplierId
    );

    setFieldValue(`orderProducts[${actualIndex}].productSuppliers`, updatedSuppliers);

    toast.success('Supplier removed successfully');
  };

  const handleDeleteSupplierExisting = (productIndex, supplierIndex, setFieldValue, values) => {
    const productSuppliers = selectedSuppliers.find(
      item => item.selectedRowId === productIndex
    );

    if (!productSuppliers || !productSuppliers.supplierIds[supplierIndex]) {
      return;
    }

    const supplierId = productSuppliers.supplierIds[supplierIndex].supplierId;

    setSelectedSuppliers(prev => {
      const updated = [...prev];
      const productRowIndex = updated.findIndex(
        row => row.selectedRowId === productIndex
      );

      if (productRowIndex !== -1) {
        updated[productRowIndex].supplierIds = updated[productRowIndex].supplierIds.filter(
          (_, idx) => idx !== supplierIndex
        );

        if (updated[productRowIndex].supplierIds.length === 0) {
          updated.splice(productRowIndex, 1);
        }
      }

      return updated;
    });

    const currentSuppliers = values.orderProducts[productIndex]?.productSuppliers || [];
    const updatedSuppliers = currentSuppliers.filter(
      s => s.supplier?.id !== supplierId
    );

    setFieldValue(`orderProducts[${productIndex}].productSuppliers`, updatedSuppliers);

    toast.success('Supplier removed successfully');
  };

  useEffect(() => {
    getorderType();
    getprodId();
    getCustomer();
  }, [])

  const { id } = useParams();

  const handleUpdateSubmit = async (values) => {
    console.log("=== DEBUG: Checking Formik values BEFORE submission ===");
    values.orderProducts.forEach((product, index) => {
      console.log(`Product ${index} (isNew: ${isNewProduct(index)}):`, {
        productId: product.products?.productId,
        sourceProductId: product.sourceProductId,
        hasIdField: !!product.id,
        suppliersCount: product.productSuppliers?.length || 0,
      });
    });

    const formattedData = {
      orderNo: values.orderNo,
      orderType: values.orderType ? { id: values.orderType.id } : null,
      location: values.locationId ? { id: values.locationId } : null,
      customer: values.customer ? { id: values.customer.id } : null,
      purchaseOrderNo: values.purchaseOrderNo,
      poDate: values.poDate,
      salesChannel: values.salesChannel,
      employeeName: values.employeeName,
      customisationDetails: values.customisationDetails,
      orderDate: values.orderDate,
      expectingDate: values.expectingDate,
      shippingDate: values.shippingDate,
      tagsAndLabels: values.tagsAndLabels,
      logoNo: values.logoNo,
      clientInstruction: values.clientInstruction,

      orderProducts: values.orderProducts.map((product, index) => {
        const isNew = isNewProduct(index);

        const productSuppliers = (product.productSuppliers || []).map(supplier => {
          const supplierId = supplier.supplier?.id;

          if (!supplierId) return null;

          return {
            supplier: {
              id: Number(supplierId)
            },
            supplierOrderQty: Number(supplier.supplierOrderQty) || 0
          };
        }).filter(Boolean);

        let sourceProductIdValue = null;
        const sourceProduct = product.sourceProductId;

        if (sourceProduct && typeof sourceProduct === 'object') {
          sourceProductIdValue = sourceProduct.id ? Number(sourceProduct.id) : null;
        } else if (sourceProduct && !isNaN(Number(sourceProduct))) {
          sourceProductIdValue = Number(sourceProduct);
        } else {
          sourceProductIdValue = null;
        }

        return {
          products: {
            id: product.products?.id || product.products?.productId || product.id || ''
          },
          sourceProductId: sourceProductIdValue,
          sourceProductName: product.sourceProductName || '',
          orderCategory: product.orderCategory || '',
          inStockQuantity: Number(product.inStockQuantity) || 0,
          clientOrderQuantity: String(product.clientOrderQuantity || ''),
          quantityToManufacture: Number(product.quantityToManufacture) || 0,
          units: product.units || 'Pcs',
          value: Number(product.value) || 0,
          clientShippingDate: product.clientShippingDate || null,
          expectedDate: product.expectedDate || null,
          productSuppliers: productSuppliers
        };
      })
    };

    console.log("=== PAYLOAD BEING SENT TO BACKEND ===");
    console.log("Location being sent:", formattedData.location);
    console.log("Total products:", formattedData.orderProducts.length);
    formattedData.orderProducts.forEach((product, index) => {
      console.log(`Product ${index}:`, {
        hasIdField: !!product.id,
        productId: product.products?.id,
        sourceProductId: product.sourceProductId,
        sourceProductName: product.sourceProductName,
        supplierCount: product.productSuppliers?.length || 0,
      });
    });
    console.log("Full JSON payload:", JSON.stringify(formattedData, null, 2));

    try {
      const url = `${UPDATE_ORDER_URL}/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        let errorMessage = "Failed to update order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errorMessage || errorMessage;
        } catch (e) {
          console.error("Could not parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("=== BACKEND RESPONSE ===", data);

      await getOrderById();

      const totalSuppliers = formattedData.orderProducts.reduce((acc, product) => acc + (product.productSuppliers?.length || 0), 0);
      toast.success(`Order Updated Successfully`);
      navigate('/Order/ViewOrder');

    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An error occurred while updating the order");
    }
  };

  const getOrderById = async () => {
    try {
      const response = await fetch(`${GET_ORDERBYIDDD_URL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();

      const updatedOrderProducts = await Promise.all(
        data.orderProducts.map(async (product) => {
          if (product.sourceProductId) {
            try {
              const sourceProductRes = await fetch(`${GET_PRODUCTBYID_URL}/${product.sourceProductId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const sourceProductData = await sourceProductRes.json();
              return {
                ...product,
                sourceProductName: sourceProductData.productId
              };
            } catch (error) {
              console.error("Failed to fetch source product:", error);
              return { ...product, sourceProductName: null };
            }
          }
          return { ...product, sourceProductName: null };
        })
      );

      setOrder({ ...data, orderProducts: updatedOrderProducts });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrderById();
  }, [id]);

  // ✅ FIXED: Split into two effects so prodIdOptions populates when productId arrives
  useEffect(() => {
    if (orderTypee?.length) {
      const formattedOptions = orderTypee.map(order => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id }
      }));
      setorderTypeOptions(formattedOptions);
    }
  }, [orderTypee]);

  useEffect(() => {
    if (productId?.length) {
      const formattedProdIdOptions = productId.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id
      }));
      setprodIdOptions(formattedProdIdOptions);
    }
  }, [productId]);

  useEffect(() => {
    if (customer && Array.isArray(customer)) {
      const formatted = customer.map(c => ({
        value: c.id,
        label: c.customerName,
        data: c
      }));
      setcustomerOptions(formatted);
    }
  }, [customer]);

  const productgrp = [
    { value: 'KLC', label: 'KLC' },
    { value: 'CLIENT', label: 'CLIENT' },
    { value: 'NO T&L', label: 'NO T&L' },
  ];

  const salesChannelOptions = [
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '50px',
      fontSize: '16px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '10px 14px',
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
  };

  const validationSchema = Yup.object().shape({
    orderType: Yup.string().required('Order Type is required'),
    orderDate: Yup.date().required('Order Date is required'),
    shippingDate: Yup.date().required('Shipping Date is required'),
    tags: Yup.string().required('Tags are required'),
    logoNo: Yup.string().required('Logo No is required'),
    clientInstruction: Yup.string().required('Client Instruction is required'),
    customer: orderType ? Yup.string().required('Customer is required') : Yup.string(),
  });

  // ✅ FIXED: Guard against null option (ReactSelect fires onChange(null) when cleared)
  const handleProductIdChange = (option, setFieldValue) => {
    if (!option) return;
    setFieldValue('productId', option.prodId);
    setprodIdd(option.prodId)
    setIsModalOpen(true);
    setIsSupplierModalOpen(false)
  };

  const handleModalSubmit = (values) => {
    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values, "kiki");
  };

  const handleDeleteSupplier = (rowIndex, supplierIndex, setFieldValue, values) => {
    handleDeleteSupplierExisting(rowIndex, supplierIndex, setFieldValue, values);
  };

  const handleDeleteSupplierr = (rowIndex, supplierIndex, setFieldValue, values) => {
    console.log('=== DELETING SUPPLIER ===');
    console.log('Product Index (rowIndex):', rowIndex);
    console.log('Supplier Index to delete:', supplierIndex);
    console.log('Product data:', values.orderProducts[rowIndex]);
    console.log('Suppliers before deletion:', values.orderProducts[rowIndex]?.productSuppliers);

    const currentSuppliers = values.orderProducts[rowIndex]?.productSuppliers || [];

    if (supplierIndex < 0 || supplierIndex >= currentSuppliers.length) {
      console.error('Invalid supplier index:', supplierIndex);
      toast.error('Cannot delete supplier: Invalid index');
      return;
    }

    const supplierToDelete = currentSuppliers[supplierIndex];
    const supplierName = supplierToDelete?.supplier?.name || supplierToDelete?.supplierId || 'Unknown Supplier';

    const updatedProductSuppliers = currentSuppliers.filter(
      (_, idx) => idx !== supplierIndex
    );

    console.log('Suppliers after deletion:', updatedProductSuppliers);

    setOrder(prevOrder => {
      if (!prevOrder || !prevOrder.orderProducts) return prevOrder;

      const updatedOrder = { ...prevOrder };
      updatedOrder.orderProducts = [...updatedOrder.orderProducts];
      updatedOrder.orderProducts[rowIndex] = {
        ...updatedOrder.orderProducts[rowIndex],
        productSuppliers: updatedProductSuppliers
      };

      return updatedOrder;
    });

    setFieldValue(`orderProducts[${rowIndex}].productSuppliers`, updatedProductSuppliers);

    toast.success(`Supplier "${supplierName}" removed successfully`);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = prodIdModal.filter((_, i) => i !== index);
    setprodIdModal(updatedRows);

    setSelectedSuppliersProduct(prev =>
      prev.filter(item => item.selectedRowId !== index)
    );
  };

  const getSupplierName = (supplierId) => {
    if (!supplierId) return '';

    const supplierFromList = suppliers.find(s => s.id === supplierId);
    if (supplierFromList) return supplierFromList.name;

    for (const supplierGroup of selectedSuppliers) {
      const supplier = supplierGroup.supplierIds.find(s => s.supplierId === supplierId);
      if (supplier) return supplier.supplierName;
    }

    for (const supplierGroup of selectedSuppliersProduct) {
      const supplier = supplierGroup.supplierIds.find(s => s.supplierId === supplierId);
      if (supplier) return supplier.supplierName;
    }

    return 'Unknown Supplier';
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            orderNo: order?.orderNo || '',
            orderType: order?.orderType || '',
            locationId: order?.locationId || '',
            customer: order?.customer || null,
            purchaseOrderNo: order?.purchaseOrderNo || '',
            poDate: order?.poDate || '',
            salesChannel: order?.salesChannel || '',
            employeeName: order?.employeeName || '',
            customisationDetails: order?.customisationDetails || '',
            orderDate: order?.orderDate || '',
            expectingDate: order?.expectingDate || '',
            shippingDate: order?.shippingDate || '',
            tagsAndLabels: order?.tagsAndLabels || '',
            logoNo: order?.logoNo || '',
            clientInstruction: order?.clientInstruction || '',
            productId: '',   // ✅ ADDED: needed so the Product Id select can track selection
            orderProducts: [
              ...(order?.orderProducts?.map(product => ({
                products: {
                  id: product.productId,
                  productId: product.productIdName,
                },
                sourceProductId: product.sourceProductId || null,
                sourceProductName: product.sourceProductName || '',
                orderCategory: product.orderCategory || '',
                inStockQuantity: product.inStockQuantity || 0,
                clientOrderQuantity: String(product.clientOrderQuantity || ''),
                quantityToManufacture: product.quantityToManufacture || 0,
                units: product.units || 'Pcs',
                value: product.value || 0,
                clientShippingDate: product.clientShippingDate || '',
                expectedDate: product.expectedDate || '',
                productSuppliers: product.productSuppliers?.map(supplier => ({
                  supplier: {
                    id: supplier?.supplier?.id || '',
                    name: supplier?.supplier?.name || ''
                  },
                  supplierOrderQty: supplier.supplierOrderQty || 0
                })) || []
              })) || []),

              ...(prodIdModal?.map(item => ({
                products: {
                  id: item.id || item.productId || '',
                  productId: item.productId || item.id || '',
                },
                sourceProductId: item.sourceProductId?.id || null,
                sourceProductName: item.sourceProductId?.productId || '',
                orderCategory: item.orderCatagory || '',
                inStockQuantity: 0,
                clientOrderQuantity: '',
                quantityToManufacture: 0,
                units: item.units || 'Pcs',
                value: 0,
                clientShippingDate: '',
                expectedDate: '',
                productSuppliers: []
              })) || [])
            ]
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur }) => {

            // EFFECT 1: FETCH INVENTORY FOR NEW PRODUCTS WHEN LOCATION CHANGES
            useEffect(() => {
              if (values.locationId && prodIdModal.length > 0) {
                const startingIndex = order?.orderProducts?.length || 0;

                prodIdModal.forEach((item, index) => {
                  const adjustedIndex = startingIndex + index;
                  const productId = item?.id;

                  if (!productId) return;

                  const fetchInventory = async () => {
                    try {
                      const response = await fetch(
                        `${GET_INVENTORYBalance}/${productId}/${values.locationId}`,
                        {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      if (!response.ok) {
                        throw new Error('Failed to fetch inventory');
                      }

                      const data = await response.json();
                      console.log(data, "Inventory data for new product", productId);

                      if (data && data.closingBalance !== undefined && data.instockRecieve !== undefined) {
                        const inStockValue = data.closingBalance - data.instockRecieve;
                        setFieldValue(`orderProducts[${adjustedIndex}].inStockQuantity`, inStockValue);
                      }
                    } catch (error) {
                      console.error("Error fetching inventory:", error);
                      toast.error(`Failed to fetch inventory for product ${productId}`);
                    }
                  };

                  fetchInventory();
                });
              }
            }, [values.locationId, prodIdModal.length, order?.orderProducts?.length, token, setFieldValue]);

            // EFFECT 2: CALCULATE VALUE FOR NEW PRODUCTS
            useEffect(() => {
              if (prodIdModal.length > 0) {
                const startingIndex = order?.orderProducts?.length || 0;

                prodIdModal.forEach((item, index) => {
                  const adjustedIndex = startingIndex + index;
                  const cost = item?.cost || 0;
                  const clientQty = Number(values.orderProducts[adjustedIndex]?.clientOrderQuantity) || 0;
                  const inStockQty = Number(values.orderProducts[adjustedIndex]?.inStockQuantity) || 0;

                  let calculatedValue = 0;
                  if (clientQty <= inStockQty) {
                    calculatedValue = clientQty * cost;
                  } else {
                    const qtyToManufacture = clientQty - inStockQty;
                    calculatedValue = qtyToManufacture * cost;
                  }

                  setFieldValue(`orderProducts[${adjustedIndex}].value`, calculatedValue);
                });
              }
            }, [
              values.orderProducts.map(p => p.clientOrderQuantity).join(','),
              values.orderProducts.map(p => p.inStockQuantity).join(','),
              prodIdModal,
              setFieldValue,
              order?.orderProducts?.length
            ]);

            return (
              <Form>
                <div className="flex flex-col gap-9">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        Update Order
                      </h3>
                    </div>
                    <div className="p-6.5">

                      <div className="flex flex-wrap gap-4">

                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">Order Type</label>
                          <ReactSelect
                            name="orderType"
                            value={orderTypeOptions?.find(option => option.value === values.orderType?.id) || null}
                            onChange={(option) => setFieldValue('orderType', option ? option.orderTypeObject : null)}
                            options={orderTypeOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Order Type"
                            isDisabled={true}
                          />
                          <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex-1 min-w-[200px]">
                            <label className="mb-2.5 block text-black dark:text-white">Order Date</label>
                            <Field
                              name='orderDate'
                              type="date"
                              placeholder="Enter Order Date"
                              className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                            />
                          </div>
                          <ErrorMessage name="orderDate" component="div" className="text-red-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">Order Location</label>
                          <ReactSelect
                            name="locationId"
                            options={SelectedLocation}
                            value={SelectedLocation.find(option => option.value === values.locationId) || null}
                            onChange={(option) => setFieldValue('locationId', option ? option.value : null)}
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Select Source Location"
                          />
                          <ErrorMessage name="locationId" component="div" className="text-red-600 text-sm" />
                        </div>
                      </div>

                      {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                        <div>
                          <div className="flex-1 min-w-[300px] mt-4">
                            <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                            <ReactSelect
                              name="customer"
                              styles={customStyles}
                              className="bg-white dark:bg-form-Field"
                              value={
                                values.customer
                                  ? {
                                    label: values.customer.customerName,
                                    value: values.customer.id,
                                    data: values.customer
                                  }
                                  : null
                              }
                              onChange={(option) => setFieldValue("customer", option ? option.data : null)}
                              options={customerOptions}
                              classNamePrefix="react-select"
                              placeholder="Select Customer"
                            />
                            <ErrorMessage name="Customer" component="div" className="text-red-600 text-sm" />
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px] mt-7">
                              <label className="mb-2.5 block text-black dark:text-white">Customer Purchase Order No</label>
                              <Field
                                name="purchaseOrderNo"
                                placeholder="Enter Purchase Order"
                                className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                value={values.purchaseOrderNo}
                              />
                              <ErrorMessage name="customer" component="div" className="text-red-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-[200px] mt-7">
                              <label className="mb-2.5 block text-black dark:text-white">PO Date</label>
                              <Field
                                name='poDate'
                                type="date"
                                placeholder="Enter Purchase Order Date"
                                className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                value={values.poDate}
                              />
                              <ErrorMessage name="poDate" component="div" className="text-red-600 text-sm" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[300px] mt-4">
                              <label className="mb-2.5 block text-black dark:text-white">Sales Channel</label>
                              <ReactSelect
                                name="salesChannel"
                                value={salesChannelOptions.find(option => option.value === values.salesChannel) || null}
                                options={salesChannelOptions}
                                styles={customStyles}
                                className="bg-white dark:bg-form-Field"
                                classNamePrefix="react-select"
                                placeholder="Select Customer"
                              />
                              <ErrorMessage name="Customer" component="div" className="text-red-600 text-sm" />
                            </div>

                            <div className="flex-1 min-w-[200px] mt-4">
                              <label className="mb-2.5 block text-black dark:text-white">Employee Name</label>
                              <Field
                                name="employeeName"
                                placeholder="Enter Employee Name"
                                className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                value={values.employeeName}
                              />
                              <ErrorMessage name="employeeName" component="div" className="text-red-600 text-sm" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Shipping Date <span className="text-red-500 ml-1">*</span></label>
                          <Field
                            name="shippingDate"
                            type="date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                          />
                          <ErrorMessage name="shippingDate" component="div" className="text-red-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Tags</label>
                          <ReactSelect
                            name="tagsAndLabels"
                            value={productgrp.find(option => option.value === values.tagsAndLabels) || null}
                            onChange={(option) => setFieldValue('tagsAndLabels', option.value)}
                            onBlur={handleBlur}
                            options={productgrp}
                            styles={customStyles}
                            className="bg-white dark:bg-form-input"
                            classNamePrefix="react-select"
                            placeholder="Select"
                          />
                          <ErrorMessage name="tags" component="div" className="text-red-600 text-sm" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px] mt-4">
                          <label className="mb-2.5 block text-black dark:text-white">Logo No</label>
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
                          <ErrorMessage name="logoNo" component="div" className="text-red-600 text-sm" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                        <ReactSelect
                          name="productId"
                          value={prodIdOptions?.find(option => option.value === values.productId) || null}
                          onChange={(option) => handleProductIdChange(option, setFieldValue)}
                          options={prodIdOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select ProductId"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>

                      <div className="shadow-md rounded-lg mt-3 overflow-scroll">
                        <table className="min-w-full leading-normal overflow-auto">
                          <thead>
                            <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                              <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Source Product Id
                              </th>
                              <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Product Id
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Order Category
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Client Order Qty
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Units
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                In Stock Qty
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
                                Supplier Details
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Action
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.orderProducts?.map((product, index) => {
                              if (isNewProduct(index)) return null;

                              return (
                                <tr key={index}>
                                  {/* EXISTING */}
                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    {product.orderCategory?.toLowerCase() === 'dyeing' || product.orderCategory?.toLowerCase() === 'embroidery' ? (
                                      <div>
                                        <Field
                                          type="hidden"
                                          name={`orderProducts[${index}].sourceProductId`}
                                          value={product.sourceProductId || ""}
                                        />
                                        <Field
                                          name={`orderProducts[${index}].sourceProductName`}
                                          value={product.sourceProductName || ""}
                                          className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                          placeholder="Source Product ID"
                                          readOnly
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                        Plain Order
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].products.productId`}
                                      value={values.orderProducts?.[index]?.products?.productId || ""}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                      placeholder="Enter Product ID"
                                      readOnly
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].orderCategory`}
                                      value={values.orderProducts[index]?.orderCategory || ''}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                      readOnly
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].clientOrderQuantity`}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const numValue = Number(value) || 0;
                                        setFieldValue(`orderProducts[${index}].clientOrderQuantity`, value);
                                        setFieldValue(`orderProducts[${index}].quantityToManufacture`, numValue);
                                      }}
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].units`}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].inStockQuantity`}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                      onChange={(e) => {
                                        const value = Number(e.target.value) || 0;
                                        const clientOrderValue = Number(values.orderProducts[index]?.clientOrderQuantity) || 0;
                                        const newQuantityToManufacture = Math.max(0, clientOrderValue - value);

                                        setFieldValue(`orderProducts[${index}].inStockQuantity`, value);
                                        setFieldValue(`orderProducts[${index}].quantityToManufacture`, newQuantityToManufacture);
                                      }}
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].quantityToManufacture`}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      name={`orderProducts[${index}].value`}
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      type="date"
                                      name={`orderProducts[${index}].clientShippingDate`}
                                      className="w-[167px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <Field
                                      type="date"
                                      name={`orderProducts[${index}].expectedDate`}
                                      className="w-[167px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <IoIosAdd size={30} onClick={() => openSupplierModal(product?.products?.id, index)} />
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                      <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                          <thead>
                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
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
                                            {values.orderProducts[index]?.productSuppliers?.map((supplierData, supplierIndex) => {
                                              const supplierId = supplierData.supplier?.id;
                                              const supplierName = supplierData.supplier?.name || getSupplierName(supplierId);

                                              return (
                                                <tr key={supplierIndex}>
                                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                    <div className="w-[130px] bg-gray-200 dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black">
                                                      {supplierName}
                                                      <Field
                                                        type="hidden"
                                                        name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplier.name`}
                                                        value={supplierName}
                                                      />
                                                    </div>
                                                  </td>

                                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                    <Field
                                                      name={`orderProducts[${index}].productSuppliers[${supplierIndex}].supplierOrderQty`}
                                                      placeholder="Supplier Quantity"
                                                      type="number"
                                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                                    />
                                                  </td>

                                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                    <MdDelete
                                                      size={20}
                                                      className="text-red-500 cursor-pointer hover:text-red-700"
                                                      onClick={() => handleDeleteSupplierr(index, supplierIndex, setFieldValue, values)}
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                            {selectedSuppliers
                                              .find((supplierRow) => supplierRow.selectedRowId === index)
                                              ?.supplierIds
                                              .map((supplier, supplierIndex) => {
                                                const existsInFormik = values.orderProducts[index]?.productSuppliers?.some(
                                                  s => s.supplier?.id === supplier.supplierId
                                                );

                                                const startingIndex = values.orderProducts[index]?.productSuppliers?.length || 0;
                                                const adjustedIndex = startingIndex + supplierIndex;

                                                return (
                                                  <tr
                                                    key={`supplier-row-${index}-${supplier.supplierId}`}
                                                    className={`bg-white dark:bg-slate-700 dark:text-white px-5 py-3 ${existsInFormik ? 'hidden' : ''}`}
                                                    style={existsInFormik ? { display: 'none' } : {}}
                                                  >
                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                      <input
                                                        type="text"
                                                        value={supplier.supplierName || ""}
                                                        readOnly
                                                        className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3"
                                                      />
                                                    </td>

                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                      <input
                                                        type="number"
                                                        value={supplier.supplierOrderQty || 0}
                                                        onChange={(e) => {
                                                          const newQuantity = Number(e.target.value) || 0;
                                                          handleSupplierQuantityUpdateExisting(
                                                            index,
                                                            supplierIndex,
                                                            newQuantity,
                                                            setFieldValue,
                                                            values
                                                          );
                                                        }}
                                                        className="w-[130px] bg-white dark:bg-form-input rounded border py-2 px-3"
                                                        placeholder="Enter quantity"
                                                        min="0"
                                                      />
                                                    </td>

                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                      <MdDelete
                                                        size={20}
                                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                                        onClick={() => handleDeleteSupplier(index, supplierIndex, setFieldValue, values)}
                                                      />
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}

                            {prodIdModal?.map((item, index) => {
                              const startingIndex = order?.orderProducts?.length || 0;
                              const adjustedIndex = startingIndex + index;

                              const productSuppliers = selectedSuppliersProduct.find(
                                supplierRow => supplierRow.selectedRowId === index
                              );

                              return (
                                <tr key={`new-${index}`} className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3">

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    {item?.orderCatagory?.toLowerCase() === 'dyeing' || item?.orderCatagory?.toLowerCase() === 'embroidery' ? (
                                      <div>
                                        <Field
                                          type="hidden"
                                          name={`orderProducts[${adjustedIndex}].sourceProductId`}
                                          value={item?.sourceProductId?.id || values.orderProducts[adjustedIndex]?.sourceProductId || ""}
                                        />
                                        <Field
                                          type="text"
                                          name={`orderProducts[${adjustedIndex}].sourceProductName`}
                                          value={item?.sourceProductId?.productId || item?.sourceProductName || values.orderProducts[adjustedIndex]?.sourceProductName || ""}
                                          placeholder="Enter Source Product ID"
                                          onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            setFieldValue(`orderProducts[${adjustedIndex}].sourceProductName`, enteredValue);
                                          }}
                                          className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3 text-center">
                                        Plain Order
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        type="text"
                                        name={`orderProducts[${adjustedIndex}].products.id`}
                                        value={item?.productId || ""}
                                        readOnly
                                        className="w-[130px] bg-gray-200 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black dark:text-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${adjustedIndex}].orderCategory`}
                                        value={item?.orderCatagory || ""}
                                        placeholder="Enter Order Category"
                                        onChange={(e) => {
                                          setFieldValue(`orderProducts[${adjustedIndex}].orderCategory`, e.target.value);
                                        }}
                                        readOnly
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        type="text"
                                        name={`orderProducts[${adjustedIndex}].clientOrderQuantity`}
                                        placeholder="Enter Client Order Qty"
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const numValue = Number(value) || 0;
                                          setFieldValue(`orderProducts[${adjustedIndex}].clientOrderQuantity`, value);
                                          setFieldValue(`orderProducts[${adjustedIndex}].quantityToManufacture`, numValue);
                                        }}
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${adjustedIndex}].units`}
                                        placeholder="Enter Units"
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        type="number"
                                        name={`orderProducts[${adjustedIndex}].inStockQuantity`}
                                        placeholder="Enter In Stock Qty"
                                        onChange={(e) => {
                                          const inStockValue = Number(e.target.value);
                                          const clientOrderValue = Number(values.orderProducts[adjustedIndex]?.clientOrderQuantity) || 0;
                                          const newQuantityToManufacture = Math.max(clientOrderValue - inStockValue, 0);

                                          setFieldValue(`orderProducts[${adjustedIndex}].inStockQuantity`, inStockValue);
                                          setFieldValue(`orderProducts[${adjustedIndex}].quantityToManufacture`, newQuantityToManufacture);
                                        }}
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        type="number"
                                        name={`orderProducts[${adjustedIndex}].quantityToManufacture`}
                                        placeholder="Enter Qty To Manufacture"
                                        readOnly
                                        className="w-[130px] bg-gray-200 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black dark:text-white outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <Field
                                        name={`orderProducts[${adjustedIndex}].value`}
                                        type="number"
                                        placeholder="Auto-calculated Value"
                                        className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                                        readOnly
                                        value={(() => {
                                          const cost = item?.cost || 0;
                                          const clientQty = Number(values.orderProducts[adjustedIndex]?.clientOrderQuantity) || 0;
                                          const inStockQty = Number(values.orderProducts[adjustedIndex]?.inStockQuantity) || 0;

                                          if (clientQty <= inStockQty) {
                                            return clientQty * cost;
                                          } else {
                                            const qtyToManufacture = clientQty - inStockQty;
                                            return qtyToManufacture * cost;
                                          }
                                        })()}
                                      />
                                      <ErrorMessage name={`orderProducts[${adjustedIndex}].value`} component="div" className="text-red-600 text-sm" />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <div
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ReactDatePicker
                                          selected={values.orderProducts[adjustedIndex]?.clientShippingDate || null}
                                          onChange={(date) => setFieldValue(`orderProducts[${adjustedIndex}].clientShippingDate`, date ? date.toISOString().split("T")[0] : "")}
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client Shipping Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <div
                                        className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus-within:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus-within:border-primary"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ReactDatePicker
                                          selected={values.orderProducts[adjustedIndex]?.expectedDate || null}
                                          onChange={(date) => setFieldValue(`orderProducts[${adjustedIndex}].expectedDate`, date ? date.toISOString().split("T")[0] : "")}
                                          dateFormat="yyyy-MM-dd"
                                          placeholderText="Enter Client expected Date"
                                          className="w-full bg-transparent outline-none"
                                          wrapperClassName="w-full"
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div>
                                      <IoIosAdd
                                        size={30}
                                        className="cursor-pointer hover:text-blue-600"
                                        onClick={() => {
                                          setSelectedRowIdProduct(index);
                                          openSupplierModalProduct(item?.id, index);
                                        }}
                                      />
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                      <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                          <thead>
                                            <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
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
                                            {productSuppliers?.supplierIds?.map((supplier, supplierIndex) => (
                                              <tr
                                                key={`supplier-row-${index}-${supplierIndex}`}
                                                className="bg-white dark:bg-slate-700 dark:text-white px-5 py-3"
                                              >
                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <input
                                                    type="text"
                                                    value={supplier.supplierName || ""}
                                                    readOnly
                                                    className="w-[130px] bg-gray-100 dark:bg-gray-700 rounded border py-2 px-3"
                                                  />
                                                </td>

                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <input
                                                    type="number"
                                                    value={supplier.supplierOrderQty || 0}
                                                    onChange={(e) => {
                                                      const newQuantity = Number(e.target.value) || 0;
                                                      handleSupplierQuantityUpdate(
                                                        index,
                                                        supplierIndex,
                                                        newQuantity,
                                                        setFieldValue,
                                                        values
                                                      );
                                                    }}
                                                    className="w-[130px] bg-white dark:bg-form-input rounded border py-2 px-3"
                                                    placeholder="Enter quantity"
                                                    min="0"
                                                  />
                                                </td>

                                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                  <MdDelete
                                                    size={20}
                                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                                    onClick={() => handleDeleteSupplierProduct(index, supplierIndex, setFieldValue, values)}
                                                  />
                                                </td>
                                              </tr>
                                            ))}

                                            {(!productSuppliers || productSuppliers.supplierIds.length === 0) && (
                                              <tr>
                                                <td colSpan="3" className="px-5 py-5 text-center text-gray-500">
                                                  No suppliers added. Click the + button to add suppliers.
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-5 py-5 border-b items-center justify-center">
                                    <MdDelete
                                      className='text-red-700 cursor-pointer hover:text-red-900'
                                      size={30}
                                      onClick={() => handleDeleteRow(index)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex-1 min-w-[200px] mt-11">
                        <label className="mb-2.5 block text-black dark:text-white">Client Instruction</label>
                        <Field
                          as="textarea"
                          name="clientInstruction"
                          placeholder="Enter client instruction"
                          value={values.clientInstruction}
                          className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {(values.orderType?.orderTypeName === "RetailClients" || values.orderType?.orderTypeName === "WSClients") && (
                        <div className="flex-1 min-w-[200px] mt-11">
                          <label className="mb-2.5 block text-black dark:text-white">Customisation Details</label>
                          <Field
                            as="textarea"
                            name="customisationDetails"
                            placeholder="Enter client instruction"
                            className="bg-white dark:bg-form-input w-full rounded border-[1.5px] border-stroke py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:text-white dark:focus:border-primary"
                            value={values.customisationDetails}
                          />
                        </div>
                      )}

                      <div className="flex justify-center mt-4">
                        <button
                          type="button"
                          onClick={() => handleUpdateSubmit(values)}
                          className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>

        {isSupplierModalOpen && (
          <SupplierUpdate
            suppliers={suppliers}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            selectedSuppliersProduct={selectedSuppliersProduct}
            selectedRowId={selectedRowId}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            order={order}
            handleSubmit={handleSupplierModalSubmit}
          />
        )}

        {isSupplierModalOpenProduct && (
          <SupplierUpdateProduct
            suppliers={suppliers}
            id={suppId}
            selectedSuppliersProduct={selectedSuppliersProduct}
            selectedRowId={selectedRowIdProduct}
            handleCheckboxChangeProduct={handleCheckboxChangeProduct}
            closeModalProduct={closeSupplierModalProduct}
            order={order}
            handleSubmit={handleSupplierModalSubmitProduct}
          />
        )}

        <ModalUpdate
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          prodIdd={prodIdd}
          GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
          onSubmit={handleModalSubmit}
          width="70%"
          height="80%"
          style={{ marginLeft: '70px', marginRight: '0' }}
        />
      </div>
    </DefaultLayout>
  );
};

export default UpdateOrder;