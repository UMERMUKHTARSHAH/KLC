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
import { GET_PRODUCTBYID_URL, GET_ORDERBYID_URL, UPDATE_ORDER_URL, UPDATE_ORDERCREATED_ALL, UPDATE_CANCELLEDORDER_ALL, GET_ORDERBYIDD_URL } from '../../Constants/utils';
import { IoIosAdd, IoMdAdd, IoMdTrash } from "react-icons/io";
import ModalUpdate from './ModalUpdate';
import SupplierModal from './SupplierModal';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
const UpdateOrderAccepted = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [orderType, setOrderType] = useState('');
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

  const { user } = currentUser;

  const role = user?.authorities[0].authority

  console.log(role, "rolllee");

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Supplier A" },
    { id: 2, name: "Supplier B" },
    { id: 3, name: "Supplier C" },
  ])
  const {
    getorderType,
    orderTypee,
    productId,
    customer,
    getprodId,
    getCustomer,
  } = useorder();


  const [selectedSuppliers, setSelectedSuppliers] = useState([]);


  // const handleCheckboxChange = (supplierId) => {
  //   console.log(supplierId, "sssspppp");
  //   setSelectedSuppliers((prev) =>
  //     prev.includes(supplierId)
  //       ? prev.filter((id) => id !== supplierId) // Remove if already selected
  //       : [...prev, supplierId] // Add if not selected
  //   );
  // };
  const handleCheckboxChange = (selectedRowId, supplierId) => {
    setSelectedSuppliers((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex(
        (row) => row.selectedRowId === selectedRowId
      );

      if (rowIndex !== -1) {
        // Update supplierIds for the existing row
        const supplierExists = updated[rowIndex].supplierIds.some(
          (s) => s.supplierId === supplierId
        );

        if (supplierExists) {
          // Remove the supplier if already exists
          updated[rowIndex].supplierIds = updated[rowIndex].supplierIds.filter(
            (s) => s.supplierId !== supplierId
          );
        } else {
          // Add new supplier to the row
          updated[rowIndex].supplierIds.push({
            supplierId,
            supplierName: "", // Optional: default supplier name if needed
          });
        }
      } else {
        // Add a new row with the selected supplier
        updated.push({
          selectedRowId,
          supplierIds: [{ supplierId, supplierName: "" }],
        });
      }
      console.log(updated, "updatedddddddddddddddddddddd");
      return updated;
    });
  };


  console.log(selectedSuppliers, "selecteddddddddd Suppliersss");

  const openSupplierModal = (id, rowIndex) => {
    console.log("opening supplier  modal  after update", id, rowIndex);
    setIsSupplierModalOpen(true);
    setSelectedRowId(rowIndex);
    console.log(id, "ghson");
    setsuppId(id)
  };


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








  useEffect(() => {
    getorderType();
    getprodId();
    getCustomer();






  }, [])

  console.log(productId, "looool");
  const { id } = useParams();




  const handleSubmit = async (values) => {
    // Map selected row IDs to the desired format
    const selectedProducts = values.selectedRows.map((productId) => ({
      id: productId,
    }));

    // Prepare the final data
    const finalData = {
      orderProducts: selectedProducts, // Include the selected rows
    };

    // Log the data to check the format
    console.log(finalData, "finalData");
    console.log(finalData, "jump");



    try {
      const url = `${UPDATE_ORDERCREATED_ALL}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
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









  const getOrderById = async () => {
    try {
      const response = await fetch(`${GET_ORDERBYIDD_URL}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      console.log(data, "datatata")
      setOrder(data); // Store fetched product
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  console.log(order, 'hloooooo')

  // Fetch data when component mounts
  useEffect(() => {
    getOrderById();
  }, [id]);

  const [prodIdModal, setprodIdModal] = useState([])

  useEffect(() => {
    if (orderTypee) {
      const formattedOptions = orderTypee.map(order => ({
        value: order.id,
        label: order?.orderTypeName,
        orderTypeObject: order,
        orderTypeId: { id: order.id }
      }));
      setorderTypeOptions(formattedOptions);
    }

    if (productId) {
      const formattedProdIdOptions = productId.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id
      }));
      setprodIdOptions(formattedProdIdOptions);
    }

    if (customer) {
      const formattedCustomerOptions = customer.map(customer => ({
        value: customer.id,
        label: customer?.customerName,
        customerObject: customer,
        customer: customer.id
      }));
      setcustomerOptions(formattedCustomerOptions);
    }
  }, [orderTypee]);








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








  const handleModalSubmit = (values) => {
    console.log(values, "gfdsa");



    setprodIdModal((prevValues) => [...prevValues, values])
    setIsModalOpen(false)

  }

  console.log(order, "orderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

  const handleCancelOrder = async (values) => {
    console.log(values, "heyyy");

    const selectedProducts = values.selectedRows.map((productId) => ({
      id: productId,
    }));

    // Prepare the final data
    const finalData = {
      orderProducts: selectedProducts, // Include the selected rows
    };

    // Log the data to check the format
    console.log(finalData, "finalData");

    try {
      const url = `${UPDATE_CANCELLEDORDER_ALL}/${id}`;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
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
  }

console.log(role,"4521");



  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/Update Order" />
      <div>
        <Formik
          onSubmit={handleSubmit}
          enableReinitialize={true}
          initialValues={{
            selectedRows: [],
            orderNo: order?.orderNo || '',


            orderProducts: order?.orderProducts?.map((product) => ({
              sourceProductName: product.sourceProductName || "No Source Product",
              products: {
                ...product.products,
                productId: product?.productIdName || '',  // Set initial value for productId
              },
              productSuppliers: [
                {
                  supplier: {
                    id: "", // Supplier ID
                  },
                  supplierOrderQty: "",
                },
              ],
              orderCategory: product.orderCategory || '',
              inStockQuantity: product.inStockQuantity || '',
              clientOrderQuantity: product.clientOrderQuantity || '',
              quantityToManufacture: product.quantityToManufacture || '',
              units: product.units || '',
              value: product.value || '',
              clientShippingDate: product.clientShippingDate || '',
              expectedDate: product.expectedDate || '',



            })) || [],



            clientInstruction: order?.clientInstruction || '',
            // customer: '',
          }}

        // validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => {


            return (
              <Form>
                <div className="flex flex-col gap-9">
                  {/* Form fields */}
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                        Issue Challan
                      </h3>
                    </div>
                    <div className="p-6.5">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                          <ReactSelect
                            name="orderNo"

                            value={order?.orderNo ? { label: order.orderNo, value: order.orderNo } : null} // Display orderNo
                            styles={customStyles}
                            className="bg-white dark:bg-form-Field"
                            classNamePrefix="react-select"
                            placeholder="Select Order Type"


                            isDisabled={true}
                          />
                          <ErrorMessage name="orderType" component="div" className="text-red-600 text-sm" />
                        </div>




                      </div>

















                      <div className="shadow-md rounded-lg mt-3 overflow-scroll">
                        <table className="min-w-full leading-normal overflow-auto">
                          <thead>
                            <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                              {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Select
                              </th> */}
                              {/* <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Order No
                              </th> */}
                              <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                SourceProduct Id
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
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order?.orderProducts?.map((product, index) => (
                              <tr key={product.id}>
                                {/* Radio Button */}

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`orderProducts[${index}].sourceProductName`}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      console.log(`New Product ID: ${newValue}`);
                                      setFieldValue(
                                        `orderProducts[${index}].sourceProductName`,
                                        newValue
                                      );
                                    }}
                                    className="w-[150px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Product ID"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].sourceProductName`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>


                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`orderProducts[${index}].products.productId`}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      console.log(`New Product ID: ${newValue}`);
                                      setFieldValue(
                                        `orderProducts[${index}].products.productId`,
                                        newValue
                                      );
                                    }}
                                    className="w-[150px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    placeholder="Enter Product ID"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].orderCategory`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>

                                {/* Order Category */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`orderProducts[${index}].orderCategory`}
                                    value={values.orderProducts[index]?.orderCategory || ""}
                                    className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                    readOnly
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].orderCategory`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>

                                {/* Client Order Quantity */}
                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`orderProducts[${index}].clientOrderQuantity`}
                                    className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].clientOrderQuantity`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>

                                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                  <Field
                                    name={`orderProducts[${index}].units`}
                                    className="w-[130px] bg-white dark:bg-form-input rounded border-[1.5px] border-stroke py-3 px-5 text-black"
                                  />
                                  <ErrorMessage
                                    name={`orderProducts[${index}].value`}
                                    component="div"
                                    className="text-red-600 text-sm"
                                  />
                                </td>


                                <td
                                  className="px-5 py-5 border-b border-gray-200 text-sm"
                                  colSpan={2} // Use colSpan to span across multiple columns
                                >


                                  {
                                    product.productStatus.toLowerCase() === "accepted" && (
                                      <div className="flex items-center gap-2">
                                        <span
                                          onClick={() => navigate(`/order/modifyproductafterexecution/${product?.id}`)}
                                          className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"
                                        >
                                          ISSUE CHALAAN
                                        </span>
                                        <span
                                          onClick={() => navigate(`/order/viewProduct/${product?.id}`)}
                                          className="bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]"
                                        >
                                          VIEW PRODUCT DETAILS
                                        </span>
                                      </div>
                                    )

                                    // : (product.productStatus?.toLowerCase() === "approved" || product.productStatus === "Pending") ? (
                                    //   <div className="flex items-center gap-2">
                                    //     <span
                                    //       onClick={() => navigate(`/order/updateorderproduct/${product?.id}`)}
                                    //       className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"
                                    //     >
                                    //       RECEIVING DETAILS
                                    //     </span>
                                    //     <span
                                    //       onClick={() => navigate(`/order/viewProduct/${product?.id}`)}
                                    //       className="bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]"
                                    //     >
                                    //       VIEW PRODUCT DETAILS
                                    //     </span>
                                    //   </div>
                                    // ) : (
                                    // <div className="flex items-center gap-2">
                                    //   <span
                                    //     onClick={() => navigate(`/order/modifyorderproduct/${product?.id}`)}
                                    //     className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"
                                    //   >
                                    //     VIEW ORDER PRODUCT
                                    //   </span>
                                    //   <span
                                    //     onClick={() => navigate(`/order/viewProduct/${product?.id}`)}
                                    //     className="bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]"
                                    //   >
                                    //     VIEW PRODUCT DETAILS
                                    //   </span>
                                    // </div>

                                  }








                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>














                   {
  (role.includes("ROLE_EXECUTOR") || role.includes("ROLE_ADMIN")) ? (
    <div className="flex justify-center mt-4">
      <button
        type='button'
        onClick={() => handleCancelOrder(values)}
        className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none"
      >
        Cancel Order
      </button>
    </div>
  ) : (
    <div className="flex justify-center mt-4">
      {/* <button
        type="submit"
        className="w-1/3 px-6 py-2 text-white bg-primary rounded-lg shadow hover:bg-primary-dark focus:outline-none"
      >
        Accept All
      </button> */}
    </div>
  )
}









                    </div>
                  </div>
                </div>


              </Form>
            )
          }}
        </Formik >
        {isSupplierModalOpen && (
          <SupplierModal
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


      </div >
    </DefaultLayout >
  );
};

export default UpdateOrderAccepted;
