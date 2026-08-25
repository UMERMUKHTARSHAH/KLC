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
import ReactDatePicker from "react-datepicker";
import useProduct from '../../hooks/useProduct';
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, VIEW_ORDER_PRODUCT, UPDATE_ORDERPRODUCT_ALL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SupplierModall from './SupplierModall';
const UpdateOrderProduct = () => {
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTypeOptions, setorderTypeOptions] = useState([])
  const [prodIdOptions, setprodIdOptions] = useState([])
  const [prodIdd, setprodIdd] = useState("")
  const [order, setOrder] = useState(null); // To store fetched product data
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [suppId, setsuppId] = useState()
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [customerOptions, setcustomerOptions] = useState([])
  const { token } = currentUser;



  const [orderProduct, setorderProduct] = useState([])

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {

    productId,

  } = useorder();










  const { id } = useParams();




  const [selectedSuppliers, setSelectedSuppliers] = useState([]);






  console.log(selectedSuppliers, "selecteddddddddd Suppliersss");




  console.log(isSupplierModalOpen, "ll");

  console.log(isModalOpen, "jj");









  // Close modal
  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };


  const handleSupplierModalSubmit = () => {
    console.log("Selected Suppliers:", selectedSuppliers);
    closeSupplierModal();
  };









  console.log(productId, "looool");



  //  const handleUpdateSubmit = async (values) => {

  //                console.log(values,"jazim");
  //        try {
  //            const url = `${UPDATE_ORDER_URL }/${id}`;

  //            const response = await fetch(url, {
  //                method: "PUT",
  //                headers: {
  //                    "Content-Type": "application/json",
  //                    "Authorization": `Bearer ${token}`
  //                },
  //                body: JSON.stringify(values)
  //            });

  //            const data = await response.json();
  //            if (response.ok) {
  //             console.log(data,"coming ");

  //                toast.success(`Order Updated successfully`);
  //                // navigate('/inventory/viewMaterialInventory');

  //            } else {
  //                toast.error(`${data.errorMessage}`);
  //            }
  //        } catch (error) {
  //            console.error(error);
  //            toast.error("An error occurred");
  //        } finally {

  //        }

  //    };

  const handleUpdateSubmit = async (values) => {
    console.log(values, "jazim");

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
        navigate("/order/created")

      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
    finally{
      navigate(-1)
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
      console.log(data, "luciiiiferrrrrrrrrrrrrr")
      setOrder(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };


  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
  }, [id]);

  const [prodIdModal, setprodIdModal] = useState([])












  const OrderCategoryOptions = [
    { value: 'Embroidery', label: 'Embroidery' },
    { value: 'Dyeing', label: 'Dyeing' },
    { value: 'Plain Order', label: 'PlainOrder' },

  ];


  const ExecutionStatus = [
    { value: 'Accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'need_modification', label: 'Need Modification' },

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



  const openSupplierModal = (id) => {
    console.log("Opening supplier modal for product:", id);
    setIsSupplierModalOpen(true);
    setsuppId(id);

    // Fetch existing suppliers based on order.productSuppliers and the selected product id
    const existingSuppliers = order?.productSuppliers?.map((supplier) => ({
      selectedRowId: id,
      supplierId: supplier.supplier.id,
      supplierName: supplier.supplier.name,
      supplierOrderQty: supplier.supplierOrderQty || 0,
    })) || [];

    // Set the suppliers in the modal for selection (do not modify selectedSuppliers here)
    setsupplierList(existingSuppliers); // Assuming you have a state to hold the suppliers for the modal
  };






  const handleCheckboxChange = (selectedRowId, supplier) => {
    setSelectedSuppliers((prev = []) => {
      let updated = [...prev];

      // Ensure supplier exists in the list
      const exists = updated.some(
        (row) => row.selectedRowId === selectedRowId && row.supplierId === supplier.id
      );

      if (exists) {
        // Remove supplier (toggle behavior)
        updated = updated.filter(
          (row) => !(row.selectedRowId === selectedRowId && row.supplierId === supplier.id)
        );
      } else {
        // Add as a new row
        updated.push({
          selectedRowId,
          supplierId: supplier.id,
          supplierName: supplier.supplierName,
          supplierOrderQty: 0, // Default quantity
        });
      }

      console.log(updated, "Updated Suppliers");
      return updated;
    });
  };


  console.log(selectedSuppliers, "kikikikikikikiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");



















  const handleModalSubmit = (values) => {
    console.log(values, "gfdsa");



    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }
















  console.log(prodIdModal, "proddidmodal");





  const onSubmit = async (values, e) => {
    console.log("Form submission triggered");
    console.log(values, "Received values from frontend");

    const formattedValues = {
      orderDate: values.orderDate,
      value: parseFloat(values.value),
      shippingDate: values.shippingDate,
      expectingDate: values.expectingDate,
      tagsAndLabels: values.tags,
      logoNo: values.logoNo,
      productionExecutionStatus: "In Progress", // You can change this as needed
      productionComments: values.customisationDetails,
      poDate: values.poDate,
      orderCategory: values.orderCategory,
      purchaseOrderNo: values.purchaseOrderNo,
      clientInstruction: values.clientInstruction,
      status: "Created", // Example static value
      customisationDetails: values.customisationDetails,
      createdBy: "Admin", // Replace with a dynamic value if available
      employeeName: values.employeeName,
      salesChannel: values.salesChannel,
      // customer: {
      //   id: 1, // Replace with the actual customer ID from your `values`
      // },
      customer: {
        id: values.customer?.id || null, // Dynamically include the customer ID or set to null if not available
      },
      orderType: {
        id: values.orderType?.id || 4, // Replace with the actual Order Type ID
      },
      orderProducts: [
        // {
        //   products: {
        //     id: values.productId, // Product ID from the form values
        //   },
        {
          // products: {
          //   id: values.products?.productId || '',  // Accessing the productId from the products object
          // },

          products: {
            id: values.products?.id || "", // Dynamically fetch product ID
          },
          // products: {
          //   ...product.products,
          //   productId: product.products?.productId || '',  // Set initial value for productId
          // },

          clientOrderQuantity: parseFloat(values.orderQuantity),
          orderQuantity: parseFloat(values.orderQuantity),
          value: parseFloat(values.value),
          inStockQuantity: parseFloat(values.inStockQuantity),
          quantityToManufacture: parseFloat(values.quantityToManufacture),
          clientShippingDate: values.clientShippingDate,
          expectedDate: values.expectedDate,
          challanNo: "CH12345", // Replace with dynamic value if available
          challanDate: values.shippingDate,
          productSuppliers: [
            {
              supplier: {
                id: 1, // Replace with actual supplier ID
              },
              supplierOrderQty: parseFloat(values.supplierOrderQty),
            },
          ],
        },
      ],

    };

    console.log(JSON.stringify(formattedValues, null, 2), "Formatted Values");
    handleUpdateSubmit(formattedValues, e);
  };

  console.log(selectedSuppliers, "supppppppppppppppppppplierssssssssssssssssss");
  const handleSubmit = async (values) => {

    console.log(values, "kiki");
    try {
      const url = `${UPDATE_ORDERPRODUCT_ALL}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Status Updated  successfully`);



        // getCurrency(pagination.currentPage); // Fetch updated Currency
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error, response);
      toast.error("An error occurred");
    }

    // You can now send `finalData` to the backend or do any other operation with it
  };
  console.log(order, "gigigigig");

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
            // sourceProductId: order?.sourceProductName || '',
            quantityToManufacture: order?.quantityToManufacture,
            value: order?.value,
            expectedDate: order?.expectedDate,
            productStatus: order?.productStatus || "",
            productionComments: order?.productionComments || "",
            productsId: order?.products?.id,
            // supplierName: product.productSuppliers?.supplier?.name || '', // Safely accessing supplier name
            // supplierOrderQty: product.productSuppliers?.[0]?.supplierOrderQty || 0,
            productSuppliers: selectedSuppliers.map(supplier => ({
              supplier: {
                id: supplier?.supplierId, // Send supplier ID
              },

              supplierOrderQty: supplier.supplierOrderQty || 0,
            })) || [],




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
                     {order?.productStatus?.toLowerCase() === "closed" ? "Closed Order" : "Update Order"}
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="flex flex-wrap gap-3">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                        <ReactSelect
                          name="orderNo"
                          value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null} // Display orderNo
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order No"
                          isDisabled={true} // Disabled field
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Order Category</label>
                        <ReactSelect
                          name="orderCategory"
                          value={OrderCategoryOptions.find(option => option.value === values.orderCategory) || null}
                          onChange={(option) => setFieldValue("orderCategory", option.value)} // Store only value
                          options={OrderCategoryOptions}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select Order Category"
                        />


                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Product ID */}

                         <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Source Product ID</label>
                        <Field
                          name="sourceProductId"
                          value={order?.sourceProductName} // Ensure it reflects Formik state
                          // onChange={(e) => setFieldValue("sourceProductId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Source Product ID"
                        />
                        <ErrorMessage name="sourceProductId" component="div" className="text-red-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Product ID</label>
                        <Field
                          name="productId"
                          value={values?.productId} // Ensure it reflects Formik state
                          onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="productId" component="div" className="text-red-600 text-sm" />
                      </div>
                     

                      {/* Quantity to Manufacture */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Quantity to Manufacture</label>
                        <Field
                          name="quantityToManufacture"
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          readOnly // Read-only field
                        />
                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>



                    <div className="flex flex-wrap gap-3 mt-5">
                      {/* Order No */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Value</label>
                        <Field
                          name="productId"
                          value={values?.value} // Ensure it reflects Formik state
                          onChange={(e) => setFieldValue("productId", e.target.value)} // Update Formik state
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                          placeholder="Enter Product ID"
                        />
                        <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm" />
                      </div>

                      {/* Order Category */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Expected Date</label>
                        <Field
                          type="date"
                          // name={`orderProducts[${index}].expectedDate`}
                          value={values.expectedDate || ""}
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        //readOnly
                        />
                        <ErrorMessage name="salesChannel" component="div" className="text-red-600 text-sm" />
                      </div>





                      {/* Product ID */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Execution Status</label>
                        <ReactSelect
                          name="productStatus"
                          value={
                            ExecutionStatus.find(
                              (option) => option.value === values.productStatus
                            ) || null // Find the selected option object from ExecutionStatus
                          }
                          onChange={(option) =>
                            setFieldValue("productStatus", option ? option.value : "")
                          } // Update Formik's value when an option is selected
                          options={ExecutionStatus}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Execution Status"
                        />
                        <ErrorMessage name="productStatus" component="div" className="text-red-600 text-sm" />
                      </div>



                      {/* Quantity to Manufacture */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="mb-2.5 block text-black dark:text-white">Comments</label>
                        <Field
                          name="productionComments"
                          className="w-[200px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                        // Read-only field
                        />
                        <ErrorMessage name="quantityToManufacture" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>


                    <div>

                      <div >
                        <IoIosAdd size={30} onClick={() => {

                          openSupplierModal(values.productsId)

                        }

                        } />
                      </div>
                    </div>





                    <div className="flex flex-wrap gap-3">
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
                                      name={`productSuppliers[${index}].supplierOrderQty`}
                                      // value={supplierData.supplierOrderQty||""}
                                      type="number"
                                      className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
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

                                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                    <FiTrash2
                                      size={17}
                                      className="text-red-500 hover:text-red-700 mx-2"
                                      onClick={() => {
                                        const updatedSuppliers = selectedSuppliers.filter((_, i) => i !== index);
                                        setSelectedSuppliers(updatedSuppliers);
                                      }}
                                      title="Delete Supplier"
                                    />
                                  </td>
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











                    {
                      order?.productStatus?.toLowerCase() === "closed" ? null : (
                        <div className="flex justify-center mt-4"> {/* Centering the button */}
                          <button
                            // type="button" // Ensures the button does not trigger the form submission
                            // onClick={(e) => handleUpdateSubmit(values, e)}
                            className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none" // Increased width
                          >
                            Update
                          </button>
                        </div>

                      )
                    }

                  </div>
                </div>
              </div>


            </Form>
          )}
        </Formik>
        {isSupplierModalOpen && (
          <SupplierModall
            suppliers={suppliers}
            id={suppId}
            selectedSuppliers={selectedSuppliers}
            selectedRowId={selectedRowId}
            handleCheckboxChange={handleCheckboxChange}
            closeModal={closeSupplierModal}
            handleSubmit={handleSupplierModalSubmit}
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
          style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
        />


      </div>
    </DefaultLayout>
  );
};

export default UpdateOrderProduct;
