import React, { useEffect, useState, useRef } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactSelect from 'react-select';
import 'flatpickr/dist/themes/material_blue.css';
import * as Yup from 'yup';
import useorder from '../../hooks/useOrder';
import useProduct from '../../hooks/useProduct';
import { 
  GET_PRODUCTBYID_URL, 
  UPDATE_ORDER_URL, 
  VIEW_ORDER_PRODUCT, 
  UPDATE_ORDERPRODUCT_ALL,
  VIEW_ALL_PRODUCT_SUBGROUP_URL,
  GET_IMAGE,
  VIEW_ORDERPRODUCT_ALL
} from '../../Constants/utils';
import { FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ModalUpdate from '../Order/ModalUpdate';
import axios from 'axios';
import CardDataStats from '../CardDataStats';
import { Link } from 'react-router-dom';
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { GiScrollUnfurled } from "react-icons/gi";
import { GiBandageRoll } from "react-icons/gi";
import { TbReorder } from 'react-icons/tb';
import { GiCottonFlower } from "react-icons/gi";
import { GiWool } from "react-icons/gi";
import { GiRolledCloth } from "react-icons/gi";
import { FaDropbox } from "react-icons/fa";
import { customStyles as createCustomStyles } from '../../Constants/utils';

const UpdateKani = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = currentUser;
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);

  // State for form
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prodIdd, setprodIdd] = useState("");
  const [prodIdModal, setprodIdModal] = useState([]);
  
  // State for Kani Products
  const [product, setProduct] = useState(null);
  const [productSuppliers, setproductSuppliers] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [colorGroupOptions, setColorGroupOptions] = useState([]);
  const [unitOptions, setunitOptions] = useState([]);
  const [designOptions, setdesignOptions] = useState([]);
  const [styleOptions, setstyleOptions] = useState([]);
  const [sizeOptions, setsizeOptions] = useState([]);
  const [productCategoryOptions, setproductCategoryOptions] = useState([]);
  const [hsnOptions, sethsnOptions] = useState([]);
  const [supplierNameOptions, setsupplierNameOptions] = useState([]);
  const [supplierCodeOptions, setsupplierCodeOptions] = useState([]);
  const [productGroupOption, setproductGroupOption] = useState([]);
  const [gstDetailModal, setgstDetailModal] = useState(false);
  const [vaaluee, setvaaluee] = useState({});
  const [previews, setPreviews] = useState([]);
  const [previewsActual, setPreviewsActual] = useState([]);
  const formikRef = useRef(null);

  const colorGroup = useSelector(state => state?.persisted?.color);
  const design = useSelector(state => state?.persisted?.design);
  const style = useSelector(state => state?.persisted?.style);
  const size = useSelector(state => state?.persisted?.size);
  const productCategory = useSelector(state => state?.persisted?.productCategory);
  const hsnCode = useSelector(state => state?.persisted?.hsn);
  const supplier = useSelector(state => state?.nonPersisted?.supplier);
  const productGroup = useSelector(state => state?.persisted?.productGroup);

  // Order Category Options
  const OrderCategoryOptions = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'Plain Order', label: 'PlainOrder' },
  ];

  // GST Options
  const gstOptions = [
    { value: 'Applicable', label: 'Applicable' },
    { value: 'NotApplicable', label: 'NotApplicable' },
  ];

  const supplyType = [
    { value: 'Goods', label: 'Goods' },
    { value: 'Service', label: 'Service' },
    { value: 'capital Goods', label: 'capital Goods' },
  ];

  const gstdetails = [
    { value: 'specifySlabBasedRates', label: 'Specify Slab Based Rates' },
    { value: 'useGstClassification', label: 'Use Gst Classification' },
  ];

  // Image handling functions
  const handleFileChange = (event, setFieldValue, setPreviews) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setFieldValue('refrenceImage', files);
    }
  };

  const handleFileChangeActual = (event, setFieldValue, setPreviewsActual) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file: file,
      }));
      setPreviewsActual((prev) => [...prev, ...newPreviews]);
      setFieldValue('actualImage', files);
    }
  };

  const handleRemoveImage = (index, setPreviews) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ============== KANI PRODUCTS FUNCTIONS ==============
  
  const getProductById = async () => {
    try {
      const response = await fetch(`${VIEW_ORDERPRODUCT_ALL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data?.products);
      setproductSuppliers(data?.productSuppliers);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsProductLoading(false);
    }
  };

  // Prepare options for selects
  useEffect(() => {
    if (colorGroup.data) {
      const formattedOptions = colorGroup.data.map((color) => ({
        value: color.id,
        label: color.colorName,
        colorGroupObject: color,
        color: { id: color.id }
      }));
      setColorGroupOptions(formattedOptions);
    }
  }, [colorGroup]);

  useEffect(() => {
    if (productCategory.data) {
      const formattedOptions = productCategory.data.map(prodCat => ({
        value: prodCat.id,
        label: prodCat?.productCategoryName,
        productCategoryObject: prodCat,
        productCategoryid: { id: prodCat.id },
      }));
      setproductCategoryOptions(formattedOptions);
    }
  }, [productCategory]);

  useEffect(() => {
    if (hsnCode.data) {
      const formattedOptions = hsnCode.data.map(hsn => ({
        value: hsn.id,
        label: hsn?.hsnCodeName,
        hsnObject: hsn,
        hsnCode: { id: hsn.id }
      }));
      sethsnOptions(formattedOptions);
    }
  }, [hsnCode]);

  useEffect(() => {
    if (design.data) {
      const formattedOptions = design.data.map(design => ({
        value: design.id,
        label: design?.designName,
        designObject: design,
        designid: { id: design.id }
      }));
      setdesignOptions(formattedOptions);
    }
  }, [design]);

  useEffect(() => {
    if (style.data) {
      const formattedOptions = style.data.map(style => ({
        value: style.id,
        label: style?.stylesName,
        styleObject: style,
        styleid: { id: style.id }
      }));
      setstyleOptions(formattedOptions);
    }
  }, [style]);

  useEffect(() => {
    if (size.data) {
      const formattedOptions = size.data.map(size => ({
        value: size.id,
        label: size?.sizeName,
        sizeObject: size,
        sizeid: { id: size.id }
      }));
      setsizeOptions(formattedOptions);
    }
  }, [size]);

  useEffect(() => {
    if (supplier.data) {
      const formattedOptions = supplier.data.map(supp => ({
        value: supp.id,
        label: supp?.name,
        supplierNameObject: supp,
        suplierid: { id: supp.id }
      }));
      setsupplierNameOptions(formattedOptions);
    }
  }, [supplier.data]);

  useEffect(() => {
    if (supplier.data) {
      const formattedOptions = supplier.data.map(supp => ({
        value: supp.id,
        label: supp?.supplierCode,
        supplierCodeObject: supp,
        suplieridd: { id: supp.id }
      }));
      setsupplierCodeOptions(formattedOptions);
    }
  }, [supplier.data]);

  useEffect(() => {
    if (productGroup?.data && Array.isArray(productGroup.data)) {
      const formattedOptions = productGroup.data.map(product => ({
        value: product.id,
        label: product.productGroupName,
        productGroupObject: product,
      }));
      setproductGroupOption(formattedOptions);
    } else {
      setproductGroupOption([]);
    }
  }, [productGroup]);

  // ============== UPDATE KANI FUNCTIONS ==============

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
      setOrder(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
    getProductById();
  }, [id]);

  // Set suppliers when order loads
  useEffect(() => {
    if (order?.productSuppliers) {
      const initialSuppliers = order.productSuppliers.map((supplier) => ({
        selectedRowId: supplier.productId,
        supplierId: supplier.supplier.id,
        supplierName: supplier.supplier.name,
        supplierOrderQty: supplier.supplierOrderQty || 0,
      }));
      setSelectedSuppliers(initialSuppliers);
    }
  }, [order]);

  // Handle Update Submit
  const handleUpdateSubmit = async (values) => {
    try {
      const url = `${UPDATE_ORDER_URL}/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Updated successfully`);
        navigate("/order/created");
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  // Handle Submit
  const handleSubmit = async (values) => {
    try {
      const url = `${UPDATE_ORDERPRODUCT_ALL}/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Status Updated successfully`);
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  // Handle Modal Submit
  const handleModalSubmit = (values) => {
    setprodIdModal((prevValues) => [...prevValues, values]);
    setIsModalOpen(false);
  };

  const handlerateDetails = (option, setFieldValue) => {
    setFieldValue('gstratedetails', option.value);
    if (option.value === "specifySlabBasedRates") {
      setgstDetailModal(true);
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  // Section header component
  const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );

  // Form field wrapper component
  const FormField = ({ label, required, children, className = "" }) => (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
    </div>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order / Update Order Product" />
      
      <div className="max-w-7xl mx-auto">
        {/* ===== UPDATE ORDER PRODUCT SECTION ===== */}
        <div className="mb-8">
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm border border-gray-200 dark:border-strokedark overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-strokedark bg-gray-50 dark:bg-meta-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                   Order Product Detail
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Order #{order?.orderNo || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  orderCategory: order?.orderCategory || '',
                  productId: order?.products?.productId || '',
                  quantityToManufacture: order?.quantityToManufacture || '',
                  value: order?.value || '',
                  expectedDate: order?.expectedDate || '',
                  productStatus: order?.productStatus || "",
                  productionComments: order?.productionComments || "",
                  productsId: order?.products?.id || '',
                  productSuppliers: selectedSuppliers.map(supplier => ({
                    supplier: {
                      id: supplier?.supplierId,
                    },
                    supplierOrderQty: supplier.supplierOrderQty || 0,
                  })) || [],
                }}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField label="Order No">
                        <ReactSelect
                          name="orderNo"
                          value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order No"
                          isDisabled={true}
                        />
                      </FormField>

                      <FormField label="Order Category" required>
                        <ReactSelect
                          name="orderCategory"
                          value={OrderCategoryOptions.find(option => option.value === values.orderCategory) || null}
                          onChange={(option) => setFieldValue("orderCategory", option.value)}
                          options={OrderCategoryOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Category"
                          isDisabled={true}
                        />
                      </FormField>

                      <FormField label="Product ID" required>
                        <Field
                          name="productId"
                          value={values?.productId}
                          onChange={(e) => setFieldValue("productId", e.target.value)}
                          className="w-full bg-white dark:bg-form-input rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 dark:disabled:bg-meta-4"
                          placeholder="Enter Product ID"
                          readOnly
                        />
                      </FormField>

                      <FormField label="Quantity to Manufacture">
                        <Field
                          name="quantityToManufacture"
                          className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          readOnly
                        />
                      </FormField>

                      <FormField label="Value" required>
                        <Field
                          name="value"
                          value={values?.value}
                          onChange={(e) => setFieldValue("value", e.target.value)}
                          className="w-full bg-white dark:bg-form-input rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter Value"
                          readOnly
                        />
                      </FormField>

                      <FormField label="Expected Date">
                        <Field
                          type="date"
                          value={values.expectedDate || ""}
                          className="w-full bg-white dark:bg-form-input rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </FormField>
                    </div>

                    {/* Suppliers Table */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Supplier Details</h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-strokedark">
                        <table className="w-full table-auto">
                          <thead className="bg-gray-50 dark:bg-meta-4">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Supplier Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Supplier Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-strokedark">
                            {selectedSuppliers.map((supplierData, index) => (
                              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-meta-4/50 transition-colors">
                                <td className="px-4 py-3">
                                  <input
                                    value={supplierData.supplierName}
                                    readOnly
                                    className="w-full bg-gray-100 dark:bg-meta-4 rounded-lg border border-gray-200 dark:border-strokedark py-2 px-3 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <Field
                                    name={`productSuppliers[${index}].supplierOrderQty`}
                                    type="number"
                                    className="w-full bg-white dark:bg-form-input rounded-lg border border-gray-300 dark:border-strokedark py-2 px-3 text-gray-800 dark:text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    readOnly
                                  />
                                </td>
                                <Field
                                  name={`productSuppliers[${index}].supplier`}
                                  type="hidden"
                                  value={supplierData.supplierName}
                                />
                                <Field
                                  name={`productSuppliers[${index}].supplier.id`}
                                  type="hidden"
                                  value={supplierData.supplierId}
                                />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* ===== VIEW PRODUCTION DASHBOARD SECTION ===== */}
        <div>
          <div className="bg-white dark:bg-boxdark rounded-xl shadow-sm border border-gray-200 dark:border-strokedark overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-strokedark bg-gradient-to-r from-gray-50 to-gray-100 dark:from-meta-4 dark:to-meta-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Product Details
                </h3>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                  Product Details
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {isProductLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Formik
                  innerRef={formikRef}
                  enableReinitialize
                  initialValues={{
                    ...product,
                    productGroup: product?.productGroup,
                    colors: product?.colors || { id: 0 },
                    productCategory: product?.productCategory || { id: 0 },
                    hsnCode: product?.hsnCode || { id: 0 },
                    design: product?.design || { id: 0 },
                    styles: product?.styles || { id: 0 },
                    sizes: product?.sizes || { id: 1, sizeName: "3l" },
                    gstDetails: product?.gstDetails || [],
                    hsnCodes: product?.hsnCodes || '',
                    hsn_Sac: product?.hsn_Sac || '',
                    gstDescription: product?.gstDescription || '',
                    taxationType: product?.taxationType || '',
                    gstRate: product?.gstRate || '',
                    typeOfSupply: product?.typeOfSupply || '',
                    productId: product?.productId || '',
                    colorName: product?.colorName || '',
                    barcode: product?.barcode || '',
                    finishedWeight: product?.finishedWeight || '',
                    materialWeight: product?.materialWeight || '',
                    warpColors: product?.warpColors || '',
                    weftColors: product?.weftColors || '',
                    weave: product?.weave || '',
                    warpYarn: product?.warpYarn || '',
                    weftYarn: product?.weftYarn || '',
                    gstratedetails: product?.gstratedetails || '',
                    pixAndReed: product?.pixAndReed || '',
                    cost: product?.cost || '',
                    mrp: product?.mrp || '',
                    dyeingCost: product?.dyeingCost || '',
                    wholesalePrice: product?.wholesalePrice || '',
                    usdPrice: product?.usdPrice || '',
                    euroPrice: product?.euroPrice || '',
                    gbpPrice: product?.gbpPrice || '',
                    rmbPrice: product?.rmbPrice || '',
                    productDescription: product?.productDescription || '',
                    baseColour: product?.baseColour || '',
                    kaniColors: product?.kaniColors || '',
                    fabricWeave: product?.fabricWeave || '',
                    fabricCode: product?.fabricCode || '',
                    fabricCost: product?.fabricCost || '',
                    productStatus: product?.productStatus || '',
                    supplier: productSuppliers,
                    embroideryCost: product?.embroideryCost || '',
                    totalCost: product?.totalCost || '',
                    slabBasedRates: product?.slabBasedRates || [],
                    unit: product?.unit || { id: 0 },
                    supplierCode: product?.supplierCode || { id: 0 },
                    refrenceImage: null,
                    actualImage: null,
                  }}
                  validate={values => {
                    const errors = {};
                    if (values) {
                      setvaaluee(values);
                    }
                    return errors;
                  }}
                >
                  {({ setFieldValue, values }) => (
                    <form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Product Group" required>
                          <ReactSelect
                            name="productGroup"
                            value={productGroupOption?.find(option => option.value === values?.productGroup?.id) || null}
                            options={productGroupOption}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Product Group"
                            isDisabled={true}
                          />
                        </FormField>

                        <FormField label="Color Group" required>
                          <ReactSelect
                            isDisabled={true}
                            name="colors"
                            value={colorGroupOptions.find(option => option.value === values.colors?.id) || null}
                            options={colorGroupOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-field"
                            classNamePrefix="react-select"
                            placeholder="Select Color Group"
                          />
                        </FormField>

                        <FormField label="Product Category" required>
                          <ReactSelect
                            name="productCategory"
                            value={productCategoryOptions?.find(option => option.value === values.productCategory?.id) || null}
                            options={productCategoryOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Product Category"
                            isDisabled={true}
                          />
                        </FormField>

                        <FormField label="HSN Code" required>
                          <ReactSelect
                            name="hsnCode"
                            value={hsnOptions?.find(option => option.value === values.hsnCode?.id) || null}
                            options={hsnOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Hsn Code"
                            isDisabled={true}
                          />
                        </FormField>

                        {/* HSN/SAC Field */}
                        <FormField label="HSN/SAC">
                          <Field
                            readOnly
                            name="hsn_Sac"
                            type="text"
                            placeholder="Enter HSN/SAC"
                            value={values.hsn_Sac || ''}
                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        {/* GST Description Field */}
                        <FormField label="GST Description">
                          <Field
                            readOnly
                            name="gstDescription"
                            type="text"
                            placeholder="Enter GST Description"
                            value={values.gstDescription || ''}
                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        <FormField label="Design Name" required>
                          <ReactSelect
                            name="design"
                            value={designOptions?.find(option => option.value === values.design?.id) || null}
                            options={designOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Design"
                            isDisabled={true}
                          />
                        </FormField>

                        <FormField label="Color Name" required>
                          <Field
                            name='colorName'
                            type="text"
                            readOnly
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        <FormField label="Style" required>
                          <ReactSelect
                            name="styles"
                            value={styleOptions?.find(option => option.value === values.styles?.id) || null}
                            options={styleOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Style"
                            isDisabled={true}
                          />
                        </FormField>

                        <FormField label="Size (in cms)" required>
                          <ReactSelect
                            name="sizes"
                            value={sizeOptions?.find(option => option.value === values.sizes?.id) || null}
                            options={sizeOptions}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Size"
                            isDisabled={true}
                          />
                        </FormField>

                        <FormField label="Product Id">
                          <Field
                            name='productId'
                            type="text"
                            value={values.productId}
                            readOnly
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        <FormField label="Barcode">
                          <Field
                            readOnly
                            name='barcode'
                            type="text"
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        <FormField label="Finished Weight">
                          <Field
                            readOnly
                            name='finishedWeight'
                            type="number"
                            value={values.finishedWeight}
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>

                        <FormField label="Material Weight">
                          <Field
                            readOnly
                            name='materialWeight'
                            type="number"
                            value={values.materialWeight}
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                          />
                        </FormField>
                      </div>

                      {/* ===== STATUTORY DETAILS SECTION ===== */}
                      {product?.gstDetails === "Applicable" && (
                        <>
                          <div className="mt-6 border-t border-stroke dark:border-strokedark pt-6">
                            <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Statutory Details</h4>
                            
                            {/* GST DETAILS - First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">GST DETAILS</label>
                                <ReactSelect
                                  name="gstDetails"
                                  options={gstOptions}
                                  value={gstOptions.find(option => option.value === values.gstDetails)}
                                  styles={customStyles}
                                  className="bg-white dark:bg-form-Field"
                                  classNamePrefix="react-select"
                                  placeholder="Select GST details"
                                  isDisabled={true}
                                />
                              </div>
                              
                              {/* GST RATE DETAILS - Second Column */}
                              {/* <div>
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">GST RATE DETAILS</label>
                                <ReactSelect
                                  name="gstratedetails"
                                  options={gstdetails}
                                  value={gstdetails.find((option) => option.value === values.gstratedetails)}
                                  onChange={(option) => handlerateDetails(option, setFieldValue)}
                                  styles={customStyles}
                                  classNamePrefix="react-select"
                                  placeholder="Enter GST Rate Details"
                                  isDisabled={true}
                                />
                              </div> */}
                            </div>

                            {/* Conditional Fields based on gstratedetails */}
                            {values.gstratedetails === "specifySlabBasedRates" && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-6">
                                  {Array.isArray(values.slabBasedRates) &&
                                    values.slabBasedRates.map((gst, index) => (
                                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                        <div>
                                          <label className="mb-2 block text-sm text-black dark:text-white">Greater Than</label>
                                          <Field
                                            readOnly
                                            name={`slabBasedRates[${index}].greaterThan`}
                                            type="text"
                                            placeholder="Enter Greater Than Value"
                                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                          />
                                        </div>
                                        <div>
                                          <label className="mb-2 block text-sm text-black dark:text-white">Upto</label>
                                          <Field
                                            readOnly
                                            name={`slabBasedRates[${index}].upTo`}
                                            type="text"
                                            value={gst.upTo}
                                            placeholder="Upto"
                                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                          />
                                        </div>
                                        <div>
                                          <label className="mb-2 block text-sm text-black dark:text-white">Type</label>
                                          <Field
                                            readOnly
                                            name={`slabBasedRates[${index}].type`}
                                            type="text"
                                            value={gst.type}
                                            placeholder="Type"
                                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                          />
                                        </div>
                                        <div>
                                          <label className="mb-2 block text-sm text-black dark:text-white">Rate</label>
                                          <Field
                                            readOnly
                                            name={`slabBasedRates[${index}].gstRate`}
                                            type="text"
                                            value={gst.gstRate}
                                            placeholder="Rate"
                                            className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {values.gstratedetails === "useGstClassification" && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">HSN Code</label>
                                  <ReactSelect
                                    name="hsnCode"
                                    value={hsnOptions?.find((option) => option.value === values.hsnCode?.id) || null}
                                    options={hsnOptions}
                                    styles={customStyles}
                                    className="bg-white dark:bg-form-Field"
                                    classNamePrefix="react-select"
                                    placeholder="Select HSN Code"
                                    isDisabled={true}
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">IGST (%)</label>
                                  <Field
                                    readOnly
                                    type="number"
                                    value={product?.hsnCode?.igst ?? vaaluee?.hsnCode?.igst ?? ''}
                                    placeholder="Enter IGST"
                                    className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">CGST (%)</label>
                                  <Field
                                    readOnly
                                    type="number"
                                    value={vaaluee?.hsnCode?.cgst ?? product?.hsnCode?.cgst ?? ''}
                                    placeholder="Enter CGST"
                                    className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">SGST (%)</label>
                                  <Field
                                    readOnly
                                    type="number"
                                    value={vaaluee?.hsnCode?.sgst ?? product?.hsnCode?.sgst ?? ''}
                                    placeholder="Enter SGST"
                                    className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">GST Description</label>
                                  <Field
                                    readOnly
                                    name="gstDescription"
                                    value={vaaluee?.hsnCode?.productDescription ?? product?.hsnCode?.productDescription ?? ''}
                                    type="text"
                                    placeholder="Enter GST Description"
                                    className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  />
                                </div>
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">HSN/SAC</label>
                                  <Field
                                    readOnly
                                    name="hsn_Sac"
                                    type="text"
                                    placeholder="Enter HSN/SAC"
                                    className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* ===== GST RATE & RELATED DETAILS SECTION ===== */}
                          <div className="mt-6 border-t border-stroke dark:border-strokedark pt-6">
                            <h4 className="text-lg font-semibold text-black dark:text-white mb-4">GST Rate & Related Details</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Taxation Type</label>
                                <Field
                                  name="taxationType"
                                  type="text"
                                  placeholder="Enter Taxation Type"
                                  value={values.taxationType || "Applicable"}
                                  className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  readOnly
                                />
                              </div>

                              <div>
                                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Type of Supply</label>
                                <Field
                                  name="typeOfSupply"
                                  type="text"
                                  placeholder="Enter Type of Supply"
                                  value={values.typeOfSupply || "Goods"}
                                  className="w-full rounded-lg border border-gray-300 dark:border-strokedark bg-gray-50 dark:bg-meta-4 py-2.5 px-4 text-black dark:text-white outline-none cursor-not-allowed"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          {/* ===== SPACER LINE ===== */}
                          <div className="my-10 border-t-2 border-stroke dark:border-strokedark"></div>
                        </>
                      )}

                      {/* Conditional fields based on Product Group */}
                      {product?.productGroup?.productGroupName === "Kani" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField label="Base Color">
                            <Field
                              readOnly
                              name='baseColour'
                              type="text"
                              value={values.baseColour}
                              className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                            />
                          </FormField>
                          <FormField label="Kani Colors">
                            <Field
                              readOnly
                              name='kaniColors'
                              type="text"
                              value={values.kaniColors}
                              className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                            />
                          </FormField>
                          <FormField label="Cost Price">
                            <Field
                              readOnly
                              name='cost'
                              type="text"
                              className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                            />
                          </FormField>
                          <FormField label="MRP">
                            <Field
                              readOnly
                              name='mrp'
                              type="text"
                              className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                            />
                          </FormField>
                        </div>
                      )}

                      {/* ===== IMAGE FIELDS ===== */}
                      <div className="mb-4.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Reference Image Previews */}
                          <div>
                            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                              Reference Image Previews
                            </label>
                            <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark min-h-[100px]">
                              <div className="flex flex-wrap gap-4">
                                {product?.images?.map((ref, index) => (
                                  ref.referenceImage != null && (
                                    <img
                                      key={index}
                                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-strokedark transition-transform duration-300 hover:scale-110"
                                      crossOrigin="use-credentials"
                                      src={`${GET_IMAGE}/products/getimages/${ref.referenceImage}`}
                                      alt="Reference Image"
                                    />
                                  )
                                ))}
                                {previews.map((preview, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={preview.url}
                                      alt={`Preview ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-strokedark transition-transform duration-300 hover:scale-110"
                                    />
                                    <button
                                      onClick={() => handleRemoveImage(index, setPreviews)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {product?.images?.filter(img => img.referenceImage).length === 0 && previews.length === 0 && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">No reference images available</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actual Image Previews */}
                          <div>
                            <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                              Actual Image Previews
                            </label>
                            <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark min-h-[100px]">
                              <div className="flex flex-wrap gap-4">
                                {product?.images?.map((ref, index) => (
                                  ref.actualImage != null && (
                                    <img
                                      key={index}
                                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-strokedark transition-transform duration-300 hover:scale-110"
                                      crossOrigin="use-credentials"
                                      src={`${GET_IMAGE}/products/getimages/${ref.actualImage}`}
                                      alt="Actual Image"
                                    />
                                  )
                                ))}
                                {previewsActual.map((preview, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={preview.url}
                                      alt={`Preview ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-strokedark transition-transform duration-300 hover:scale-110"
                                    />
                                    <button
                                      onClick={() => handleRemoveImage(index, setPreviewsActual)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {product?.images?.filter(img => img.actualImage).length === 0 && previewsActual.length === 0 && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">No actual images available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Description */}
                      <div className="mt-4">
                        <FormField label="Product Description">
                          <Field
                            as="textarea"
                            name='productDescription'
                            rows={4}
                            value={values.productDescription}
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed resize-none"
                            readOnly
                          />
                        </FormField>
                      </div>

                      {/* Supplier & Supplier Code */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField label="Supplier" required>
                          <ReactSelect
                            isDisabled={true}
                            isMulti
                            name="supplier"
                            value={values?.supplier?.map((supp) => ({
                              value: supp.supplier.id,
                              label: supp.supplier.name,
                            }))}
                            styles={customStyles}
                            className="pointer-events-none bg-gray-100 dark:bg-gray-800 cursor-default"
                            classNamePrefix="react-select"
                            placeholder="Select Supplier Name"
                          />
                        </FormField>

                        <FormField label="Supplier Code" required>
                          <ReactSelect
                            name="supplierCode"
                            value={values?.supplierCode ? { value: values.supplierCode.supplierCode, label: values.supplierCode.supplierCode } : null}
                            isDisabled={true}
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select supplier Code"
                          />
                        </FormField>
                      </div>

                      {/* Product Status */}
                      {/* <div className="mt-4">
                        <FormField label="Product Status">
                          <Field
                            name='productStatus'
                            type="text"
                            className="w-full bg-gray-50 dark:bg-meta-4 rounded-lg border border-gray-300 dark:border-strokedark py-2.5 px-4 text-gray-800 dark:text-white outline-none cursor-not-allowed"
                            readOnly
                          />
                        </FormField>
                      </div> */}
                    </form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
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
      )}
    </DefaultLayout>
  );
};

export default UpdateKani;