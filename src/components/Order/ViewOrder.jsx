import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Field, Formik, Form } from 'formik';
import { DELETE_ORDER_URL, VIEW_ALL_ORDERS } from '../../Constants/utils';
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { MdViewList } from 'react-icons/md';

const ViewOrder = () => {
  const {
    handleUpdate,
    getorderNumber,
    orderNo,
    getSupplier,
    supplier,
    getCustomer,
    customer,
  } = useorder();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const theme = useSelector((state) => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const { token } = currentUser;
  const [Order, setOrder] = useState();
  const [supplierNameOptions, setsupplierNameOptions] = useState([]);
  const [orderNameOptions, setorderNameOptions] = useState([]);
  const navigate = useNavigate();

  // Add mounted flag to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(true);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getorderNumber();
    getSupplier();
    getCustomer();

    // Cleanup flag
    return () => {
      setIsMounted(false);
    };
  }, []);

  const formattedorder =
    orderNo?.map((order) => ({
      label: order,
      value: order,
    })) || [];

  const formattedSupplier =
    supplier?.map((supplier) => ({
      label: supplier.name,
      value: supplier.name,
    })) || [];

  const formattedCustomer =
    customer?.map((customer) => ({
      label: customer.customerName,
      value: customer.customerName,
    })) || [];

  useEffect(() => {
    if (supplier?.data) {
      const formattedOptions = supplier.data.map((supp) => ({
        value: supp.id,
        label: supp?.name,
        supplierNameObject: supp,
        suplierid: { id: supp.id },
      }));
      setsupplierNameOptions(formattedOptions);
    }
  }, [supplier?.data]);

  const getOrder = async (page, filters = {}) => {
    try {
      const response = await fetch(`${VIEW_ALL_ORDERS}?page=${page || 1}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      });

      const textResponse = await response.text();

      try {
        const data = JSON.parse(textResponse);

        // Only update state if component is still mounted
        if (isMounted) {
          if (data?.content) {
            setOrder(data.content);
          } else {
            setOrder([]);
          }

          setPagination({
            totalItems: data?.totalElements || 0,
            data: data?.content || [],
            totalPages: data?.totalPages || 0,
            currentPage: data?.number + 1 || 1,
            itemsPerPage: data?.size || 0,
          });
        }
      } catch (parseError) {
        console.error('Error parsing response as JSON:', parseError);
        if (isMounted) {
          toast.error('Invalid response format.');
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (isMounted) {
        toast.error('Failed to fetch orders');
        setOrder([]);
      }
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getOrder(newPage);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_ORDER_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Deleted Successfully !!`);

        const isCurrentPageEmpty = Order?.length === 1;

        if (isCurrentPageEmpty && pagination.currentPage > 1) {
          const previousPage = pagination.currentPage - 1;
          handlePageChange(previousPage);
        } else {
          getOrder(pagination.currentPage);
        }
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  const renderTableRows = () => {
    if (!Order || !Order.length) {
      return (
        <tr className="bg-white dark:bg-slate-700 dark:text-white">
          <td
            colSpan="8"
            className="px-5 py-5 border-b border-gray-200 text-sm"
          >
            <p className="text-gray-900 whitespace-no-wrap text-center">
              No Order Found
            </p>
          </td>
        </tr>
      );
    }

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return Order.map((item, index) => (
      <tr
        key={item?.id || index}
        className="bg-white dark:bg-slate-700 dark:text-white"
      >
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm tracking-wider whitespace-nowrap">
          <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>
        </td>
     
        <td className="px-5 py-5 border-b border-gray-200 text-sm whitespace-nowrap tracking-wider">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.customerName}
          </p>
        </td>
  <td className="px-5 py-5 border-b border-gray-200 text-sm tracking-wider whitespace-nowrap">
  {item?.products?.map((prodId, idx) => {
    const status = (prodId.productStatus || '').toLowerCase();

    let badgeClasses = 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:border-slate-700';

    if (status.includes('closed')) {
      badgeClasses = 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    } else if (status.includes('pending')) {
      badgeClasses = 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    } else if (status.includes('approved')) {
      badgeClasses = 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    } else if (status.includes('cancelled') || status.includes('canceled')) {
      badgeClasses = 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    }

    return (
      <div key={idx} className="mb-1 flex items-center gap-2">
        <span className="text-gray-900 whitespace-no-wrap tracking-wider">
          {prodId.productId}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeClasses}`}>
          {prodId.productStatus}
        </span>
      </div>
    );
  })}
</td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm tracking-wider whitespace-nowrap">
          {item?.products?.map((prodId, idx) => (
            <div key={idx} className="mb-1">
              <span className="text-gray-900 whitespace-no-wrap tracking-wider">
                {prodId.orderCategory}
              </span>
       
            </div>
          ))}
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm whitespace-nowrap tracking-wider">
          <p className="text-gray-900 whitespace-no-wrap">{item.name}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{item.orderDate}</p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">{item.orderStatus}</p>
        </td>
        {item.orderStatus && item.orderStatus.toLowerCase() === 'created' ? (
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap">
              <FiEdit
                size={17}
                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                onClick={() => navigate(`/Order/updateorder/${item?.id}`)}
                title="Edit Order"
              />
              <span className="text-gray-300 mx-1">|</span>
              <FiTrash2
                size={17}
                className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
                onClick={(e) => handleDelete(e, item?.id)}
                title="Delete Order"
              />
            </p>
          </td>
        ) : (
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap">
              <MdViewList
                size={17}
                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                onClick={() => navigate(`/order/viewOrder/${item?.id}`)}
                title="View Order"
              />
              <span className="text-gray-300 mx-1">|</span>
            </p>
          </td>
        )}
      </tr>
    ));
  };

  const handleSubmit = (values) => {
    const filters = {
      orderNo: values.orderNo || undefined,
      supplierName: values.supplierName || undefined,
      fromDate: values.fromDate || undefined,
      toDate: values.toDate || undefined,
      customerName: values.customerName || undefined,
    };
    getOrder(pagination.currentPage, filters);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/ View Order" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
              <span>View Order</span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                TOTAL ORDERS: {pagination.totalItems}
              </span>
            </h2>
          </div>

          <div className="items-center justify-center">
            <Formik
              initialValues={{
                orderNo: '',
                supplierName: '',
                fromDate: '',
                toDate: '',
                customerName: '',
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, handleBlur }) => (
                <Form>
                  <div className=" grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    <div className=" min-w-[200px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Order No
                      </label>
                      <ReactSelect
                        name="orderNo"
                        value={orderNameOptions.find(
                          (option) => option.value === values.orderNo,
                        )}
                        onChange={(option) => {
                          setFieldValue('orderNo', option?.value);
                        }}
                        onBlur={handleBlur}
                        options={[
                          { label: 'View All Order', value: null },
                          ...formattedorder,
                        ]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"
                      />
                    </div>

                    <div className=" min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Supplier
                      </label>
                      <div className="z-20 bg-transparent dark:bg-form-Field">
                        <ReactSelect
                          name="supplierName"
                          value={formattedSupplier.find(
                            (option) => option.value === values.supplierName,
                          )}
                          onChange={(option) =>
                            setFieldValue(
                              'supplierName',
                              option ? option.value : null,
                            )
                          }
                          options={[
                            { label: 'View All Suppliers', value: null },
                            ...formattedSupplier,
                          ]}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select supplier Name"
                        />
                      </div>
                    </div>
                    <div className=" min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        From Date
                      </label>
                      <Field
                        name="fromDate"
                        type="date"
                        placeholder="Enter Purchase Order Date"
                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        To Date
                      </label>
                      <Field
                        name="toDate"
                        type="date"
                        placeholder="Enter Purchase Order Date"
                        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Customer
                      </label>
                      <ReactSelect
                        name="customerName"
                        value={formattedCustomer.find(
                          (option) => option.value === values.customerName,
                        )}
                        onChange={(option) => {
                          setFieldValue('customerName', option?.value);
                        }}
                        onBlur={handleBlur}
                        options={[
                          { label: 'View All Customers', value: null },
                          ...formattedCustomer,
                        ]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12"></div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10px]">
                      SNO
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[150px]">
                      Order No
                    </th>
                 
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-[110px]">
                      Product Id
                    </th>
                     <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-[110px]">
                      Category
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[170px]">
                      Supplier
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[140px]">
                      Order Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[140px]">
                      Order Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </table>
            </div>
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewOrder;
