import React, { useEffect, useState, useCallback, useMemo } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { Formik, Form } from 'formik';
import {
  DELETE_ORDER_URL,
  VIEW_PARTIALLYAPPROVED_ORDERS,
} from "../../Constants/utils";
import ReactSelect from 'react-select';
import useorder from '../../hooks/useOrder';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const ViewOrderPartiallyApproved = () => {
  const {
    getorderNumber,
    orderNo,
    getSupplier,
    getprodId,
    productId,
    supplier,
    getCustomer,
    customer,
  } = useorder();
  
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const { token } = currentUser;

  const [Order, setOrder] = useState([]);
  const [supplierNameOptions, setsupplierNameOptions] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const [productLoading, setProductLoading] = useState(false);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  
  const PRODUCTS_PER_PAGE = 50;
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    getorderNumber();
    getSupplier();
    getCustomer();
    getprodId();
  }, []);

  // Store all products when they're loaded
  useEffect(() => {
    if (productId && productId.length > 0) {
      setAllProducts(productId);
    }
  }, [productId]);

  // Format options
  const formattedorder = useMemo(() => 
    orderNo?.map((order) => ({
      label: order,
      value: order,
    })) || [],
    [orderNo]
  );

  const formattedSupplier = useMemo(() => 
    supplier?.map((supplier) => ({
      label: supplier.name,
      value: supplier.name,
    })) || [],
    [supplier]
  );

  const formattedCustomer = useMemo(() => 
    customer?.map((customer) => ({
      label: customer.customerName,
      value: customer.customerName,
    })) || [],
    [customer]
  );

  // Process products for display with pagination and search
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }

    setProductLoading(true);
    
    // Filter products based on search term
    let filteredProducts = allProducts;
    if (productSearchTerm) {
      const searchLower = productSearchTerm.toLowerCase();
      filteredProducts = allProducts.filter(prod => {
        // Handle both string and object product formats
        if (typeof prod === 'string') {
          return prod && prod.toLowerCase().includes(searchLower);
        } else if (typeof prod === 'object' && prod !== null) {
          // If product is an object, search in productId
          const prodId = prod.productId || prod.id || '';
          return prodId.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }

    // Paginate filtered results
    const startIndex = 0;
    const endIndex = productPage * PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    const formatted = paginatedProducts.map(prod => {
      // Handle both string and object product formats
      if (typeof prod === 'string') {
        return {
          label: prod,
          value: prod,
        };
      } else if (typeof prod === 'object' && prod !== null) {
        const prodId = prod.productId || prod.id || '';
        return {
          label: prodId,
          value: prodId,
        };
      }
      return {
        label: '',
        value: '',
      };
    });

    setDisplayedProducts(formatted);
    setAllProductsLoaded(endIndex >= filteredProducts.length);
    setProductLoading(false);
  }, [allProducts, productSearchTerm, productPage]);

  // Handle product search with debouncing
  const handleProductSearch = (inputValue) => {
    setProductSearchTerm(inputValue || '');
    setProductPage(1);
    setAllProductsLoaded(false);
  };

  // Handle menu scroll to load more products
  const handleMenuScroll = (event) => {
    if (!event || !event.target) return;
    
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && 
        !allProductsLoaded && 
        !productLoading &&
        allProducts.length > 0) {
      setProductPage(prev => prev + 1);
    }
  };

  // Get options for React Select
  const getProductOptions = useCallback(() => {
    if (!allProducts || allProducts.length === 0) {
      return [{ label: 'Loading products...', value: null, isDisabled: true }];
    }

    if (productSearchTerm && displayedProducts.length === 0 && !productLoading) {
      return [{ label: 'No products found', value: null, isDisabled: true }];
    }

    const options = [...displayedProducts];
    if (!allProductsLoaded && displayedProducts.length > 0) {
      options.push({ 
        label: productLoading ? 'Loading more...' : 'Scroll to load more...', 
        value: null, 
        isDisabled: true 
      });
    }
    
    return options;
  }, [displayedProducts, allProductsLoaded, productLoading, allProducts, productSearchTerm]);

  // Supplier options
  useEffect(() => {
    if (supplier?.data) {
      const formattedOptions = supplier.data.map((supp) => ({
        value: supp.id,
        label: supp?.name,
        supplierNameObject: supp,
        suplierid: { id: supp.id }
      }));
      setsupplierNameOptions(formattedOptions);
    }
  }, [supplier?.data]);

  // Pagination state for orders
  const [pagination, setPagination] = useState({
    totalItems: 0,
    data: [],
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Get orders
  const getOrder = async (page, filters = {}) => {
    try {
      const response = await fetch(`${VIEW_PARTIALLYAPPROVED_ORDERS}?page=${page || 1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(filters)
      });

      const textResponse = await response.text();

      try {
        const data = JSON.parse(textResponse);

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
          itemsPerPage: data?.size || 10,
        });
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        toast.error("Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrder([]);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    getOrder(newPage);
  };

  // Handle delete
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${DELETE_ORDER_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Order Deleted Successfully !!`);
        const isCurrentPageEmpty = Order.length === 1;
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
      toast.error("An error occurred");
    }
  };

  // Helper function to safely get product ID from different formats
  const getProductId = (product) => {
    if (!product) return '';
    if (typeof product === 'string') return product;
    if (typeof product === 'object' && product !== null) {
      return product.productId || product.id || '';
    }
    return '';
  };

  // Helper function to safely get product status
  const getProductStatus = (product) => {
    if (!product) return '';
    if (typeof product === 'object' && product !== null) {
      return product.productStatus || product.status || '';
    }
    return '';
  };

  // Helper function to safely get product display name
  const getProductDisplay = (product) => {
    if (!product) return '';
    if (typeof product === 'string') return product;
    if (typeof product === 'object' && product !== null) {
      return product.productId || product.id || '';
    }
    return '';
  };

  // Render table rows
  const renderTableRows = () => {
    if (!Order || !Order.length) {
      return (
        <tr className='bg-white dark:bg-slate-700 dark:text-white'>
          <td colSpan="6" className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="text-gray-900 whitespace-no-wrap text-center">No Order Found</p>
          </td>
        </tr>
      );
    }

    const startingSerialNumber = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    return Order.map((item, index) => {
      // Debug log to see what products look like
      console.log('Product data:', item.products);
      
      return (
        <tr key={item.id || index} className='bg-white dark:bg-slate-700 dark:text-white'>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{startingSerialNumber + index}</p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{item?.orderNo}</p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{item.customerName}</p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            {item.products && item.products.length > 0 ? (
              item.products.map((prod, idx) => {
                // Get the product ID or display value
                const displayValue = getProductDisplay(prod);
                return (
                  <p key={idx} className="text-gray-900 whitespace-nowrap">
                    {displayValue}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-900">-</p>
            )}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            {item.products && item.products.length > 0 ? (
              item.products.map((prod, idx) => {
                // Get the product status
                const status = getProductStatus(prod);
                return (
                  <p key={idx} className="text-gray-900 whitespace-nowrap">
                    {status || '-'}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-900">-</p>
            )}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <p className="flex text-gray-900 whitespace-no-wrap">
              <FiEdit 
                size={17} 
                className='text-teal-500 hover:text-teal-700 mx-2 cursor-pointer' 
                onClick={() => navigate(`/Order/updatepartiallyApproved/${item?.id}`)} 
                title='Edit Order' 
              />
              <FiTrash2 
                size={17} 
                className='text-red-500 hover:text-red-700 mx-2 cursor-pointer' 
                onClick={(e) => handleDelete(e, item?.id)} 
                title='Delete Product' 
              />
            </p>
          </td>
        </tr>
      );
    });
  };

  // Handle form submit
  const handleSubmit = (values) => {
    const filters = {
      orderNo: values.orderNo || undefined,
      supplierName: values.supplierName || undefined,
      customerName: values.customerName || undefined,
      productId: values.productId || undefined
    };
    getOrder(pagination.currentPage, filters);
  };

  // Custom MenuList with scroll handling
  const CustomMenuList = ({ children, ...props }) => {
    return (
      <div
        {...props}
        onScroll={handleMenuScroll}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
        {children}
      </div>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order/ View Order Partially Approved" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className='flex justify-between'>
            <h2 className="text-xl font-semibold leading-tight">View Orders that are Partially Approved</h2>
          </div>

          <div className='items-center justify-center'>
            <Formik
              initialValues={{
                orderNo: '',
                customerName: "",
                supplierName: "",
                productId: ""
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, handleBlur }) => (
                <Form>
                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[200px]">
                      <label className="mb-2.5 block text-black dark:text-white">Order No</label>
                      <ReactSelect
                        name="orderNo"
                        value={formattedorder.find(option => option.value === values.orderNo)}
                        onChange={(option) => {
                          setFieldValue('orderNo', option?.value || '');
                        }}
                        onBlur={handleBlur}
                        options={[{ label: 'View All Order', value: '' }, ...formattedorder]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"
                        isClearable
                      />
                    </div>

                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Supplier
                        <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                      </label>
                      <div className="z-20 bg-transparent dark:bg-form-Field">
                        <ReactSelect
                          name="supplierName"
                          value={formattedSupplier.find(option => option.value === values.supplierName)}
                          onChange={(option) => setFieldValue('supplierName', option?.value || '')}
                          options={[{ label: 'View All Suppliers', value: '' }, ...formattedSupplier]}
                          styles={customStyles}
                          className="bg-white dark:bg-form-Field"
                          classNamePrefix="react-select"
                          placeholder="Select supplier Name"
                          isClearable
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[200px]">
                      <label className="mb-2.5 block text-black dark:text-white">Product Id</label>
                      <ReactSelect
                        name="productId"
                        value={
                          values.productId
                            ? { label: values.productId, value: values.productId }
                            : null
                        }
                        onChange={(option) => {
                          setFieldValue('productId', option?.value || '');
                        }}
                        onBlur={handleBlur}
                        options={[
                          { label: 'View All Products', value: '' },
                          ...getProductOptions()
                        ]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Search Product ID..."
                        isClearable
                        isSearchable
                        onInputChange={handleProductSearch}
                        components={{ MenuList: CustomMenuList }}
                        loadingMessage={() => 'Loading products...'}
                        noOptionsMessage={() => 'No products found'}
                      />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <label className="mb-2.5 block text-black dark:text-white">Customer</label>
                      <ReactSelect
                        name="customerName"
                        value={formattedCustomer.find(option => option.value === values.customerName)}
                        onChange={(option) => {
                          setFieldValue('customerName', option?.value || '');
                        }}
                        onBlur={handleBlur}
                        options={[{ label: 'View All Customers', value: '' }, ...formattedCustomer]}
                        styles={customStyles}
                        className="bg-white dark:bg-form-input"
                        classNamePrefix="react-select"
                        placeholder="Select"
                        isClearable
                      />
                    </div>
                  </div>

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
                  <tr className='bg-slate-300 dark:bg-slate-700 dark:text-white'>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order No</th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Id</th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
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

export default ViewOrderPartiallyApproved;