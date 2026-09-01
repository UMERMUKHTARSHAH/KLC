import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import { toast } from "react-hot-toast";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Pagination from "../../components/Pagination/Pagination";
import { GET_PRODUCTDETAILS_URL, GET_IMAGE, GET_SUPPLIERS_URL, GET_INPROGRESS_URL, UPDATE_ISSUECHALLAN } from "../../Constants/utils";
import { FiEdit } from "react-icons/fi";

const ProductGroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user || {});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productGroupName, setProductGroupName] = useState("");
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierError, setSupplierError] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [activeView, setActiveView] = useState("orders");
  const [supplierDetailView, setSupplierDetailView] = useState(null);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [inProgressLoading, setInProgressLoading] = useState(false);
  const [inProgressError, setInProgressError] = useState(null);
  const [categoryOrders, setCategoryOrders] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [selectedOrderType, setSelectedOrderType] = useState(null);

  // Add state for category counts
  const [categoryCounts, setCategoryCounts] = useState({
    retail: 0,
    wholesale: 0,
    klc: 0,
    total: 0,
    inProgress: 0,
    supplier: 0
  });

  // Pagination states
  const [ordersPagination, setOrdersPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });
  
  const [inProgressPagination, setInProgressPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });
  
  const [categoryPagination, setCategoryPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });

  // Pagination for Suppliers table
  const [suppliersPagination, setSuppliersPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0
  });

  // Pagination for Supplier Detail View
  const [supplierDetailCurrentPage, setSupplierDetailCurrentPage] = useState(1);
  const supplierDetailPageSize = 10;

  // Challan update states
  const [openChallanDropdownId, setOpenChallanDropdownId] = useState(null);
  const [editingChallanNo, setEditingChallanNo] = useState("");
  const [updatingChallanId, setUpdatingChallanId] = useState(null);
  const [updateChallanLoading, setUpdateChallanLoading] = useState(false);
  const challanDropdownRef = useRef(null);
  const [challanDropdownPos, setChallanDropdownPos] = useState({ top: 0, left: 0 });

  // Store all data for client-side pagination
  const [allProducts, setAllProducts] = useState([]);
  const [allInProgress, setAllInProgress] = useState([]);
  const [allCategoryOrders, setAllCategoryOrders] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  const getDisplayOrderType = (orderType) => {
    switch(orderType) {
      case 'RetailClients':
        return 'RETAIL';
      case 'WSClients':
        return 'WHOLESALE';
      case 'KLCStock':
        return 'KLC';
      default:
        return orderType?.toUpperCase() || '';
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get('name');
    if (name) {
      setProductGroupName(decodeURIComponent(name));
    }
  }, []);

  // Click outside handler for challan dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        challanDropdownRef.current &&
        !challanDropdownRef.current.contains(event.target) &&
        !event.target.closest('.challan-button-supplier')
      ) {
        setOpenChallanDropdownId(null);
        setEditingChallanNo("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle escape key for challan dropdown
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && openChallanDropdownId) {
        setOpenChallanDropdownId(null);
        setEditingChallanNo("");
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openChallanDropdownId]);

  const handleUpdate = (e, orderProduct, orderNo) => {
    e.preventDefault();
    const orderProductId = orderProduct?.orderProductId;

    if (!orderProductId) {
      toast.error("Order Product ID not found");
      return;
    }

    navigate(`/UpdateKani/${orderProductId}`);
  };

  // Challan update functions
  const handleChallanInputChange = (e) => {
    setEditingChallanNo(e.target.value);
  };

  const openUpdateChallan = (event, supplier, currentChallanNo) => {
    event.stopPropagation();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX + (rect.width / 2);
    
    const dropdownWidth = 288;
    
    if (left + dropdownWidth / 2 > viewportWidth) {
      left = viewportWidth - dropdownWidth / 2 - 10;
    } else if (left - dropdownWidth / 2 < 0) {
      left = dropdownWidth / 2 + 10;
    }
    
    const estimatedHeight = 200;
    if (top + estimatedHeight > viewportHeight + window.scrollY) {
      top = rect.top + window.scrollY - estimatedHeight - 5;
    }
    
    setChallanDropdownPos({
      top: top + 5,
      left: left,
    });
    
    setOpenChallanDropdownId(supplier.orderProductId);
    setEditingChallanNo(currentChallanNo !== "N/A" ? currentChallanNo : "");
  };

  const closeUpdateChallan = () => {
    setOpenChallanDropdownId(null);
    setEditingChallanNo("");
  };

  const handleUpdateChallan = async (orderProductId) => {
    try {
      if (!editingChallanNo.trim()) {
        toast.error("Please enter a challan number");
        return;
      }
      
      setUpdatingChallanId(orderProductId);
      setUpdateChallanLoading(true);
      
      const updateData = {
        challanNo: editingChallanNo.trim()
      };
      
      const response = await axios.put(
        `${UPDATE_ISSUECHALLAN}/${orderProductId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update allSuppliers state
      setAllSuppliers(prev => 
        prev.map(item => 
          item.orderProductId === orderProductId 
            ? { ...item, challanNo: editingChallanNo.trim() }
            : item
        )
      );
      
      // Update current page supplierData
      setSupplierData(prev => 
        prev.map(item => 
          item.orderProductId === orderProductId 
            ? { ...item, challanNo: editingChallanNo.trim() }
            : item
        )
      );
      
      closeUpdateChallan();
      toast.success(`Challan No: ${editingChallanNo} updated successfully!`);
      
    } catch (error) {
      console.error("Error updating challan:", error);
      if (error.response?.status === 404) {
        toast.error("Endpoint not found. Please check API configuration.");
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.data) {
        toast.error(error.response.data.message || "Update failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setUpdateChallanLoading(false);
      setUpdatingChallanId(null);
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return null;
    
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    return `${GET_IMAGE}/products/getimages/${filename}`;
  };

  const getPlaceholder = (text = "No Image") => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
        <rect width="56" height="56" fill="#f3f4f6" rx="4"/>
        <text x="50%" y="50%" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ${text}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const fetchSuppliers = async () => {
    try {
      setSupplierLoading(true);
      setSupplierError(null);
      
      const params = new URLSearchParams();
      if (productGroupName) {
        params.append('productGroupName', productGroupName);
      }
      
      // Fetch all data with a large page size to get all items at once
      params.append('page', '0');
      params.append('size', '1000');
      
      const fullUrl = params.toString() 
        ? `${GET_PRODUCTDETAILS_URL}?${params.toString()}` 
        : GET_PRODUCTDETAILS_URL;
      
      const response = await axios.get(fullUrl, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      
      let suppliersList = [];
      
      // Log the response to debug
      console.log('Fetch Suppliers Response:', {
        totalCount: response.data?.totalCount,
        totalElements: response.data?.totalElements,
        contentLength: response.data?.content?.length,
        totalPages: response.data?.totalPages
      });
      
      if (response.data?.content && Array.isArray(response.data.content)) {
        response.data.content.forEach(order => {
          if (order.products && Array.isArray(order.products)) {
            order.products.forEach(product => {
              if (product.suppliers && Array.isArray(product.suppliers)) {
                product.suppliers.forEach(supplier => {
                  let referenceImage = null;
                  let actualImage = null;
                  let allImages = [];
                  
                  if (product.images && Array.isArray(product.images)) {
                    allImages = product.images;
                    product.images.forEach(image => {
                      if (image.referenceImage && !referenceImage) {
                        referenceImage = image.referenceImage;
                      }
                      if (image.actualImage && !actualImage) {
                        actualImage = image.actualImage;
                      }
                    });
                  }
                  
                  suppliersList.push({
                    orderProductId: product?.orderProductId,
                    orderNo: order.orderNo,
                    productId: product?.productId || "N/A",
                    productGroup: product?.productGroup || productGroupName,
                    category: product?.productCategory || "N/A",
                    supplier: {
                      id: supplier.supplierId,
                      name: supplier.supplierName,
                      supplierName: supplier.supplierName
                    },
                    supplierOrderQty: supplier.supplierOrderQty || "N/A",
                    challanNo: product.challanNo || "N/A",
                    status: order.orderStatus || "N/A",
                    refImage: referenceImage,
                    actImage: actualImage,
                    allImages: allImages,
                    originalData: product
                  });
                });
              }
            });
          }
        });
      }
      
      // If we got less than totalCount, fetch remaining pages
      const totalCount = response.data?.totalCount || response.data?.totalElements || suppliersList.length;
      const totalPages = response.data?.totalPages || 1;
      
      // If we have multiple pages and didn't get all items, fetch remaining pages
      if (totalPages > 1 && suppliersList.length < totalCount) {
        console.log('Fetching remaining pages...');
        let allSuppliersList = [...suppliersList];
        
        for (let page = 1; page < totalPages; page++) {
          const pageParams = new URLSearchParams();
          if (productGroupName) {
            pageParams.append('productGroupName', productGroupName);
          }
          pageParams.append('page', page.toString());
          pageParams.append('size', '1000');
          
          const pageUrl = pageParams.toString() 
            ? `${GET_PRODUCTDETAILS_URL}?${pageParams.toString()}` 
            : GET_PRODUCTDETAILS_URL;
          
          const pageResponse = await axios.get(pageUrl, {
            headers: {
              'Authorization': `Bearer ${currentUser?.token}`
            }
          });
          
          if (pageResponse.data?.content && Array.isArray(pageResponse.data.content)) {
            pageResponse.data.content.forEach(order => {
              if (order.products && Array.isArray(order.products)) {
                order.products.forEach(product => {
                  if (product.suppliers && Array.isArray(product.suppliers)) {
                    product.suppliers.forEach(supplier => {
                      let referenceImage = null;
                      let actualImage = null;
                      let allImages = [];
                      
                      if (product.images && Array.isArray(product.images)) {
                        allImages = product.images;
                        product.images.forEach(image => {
                          if (image.referenceImage && !referenceImage) {
                            referenceImage = image.referenceImage;
                          }
                          if (image.actualImage && !actualImage) {
                            actualImage = image.actualImage;
                          }
                        });
                      }
                      
                      allSuppliersList.push({
                        orderProductId: product?.orderProductId,
                        orderNo: order.orderNo,
                        productId: product?.productId || "N/A",
                        productGroup: product?.productGroup || productGroupName,
                        category: product?.productCategory || "N/A",
                        supplier: {
                          id: supplier.supplierId,
                          name: supplier.supplierName,
                          supplierName: supplier.supplierName
                        },
                        supplierOrderQty: supplier.supplierOrderQty || "N/A",
                        challanNo: product.challanNo || "N/A",
                        status: order.orderStatus || "N/A",
                        refImage: referenceImage,
                        actImage: actualImage,
                        allImages: allImages,
                        originalData: product
                      });
                    });
                  }
                });
              }
            });
          }
        }
        
        suppliersList = allSuppliersList;
      }
      
      const formattedSuppliers = suppliersList.map((item) => ({
        orderProductId: item.orderProductId,
        orderNo: item.orderNo || "N/A",
        productId: item.productId || "N/A",
        productGroup: item.productGroup || productGroupName || "N/A",
        category: item.category || "N/A",
        supplierName: item.supplier?.name || item.supplier?.supplierName || "N/A",
        supplierQty: item.supplierOrderQty || "N/A",
        challanNo: item.challanNo || "N/A",
        status: item.status || "N/A",
        refImage: item.refImage,
        actImage: item.actImage,
        allImages: item.allImages,
        originalData: item
      }));
      
      console.log('Total suppliers processed:', formattedSuppliers.length);
      
      // Store all suppliers data
      setAllSuppliers(formattedSuppliers);
      
      // Update pagination using the actual total count from API
      const actualTotal = response.data?.totalCount || 
                         response.data?.totalElements || 
                         formattedSuppliers.length;
      
      const totalPagesCount = Math.ceil(actualTotal / suppliersPagination.pageSize);
      
      setSuppliersPagination(prev => ({
        ...prev,
        totalPages: totalPagesCount,
        totalItems: actualTotal
      }));
      
      // Set current page data
      const startIndex = (suppliersPagination.currentPage - 1) * suppliersPagination.pageSize;
      const endIndex = Math.min(startIndex + suppliersPagination.pageSize, formattedSuppliers.length);
      const paginatedData = formattedSuppliers.slice(startIndex, endIndex).map((item, idx) => ({
        ...item,
        sno: startIndex + idx + 1
      }));
      
      console.log('Paginated data length:', paginatedData.length);
      console.log('Showing items:', startIndex + 1, 'to', endIndex, 'of', formattedSuppliers.length);
      
      setSupplierData(paginatedData);
      setSuppliers(formattedSuppliers.map(s => s.supplierName));
      
      if (formattedSuppliers.length === 0) {
        setSupplierError("No supplier orders found for this product group");
      }
      
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSupplierError(err.response?.data?.message || err.response?.data?.error || "Failed to load suppliers. Please try again.");
      setSupplierData([]);
    } finally {
      setSupplierLoading(false);
    }
  };

  // Handle suppliers page change
  const handleSuppliersPageChange = (page) => {
    setSuppliersPagination(prev => ({ ...prev, currentPage: page }));
    
    // Update displayed data
    const startIndex = (page - 1) * suppliersPagination.pageSize;
    const endIndex = Math.min(startIndex + suppliersPagination.pageSize, allSuppliers.length);
    const paginatedData = allSuppliers.slice(startIndex, endIndex).map((item, idx) => ({
      ...item,
      sno: startIndex + idx + 1
    }));
    
    console.log('Page:', page, 'Showing items:', startIndex + 1, 'to', endIndex, 'of', allSuppliers.length);
    setSupplierData(paginatedData);
  };

  const fetchInProgressOrders = async (page = 1) => {
    try {
      setInProgressLoading(true);
      setInProgressError(null);
      
      const params = new URLSearchParams();
      if (productGroupName) {
        params.append('productGroupName', productGroupName);
      }
      
      const fullUrl = params.toString() 
        ? `${GET_INPROGRESS_URL}?${params.toString()}` 
        : GET_INPROGRESS_URL;
      
      const response = await axios.get(fullUrl, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      
      let inProgressList = [];
      let totalElements = 0;
      
      if (response.data?.content && Array.isArray(response.data.content)) {
        inProgressList = response.data.content;
        totalElements = response.data.totalElements || inProgressList.length;
      } else if (Array.isArray(response.data)) {
        inProgressList = response.data;
        totalElements = inProgressList.length;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        inProgressList = response.data.data;
        totalElements = inProgressList.length;
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        inProgressList = [response.data];
        totalElements = 1;
      }
      
      const formattedInProgress = inProgressList.map((item, index) => {
        let customerName = "N/A";
        if (item.customerName && item.customerName !== "null") {
          customerName = item.customerName;
        } else if (item.customer) {
          if (typeof item.customer === 'object') {
            customerName = item.customer.customerName || item.customer.name || "N/A";
          } else {
            customerName = item.customer;
          }
        }
        
        let productId = "N/A";
        if (item.products && Array.isArray(item.products) && item.products[0]) {
          productId = item.products[0].productId || "N/A";
        } else if (item.orderProducts && Array.isArray(item.orderProducts) && item.orderProducts[0]) {
          if (item.orderProducts[0].products) {
            productId = item.orderProducts[0].products.productId || "N/A";
          }
        } else if (item.productId) {
          productId = item.productId;
        }
        
        const orderNo = item.orderNo || "N/A";
        const status = item.orderStatus || item.status || "N/A";
        const orderId = item.orderId || null;
        
        return {
          sno: index + 1,
          orderNo: orderNo,
          customer: customerName !== "null" && customerName !== "N/A" ? customerName : "No customer",
          productId: productId,
          status: status,
          orderId: orderId,
          originalData: item
        };
      });
      
      setAllInProgress(formattedInProgress);
      
      const totalPages = Math.ceil(totalElements / inProgressPagination.pageSize);
      const startIndex = (page - 1) * inProgressPagination.pageSize;
      const endIndex = startIndex + inProgressPagination.pageSize;
      const paginatedData = formattedInProgress.slice(startIndex, endIndex).map((item, idx) => ({
        ...item,
        sno: startIndex + idx + 1
      }));
      
      setInProgressOrders(paginatedData);
      setInProgressPagination({
        currentPage: page,
        pageSize: inProgressPagination.pageSize,
        totalPages: totalPages,
        totalItems: totalElements
      });
      setActiveView("inProgress");
      
      if (formattedInProgress.length === 0) {
        setInProgressError(`No in-progress orders found for ${productGroupName}`);
      }
      
    } catch (err) {
      console.error("Error fetching in-progress orders:", err);
      setInProgressError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to load in-progress orders. Please try again."
      );
      setInProgressOrders([]);
    } finally {
      setInProgressLoading(false);
    }
  };

  const fetchCategoryOrders = async (orderType, page = 1) => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);
      
      const params = new URLSearchParams();
      if (productGroupName) {
        params.append('productGroupName', productGroupName);
      }
      if (orderType) {
        params.append('orderType', orderType);
      }
      
      const fullUrl = params.toString() 
        ? `${GET_PRODUCTDETAILS_URL}?${params.toString()}` 
        : GET_PRODUCTDETAILS_URL;
      
      const response = await axios.get(fullUrl, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      
      let ordersData = [];
      let totalElements = 0;
      
      if (response.data?.content && Array.isArray(response.data.content)) {
        response.data.content.forEach((order) => {
          if (order.products && Array.isArray(order.products)) {
            order.products.forEach((product) => {
              let referenceImage = null;
              let actualImage = null;
              let allImages = [];
              
              if (product.images && Array.isArray(product.images)) {
                allImages = product.images;
                product.images.forEach(image => {
                  if (image.referenceImage && !referenceImage) {
                    referenceImage = image.referenceImage;
                  }
                  if (image.actualImage && !actualImage) {
                    actualImage = image.actualImage;
                  }
                });
              }
              
              let supplierName = "N/A";
              if (product.suppliers && Array.isArray(product.suppliers) && product.suppliers.length > 0) {
                supplierName = product.suppliers[0].supplierName || "N/A";
              }
              
              ordersData.push({
                orderNo: order.orderNo,
                orderProductId: product?.orderProductId,
                productId: product?.productId || "N/A",
                productGroup: product?.productGroup || productGroupName,
                category: product?.productCategory || order.orderCategory || "N/A",
                supplier: supplierName,
                status: order.orderStatus || "N/A",
                refImage: referenceImage,
                actImage: actualImage,
                allImages: allImages,
                customerName: order.customerName || "N/A",
                product: product,
                originalOrder: order
              });
            });
          }
        });
        totalElements = response.data.totalElements || ordersData.length;
      }
      
      setAllCategoryOrders(ordersData);
      
      const totalPages = Math.ceil(totalElements / categoryPagination.pageSize);
      const startIndex = (page - 1) * categoryPagination.pageSize;
      const endIndex = startIndex + categoryPagination.pageSize;
      const paginatedData = ordersData.slice(startIndex, endIndex);
      
      const formattedOrders = paginatedData.map((item, idx) => ({
        ...item,
        sno: startIndex + idx + 1
      }));
      
      setCategoryOrders(formattedOrders);
      setCategoryPagination({
        currentPage: page,
        pageSize: categoryPagination.pageSize,
        totalPages: totalPages,
        totalItems: totalElements
      });
      setSelectedOrderType(orderType);
      setActiveView("category");
      
      if (ordersData.length === 0) {
        setCategoryError(`No ${orderType} orders found for ${productGroupName}`);
      }
      
    } catch (err) {
      console.error("Error fetching category orders:", err);
      setCategoryError(err.response?.data?.message || err.response?.data?.error || `Failed to load ${orderType} orders. Please try again.`);
      setCategoryOrders([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSupplierNameClick = (supplierName) => {
    // Reset to first page when selecting a new supplier
    setSupplierDetailCurrentPage(1);
    
    // Get all orders for this supplier with complete image data
    const supplierOrders = allSuppliers
      .filter(item => item.supplierName === supplierName)
      .map(item => ({
        ...item,
        // Ensure images are properly passed
        refImage: item.refImage,
        actImage: item.actImage,
        allImages: item.allImages || [],
        orderNo: item.orderNo,
        productId: item.productId,
        productGroup: item.productGroup,
        category: item.category
      }));
    
    setSupplierDetailView({
      name: supplierName,
      orders: supplierOrders
    });
  };

  const handleBackToSuppliers = () => {
    setSupplierDetailView(null);
    setSupplierDetailCurrentPage(1);
  };

  const handleBackToMain = () => {
    setActiveView("orders");
    setSupplierDetailView(null);
    setSelectedOrderType(null);
    setCategoryOrders([]);
  };

  const handleViewImages = (product) => {
    setSelectedProduct(product);
    setSelectedImages(product.allImages || []);
    setShowAllImages(true);
  };

  const closeModal = () => {
    setShowAllImages(false);
    setSelectedProduct(null);
    setSelectedImages([]);
  };

  const handleSupplierClick = async () => {
    setActiveView("suppliers");
    setSupplierDetailView(null);
    setSuppliersPagination(prev => ({ ...prev, currentPage: 1 }));
    await fetchSuppliers();
  };

  const handleInProgressClick = () => {
    fetchInProgressOrders(1);
  };

  const handleCategoryClick = (category) => {
    if (category === 'retail') {
      fetchCategoryOrders('RetailClients', 1);
    } else if (category === 'wholesale') {
      fetchCategoryOrders('WSClients', 1);
    } else if (category === 'klc') {
      fetchCategoryOrders('KLCStock', 1);
    } else {
      setActiveView("orders");
      setSelectedOrderType(null);
      setCategoryOrders([]);
    }
    setSupplierDetailView(null);
  };

  const getCategoryStats = () => {
    const retailCount = allProducts.filter(p => p.category?.toLowerCase() === 'retail').length;
    const wholesaleCount = allProducts.filter(p => p.category?.toLowerCase() === 'wholesale').length;
    const klcCount = allProducts.filter(p => p.category?.toLowerCase() === 'klc').length;
    const totalCount = allProducts.length;
    
    return { retailCount, wholesaleCount, klcCount, totalCount };
  };

  const stats = getCategoryStats();

 useEffect(() => {
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('productGroupName', productGroupName);
      params.append('page', '0');
      params.append('size', '1000');
      
      const response = await axios.get(`${GET_PRODUCTDETAILS_URL}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });
      
      // Log the full API response
      console.log('API Response:', response.data);
      
      let productsData = [];
      let totalElements = 0;
      
      // Extract counts from response - now includes inProgressCount and supplierCount
      if (response.data) {
        // Log individual counts
        console.log('Retail Count:', response.data.retailCount);
        console.log('Wholesale Count:', response.data.wsCount);
        console.log('KLC Count:', response.data.klcCount);
        console.log('Total Count:', response.data.totalCount);
        console.log('In Progress Count:', response.data.inProgressCount);
        console.log('Supplier Count:', response.data.supplierCount);
        
        setCategoryCounts({
          retail: response.data.retailCount || 0,
          wholesale: response.data.wsCount || 0,
          klc: response.data.klcCount || 0,
          total: response.data.totalCount || 0,
          inProgress: response.data.inProgressCount || 0,
          supplier: response.data.supplierCount || 0
        });
      }
      
      // The data is directly in response.data.content
      if (response.data?.content && Array.isArray(response.data.content)) {
        console.log('Content length:', response.data.content.length);
        console.log('Content data:', response.data.content);
        
        response.data.content.forEach((order) => {
          if (order.products && Array.isArray(order.products)) {
            order.products.forEach((product) => {
              let referenceImage = null;
              let actualImage = null;
              let allImages = [];
              
              if (product.images && Array.isArray(product.images)) {
                allImages = product.images;
                product.images.forEach(image => {
                  if (image.referenceImage && !referenceImage) {
                    referenceImage = image.referenceImage;
                  }
                  if (image.actualImage && !actualImage) {
                    actualImage = image.actualImage;
                  }
                });
              }
              
              productsData.push({
                orderNo: order.orderNo,
                orderProductId: product?.orderProductId,
                productId: product?.productId || "N/A",
                productGroup: product?.productGroup || productGroupName,
                category: product?.productCategory || order.orderCategory || "N/A",
                supplier: product?.supplier?.supplierName || "N/A",
                status: order.status || order.orderStatus || "N/A",
                refImage: referenceImage,
                actImage: actualImage,
                allImages: allImages,
                product: product
              });
            });
          }
        });
        totalElements = response.data.totalElements || productsData.length;
      } else {
        console.warn('No content array found in response');
        console.warn('Response structure:', Object.keys(response.data));
      }
      
      // Log the processed products
      console.log('Processed Products:', productsData);
      console.log('Total Elements:', totalElements);
      
      setAllProducts(productsData);
      
      const totalPages = Math.ceil(totalElements / ordersPagination.pageSize);
      const startIndex = (ordersPagination.currentPage - 1) * ordersPagination.pageSize;
      const endIndex = startIndex + ordersPagination.pageSize;
      const paginatedData = productsData.slice(startIndex, endIndex);
      
      setProducts(paginatedData);
      setOrdersPagination({
        ...ordersPagination,
        totalPages: totalPages,
        totalItems: totalElements
      });
      
      const uniqueSuppliers = [...new Set(productsData.map(p => p.supplier).filter(s => s && s !== "N/A"))];
      setSuppliers(uniqueSuppliers);
      setError(productsData.length === 0 ? "No products found in this category" : null);
    } catch (err) {
      console.error("Error fetching product details:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      setError("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (productGroupName) {
    fetchProductDetails();
  }
}, [productGroupName, currentUser]);



  const filteredProductsList = useMemo(() => {
    let filtered = allProducts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    if (selectedSupplier !== 'all') {
      filtered = filtered.filter(p => p.supplier === selectedSupplier);
    }
    
    return filtered;
  }, [allProducts, selectedCategory, selectedSupplier]);

  // Update pagination when filters change
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredProductsList.length / ordersPagination.pageSize) || 1;
    const newCurrentPage = Math.min(ordersPagination.currentPage, newTotalPages);
    
    setOrdersPagination(prev => ({
      ...prev,
      currentPage: newCurrentPage,
      totalPages: newTotalPages,
      totalItems: filteredProductsList.length
    }));
  }, [filteredProductsList.length, ordersPagination.pageSize]);

  // Get current page data for display
  const currentPageProducts = useMemo(() => {
    const startIndex = (ordersPagination.currentPage - 1) * ordersPagination.pageSize;
    const endIndex = startIndex + ordersPagination.pageSize;
    return filteredProductsList.slice(startIndex, endIndex);
  }, [filteredProductsList, ordersPagination.currentPage, ordersPagination.pageSize]);

  const handleOrdersPageChange = (page) => {
    setOrdersPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleInProgressPageChange = (page) => {
    fetchInProgressOrders(page);
  };

  const handleCategoryPageChange = (page) => {
    fetchCategoryOrders(selectedOrderType, page);
  };

  const renderOrdersTable = () => {
    if (currentPageProducts.length === 0 && !error) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-12">
          <p className="text-lg">No products found</p>
          {(selectedCategory !== 'all' || selectedSupplier !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSupplier('all');
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {currentPageProducts.length} of {ordersPagination.totalItems} orders
          {selectedCategory !== 'all' && ` | Category: ${selectedCategory}`}
          {selectedSupplier !== 'all' && ` | Supplier: ${selectedSupplier}`}
        </p>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SNO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ORDER NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT GROUP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">REF IMAGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACT IMAGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ALL IMAGES</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentPageProducts.map((product, idx) => {
                const sno = (ordersPagination.currentPage - 1) * ordersPagination.pageSize + idx + 1;
                const refImageUrl = getImageUrl(product.refImage);
                const actImageUrl = getImageUrl(product.actImage);
                
                return (
                  <tr key={product.orderNo + idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.orderNo}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white break-words">{product.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{product.productGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.category?.toLowerCase() === 'retail' ? 'bg-purple-100 text-purple-800' :
                        product.category?.toLowerCase() === 'wholesale' ? 'bg-blue-100 text-blue-800' :
                        product.category?.toLowerCase() === 'klc' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-start">
                        {refImageUrl ? (
                          <div className="relative group">
                            <img
                              src={refImageUrl}
                              alt="Reference"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(refImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Ref");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Ref</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-start">
                        {actImageUrl ? (
                          <div className="relative group">
                            <img
                              src={actImageUrl}
                              alt="Actual"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(actImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Act");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Act</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewImages(product)}
                        className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        VIEW {product.allImages?.length > 0 && `(${product.allImages.length})`}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <FiEdit
                          size={18}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 cursor-pointer transition-colors duration-200"
                          onClick={(e) => handleUpdate(e, product, product.orderNo)}
                          title="Edit Product"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {ordersPagination.totalPages > 1 && (
          <Pagination
            totalPages={ordersPagination.totalPages}
            currentPage={ordersPagination.currentPage}
            handlePageChange={handleOrdersPageChange}
          />
        )}
      </>
    );
  };

  const renderInProgressTable = () => {
    if (inProgressLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (inProgressError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{inProgressError}</p>
        </div>
      );
    }

    if (inProgressOrders.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-12">
          <p className="text-lg">No in-progress orders found for {productGroupName}</p>
          <button
            onClick={handleBackToMain}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          >
            Back to Orders
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <button
            onClick={handleBackToMain}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </button>
        </div>

        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {inProgressOrders.length} of {inProgressPagination.totalItems} in-progress orders for {productGroupName}
        </p>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SNO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ORDER NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {inProgressOrders.map((order) => (
                <tr key={order.sno} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.sno}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.orderNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.customer !== "No customer" ? order.customer : (
                      <span className="text-gray-400 italic">No customer</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white break-words">{order.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status?.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <FiEdit
                        size={17}
                        className="text-teal-500 hover:text-teal-700 cursor-pointer"
                        onClick={() => {
                          if (order.orderId) {
                            navigate(`/Order/updatepartiallyApproved/${order.orderId}`);
                          } else {
                            toast.error("Order ID not found. Cannot edit this order.");
                          }
                        }}
                        title="Edit Order"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {inProgressPagination.totalPages > 1 && (
          <Pagination
            totalPages={inProgressPagination.totalPages}
            currentPage={inProgressPagination.currentPage}
            handlePageChange={handleInProgressPageChange}
          />
        )}
      </>
    );
  };

  const renderCategoryOrdersTable = () => {
    if (categoryLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (categoryError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{categoryError}</p>
        </div>
      );
    }

    if (categoryOrders.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-12">
          <p className="text-lg">No {getDisplayOrderType(selectedOrderType)} orders found for {productGroupName}</p>
          <button
            onClick={() => setActiveView("orders")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          >
            Back to All Orders
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => setActiveView("orders")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Orders
            </button>
          </div>
          <div className="text-right">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium uppercase">
              {getDisplayOrderType(selectedOrderType)} ORDERS
            </span>
          </div>
        </div>

        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {categoryOrders.length} of {categoryPagination.totalItems} {getDisplayOrderType(selectedOrderType)} orders for {productGroupName}
        </p>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SNO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ORDER NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT GROUP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CATEGORY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">REF IMAGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACT IMAGE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ALL IMAGES</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {categoryOrders.map((order, idx) => {
                const refImageUrl = getImageUrl(order.refImage);
                const actImageUrl = getImageUrl(order.actImage);
                
                return (
                  <tr key={order.orderNo + idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.sno || idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.orderNo}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white break-words">{order.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.productGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.category?.toLowerCase() === 'retail' ? 'bg-purple-100 text-purple-800' :
                        order.category?.toLowerCase() === 'wholesale' ? 'bg-blue-100 text-blue-800' :
                        order.category?.toLowerCase() === 'klc' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-start">
                        {refImageUrl ? (
                          <div className="relative group">
                            <img
                              src={refImageUrl}
                              alt="Reference"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(refImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Ref");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Ref</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-start">
                        {actImageUrl ? (
                          <div className="relative group">
                            <img
                              src={actImageUrl}
                              alt="Actual"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(actImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Act");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Act</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewImages(order)}
                        className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        VIEW {order.allImages?.length > 0 && `(${order.allImages.length})`}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <FiEdit
                          size={18}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 cursor-pointer transition-colors duration-200"
                          onClick={(e) => handleUpdate(e, order, order.orderNo)}
                          title="Edit Product"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {categoryPagination.totalPages > 1 && (
          <Pagination
            totalPages={categoryPagination.totalPages}
            currentPage={categoryPagination.currentPage}
            handlePageChange={handleCategoryPageChange}
          />
        )}
      </>
    );
  };

  const renderSupplierOrdersDetail = () => {
    if (!supplierDetailView) return null;
    
    // Calculate pagination for supplier detail view
    const detailTotalItems = supplierDetailView.orders.length;
    const detailTotalPages = Math.ceil(detailTotalItems / supplierDetailPageSize);
    const detailStartIndex = (supplierDetailCurrentPage - 1) * supplierDetailPageSize;
    const detailEndIndex = detailStartIndex + supplierDetailPageSize;
    const paginatedOrders = supplierDetailView.orders.slice(detailStartIndex, detailEndIndex);
    
    const handleDetailPageChange = (page) => {
      setSupplierDetailCurrentPage(page);
    };

    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToSuppliers}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Suppliers
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Orders for Supplier: {supplierDetailView.name}
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Showing {paginatedOrders.length} of {detailTotalItems} orders for {supplierDetailView.name}
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SNO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ORDER NO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT GROUP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CATEGORY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">REF IMAGE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACT IMAGE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ALL IMAGES</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedOrders.map((order, idx) => {
                  const refImageUrl = getImageUrl(order.refImage);
                  const actImageUrl = getImageUrl(order.actImage);
                  const allImagesCount = order.allImages?.length || 0;
                  const sno = detailStartIndex + idx + 1;
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{sno}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.orderNo}</td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white break-words">{order.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.productGroup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          {order.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {refImageUrl ? (
                          <div className="relative group">
                            <img
                              src={refImageUrl}
                              alt="Reference"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(refImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Ref");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Ref</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {actImageUrl ? (
                          <div className="relative group">
                            <img
                              src={actImageUrl}
                              alt="Actual"
                              className="h-12 w-12 rounded-full object-cover border shadow-sm transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl cursor-pointer"
                              crossOrigin="use-credentials"
                              onClick={() => window.open(actImageUrl, '_blank')}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getPlaceholder("Act");
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full border border-dashed border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Act</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            if (order.allImages && order.allImages.length > 0) {
                              setSelectedProduct(order);
                              setSelectedImages(order.allImages);
                              setShowAllImages(true);
                            }
                          }}
                          className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          VIEW ({allImagesCount})
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <FiEdit
                            size={16}
                            className="text-green-600 hover:text-green-800 cursor-pointer transition-colors duration-200"
                            onClick={(e) => handleUpdate(e, order, order.orderNo)}
                            title="Edit Product"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination for Supplier Detail View */}
          {detailTotalPages > 1 && (
            <div className="mt-4">
              <Pagination
                totalPages={detailTotalPages}
                currentPage={supplierDetailCurrentPage}
                handlePageChange={handleDetailPageChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSuppliersTable = () => {
    if (supplierLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (supplierError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{supplierError}</p>
        </div>
      );
    }

    if (supplierData.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 py-12">
          <p className="text-lg">No supplier orders found for {productGroupName}</p>
          <button
            onClick={() => fetchSuppliers()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {supplierData.length} of {suppliersPagination.totalItems} supplier orders for {productGroupName}
        </p>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SNO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ORDER NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SUPPLIER NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SUPPLIER QTY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CHALLAN NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCT GROUP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {supplierData.map((supplier) => {
                return (
                  <tr key={supplier.sno} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{supplier.sno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{supplier.orderNo}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-white break-words">{supplier.productId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        onClick={() => handleSupplierNameClick(supplier.supplierName)}
                        className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-orange-200 transition-colors inline-block"
                      >
                        {supplier.supplierName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{supplier.supplierQty}</td>
                    
                    {/* CHALLAN NO CELL WITH DROPDOWN */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div
                        className="challan-button-supplier cursor-pointer inline-block"
                        onClick={(e) => openUpdateChallan(e, supplier, supplier.challanNo)}
                      >
                        {supplier.challanNo !== "N/A" ? (
                          <span className="bg-yellow-100 px-3 py-1.5 rounded-md text-gray-800 hover:bg-yellow-200 font-medium transition-colors duration-200">
                            {supplier.challanNo}
                          </span>
                        ) : (
                          <span className="text-blue-600 italic hover:text-blue-800 px-2 py-1 border border-dashed border-gray-300 rounded transition-colors duration-200">
                            Add Challan
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.status?.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                        supplier.status?.toLowerCase() === 'created' ? 'bg-yellow-100 text-yellow-800' :
                        supplier.status?.toLowerCase() === 'pending' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{supplier.productGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-1">
                        <span
                          onClick={() => {
                            const productId = supplier.orderProductId;
                            if (productId) {
                              navigate(`/supplier-product/view/${productId}`);
                            } else {
                              toast.error("Product ID not found");
                            }
                          }}
                          className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded
                         dark:bg-gray-700 dark:text-green-400 border border-green-400
                         cursor-pointer hover:bg-green-200 transition-colors duration-200 view-badge"
                        >
                          VIEW PRODUCT
                        </span>
                        <span
                          onClick={() => {
                            const productId = supplier.orderProductId;
                            if (productId) {
                              navigate(`/UpdateKaniProducts/${productId}`);
                            } else {
                              toast.error("Product ID not found");
                            }
                          }}
                          className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded
                         dark:bg-gray-700 dark:text-green-400 border border-green-400
                         cursor-pointer hover:bg-green-200 transition-colors duration-200 view-badge"
                        >
                          ADD PRODUCT
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination for Suppliers Table */}
        {suppliersPagination.totalPages > 1 && (
          <Pagination
            totalPages={suppliersPagination.totalPages}
            currentPage={suppliersPagination.currentPage}
            handlePageChange={handleSuppliersPageChange}
          />
        )}
        
        {/* Challan Update Dropdown */}
        {openChallanDropdownId && (
          <div
            ref={challanDropdownRef}
            className="fixed z-[9999] w-72 bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700"
            style={{
              top: `${challanDropdownPos.top}px`,
              left: `${challanDropdownPos.left}px`,
              transform: 'translateX(-50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-900 dark:border-gray-700 rounded-t-lg flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Update Challan</h3>
              <button 
                onClick={closeUpdateChallan} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challan Number
                  </label>
                  <input
                    type="text"
                    value={editingChallanNo}
                    onChange={handleChallanInputChange}
                    placeholder="Enter challan number"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdateChallan(openChallanDropdownId)}
                    autoFocus
                  />
                </div>
                
                <button
                  onClick={() => handleUpdateChallan(openChallanDropdownId)}
                  disabled={updateChallanLoading && updatingChallanId === openChallanDropdownId}
                  className="w-full bg-primary hover:bg-opacity-90 text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {updateChallanLoading && updatingChallanId === openChallanDropdownId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : 'Update Challan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderImagesModal = () => {
    if (!showAllImages) return null;

    const referenceImages = selectedImages.filter(img => img?.referenceImage);
    const actualImages = selectedImages.filter(img => img?.actualImage);

    return (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">

    <div className="bg-slate-100 border rounded p-6 shadow-lg w-[90%] max-w-[900px] max-h-[75vh] relative overflow-hidden dark:bg-slate-600">

      {/* Close Button */}
      <div className="absolute top-3 right-4 z-50">
        <button
          onClick={closeModal}
          className="text-red-500 text-3xl font-bold hover:text-red-700"
        >
          &times;
        </button>
      </div>

      {/* Fixed Header */}
      <h2 className="text-2xl text-center mb-4 font-extrabold">
        LIST OF IMAGES - {selectedProduct?.orderNo}
      </h2>

      {/* ONLY THIS PART SCROLLS */}
      <div className="overflow-y-auto max-h-[calc(75vh-80px)] pr-2">

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
            Reference Images ({referenceImages.length})
          </h3>

          <div className="flex flex-wrap gap-4 py-2">
            {referenceImages.map((image, index) => (
              <div key={`ref-${index}`} className="relative group">
                <img
                  className="h-[180px] w-[180px] rounded-lg object-cover border shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
                  crossOrigin="use-credentials"
                  src={getImageUrl(image.referenceImage)}
                  alt={`Reference ${index + 1}`}
                  onClick={() =>
                    window.open(getImageUrl(image.referenceImage), "_blank")
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPlaceholder("Ref");
                  }}
                />

                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-[1px] rounded-sm">
                  Ref {index + 1}
                </div>
              </div>
            ))}

            {referenceImages.length === 0 && (
              <div className="w-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No reference images available
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">
            Actual Images ({actualImages.length})
          </h3>

          <div className="flex flex-wrap gap-4 py-2">
            {actualImages.map((image, index) => (
              <div key={`act-${index}`} className="relative group">
                <img
                  className="h-[180px] w-[180px] rounded-lg object-cover border shadow-md transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
                  crossOrigin="use-credentials"
                  src={getImageUrl(image.actualImage)}
                  alt={`Actual ${index + 1}`}
                  onClick={() =>
                    window.open(getImageUrl(image.actualImage), "_blank")
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPlaceholder("Act");
                  }}
                />

                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-[1px] rounded-sm">
                  Act {index + 1}
                </div>
              </div>
            ))}

            {actualImages.length === 0 && (
              <div className="w-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No actual images available
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Loading..." />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName={`${productGroupName} ${
        activeView === 'orders' ? 'Orders' : 
        activeView === 'inProgress' ? 'In Progress Orders' : 
        activeView === 'category' ? `${getDisplayOrderType(selectedOrderType)} Orders` : 
        'Suppliers'
      }`} />
      
      {renderImagesModal()}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="uppercase font-bold text-2xl leading-tight tracking-[9px] text-gray-800 dark:text-white">
  {productGroupName} {
    activeView === 'orders' ? 'ORDERS' : 
    activeView === 'inProgress' ? 'IN PROGRESS ORDERS' : 
    activeView === 'category' ? `${getDisplayOrderType(selectedOrderType)} ORDERS` : 
    'SUPPLIERS'
  }
</h2>
          <div className="flex gap-3">
            {activeView === 'suppliers' && supplierDetailView && (
              <button
                onClick={handleBackToSuppliers}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Back to Suppliers List
              </button>
            )}
            {activeView === 'suppliers' && !supplierDetailView && (
              <button
                onClick={() => setActiveView('orders')}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Back to Orders
              </button>
            )}
            {(activeView === 'inProgress' || activeView === 'category') && (
              <button
                onClick={handleBackToMain}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Back to Orders
              </button>
            )}
            <button
              onClick={() => navigate('/kaniProducts')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        {/* Search Tabs Label with Total Count */}
<div className="flex justify-between items-center mb-2">
  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
    🔍 Search Tabs - Click any tile below to filter orders by category
  </p>
  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
    Total Count : {categoryCounts.total}
  </span>
</div>
        
        {/* Clean Border Cards - No Colors - Smaller Size */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {/* Retail Card */}
          <div 
            onClick={() => handleCategoryClick('retail')}
            className={`cursor-pointer rounded-lg border transition-all duration-200 p-2 ${
              (selectedCategory === 'retail' && activeView === 'orders') || (activeView === 'category' && selectedOrderType === 'RetailClients') 
                ? 'border-primary ring-2 ring-primary/20 bg-primary/20 dark:bg-primary/30' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-xs uppercase">Retail</p>
                <p className="text-gray-500 dark:text-gray-400 text-[9px] mt-0.5">Clients</p>
                {/* Count Badge */}
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  {categoryCounts.retail}
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          {/* Wholesale Card */}
          <div 
            onClick={() => handleCategoryClick('wholesale')}
            className={`cursor-pointer rounded-lg border transition-all duration-200 p-2 ${
              (selectedCategory === 'wholesale' && activeView === 'orders') || (activeView === 'category' && selectedOrderType === 'WSClients') 
                ? 'border-primary ring-2 ring-primary/20 bg-primary/20 dark:bg-primary/30' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-xs uppercase">Wholesale</p>
                <p className="text-gray-500 dark:text-gray-400 text-[9px] mt-0.5">Clients</p>
                {/* Count Badge */}
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {categoryCounts.wholesale}
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
              </svg>
            </div>
          </div>

          {/* KLC Card */}
          <div 
            onClick={() => handleCategoryClick('klc')}
            className={`cursor-pointer rounded-lg border transition-all duration-200 p-2 ${
              (selectedCategory === 'klc' && activeView === 'orders') || (activeView === 'category' && selectedOrderType === 'KLCStock') 
                ? 'border-primary ring-2 ring-primary/20 bg-primary/20 dark:bg-primary/30' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-xs uppercase">KLC</p>
                <p className="text-gray-500 dark:text-gray-400 text-[9px] mt-0.5">Stock</p>
                {/* Count Badge */}
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  {categoryCounts.klc}
                </span>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

         {/* In Progress Card */}
<div 
  onClick={handleInProgressClick}
  className={`cursor-pointer rounded-lg border transition-all duration-200 p-2 ${
    activeView === 'inProgress' 
      ? 'border-primary ring-2 ring-primary/20 bg-primary/20 dark:bg-primary/30' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
  }`}
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-900 dark:text-white font-bold text-xs uppercase">In Progress</p>
      <p className="text-gray-500 dark:text-gray-400 text-[9px] mt-0.5">Orders</p>
      {/* Always show the badge, even when count is 0 */}
      <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full min-w-[20px] text-center">
        {categoryCounts.inProgress !== undefined ? categoryCounts.inProgress : 0}
      </span>
    </div>
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
</div>

{/* Suppliers Card */}
<div 
  onClick={handleSupplierClick}
  className={`cursor-pointer rounded-lg border transition-all duration-200 p-2 ${
    activeView === 'suppliers' 
      ? 'border-primary ring-2 ring-primary/20 bg-primary/20 dark:bg-primary/30' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
  }`}
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-900 dark:text-white font-bold text-xs uppercase">Suppliers</p>
      <p className="text-gray-500 dark:text-gray-400 text-[9px] mt-0.5">Filter View</p>
      {/* Always show the badge, even when count is 0 */}
      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full min-w-[20px] text-center">
        {categoryCounts.supplier !== undefined ? categoryCounts.supplier : 0}
      </span>
    </div>
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  </div>
</div>
        </div>

        {activeView === 'orders' && (selectedCategory !== 'all' || selectedSupplier !== 'all') && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSupplier('all');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        )}
        
        {error && activeView === 'orders' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        
        {activeView === 'orders' 
          ? renderOrdersTable() 
          : activeView === 'inProgress'
            ? renderInProgressTable()
            : activeView === 'category'
              ? renderCategoryOrdersTable()
              : supplierDetailView 
                ? renderSupplierOrdersDetail() 
                : renderSuppliersTable()
        }
      </div>
    </DefaultLayout>
  );
};

export default ProductGroupDetails;