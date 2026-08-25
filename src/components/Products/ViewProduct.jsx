import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import useProduct from '../../hooks/useProduct';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../Pagination/Pagination';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import {
  GET_IMAGE,
  GET_INVENTORYLOCATION,
  UPDATE_PRODUCTIMAGE_URL,
  UPDATE_PRODUCT_URL,
  customStyles as createCustomStyles,
} from '../../Constants/utils';
import { Field, Form, Formik } from 'formik';
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewProduct = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const referenceImages = [];
  const [uploadType, setUploadType] = useState('referenceImages');
  const actualImages = [];

  const theme = useSelector((state) => state?.persisted?.theme);
  const {
    Product,
    handleDelete,
    handleUpdate,
    handlePageChange,
    pagination,
    getProduct,
    productId,
    getProductId,
    getBOMData,
  } = useProduct({ referenceImages, actualImages });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagesModalOpen, setisImagesModalOpen] = useState(false);
  const [Images, setImages] = useState(null);
  const [selectedBOMData, setSelectedBOMData] = useState(null);
  const [isINVENTORYModalOpen, setIsINVENTORYModalOpen] = useState(false);
  const [selectedINVENTORYData, setSelectedINVENTORYData] = useState(null);
  const [mrp, setmrp] = useState(0);

  // Image upload states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Use object ref instead of single ref
  const fileInputRefs = useRef({});

  useEffect(() => {
    getProduct();
    getProductId();
  }, []);

  const formattedProductId = productId.map((id) => ({
    label: id,
    value: id,
  }));

  const optionsForImage = [
    {
      label: 'true',
      value: 'true',
    },
    {
      label: 'false',
      value: 'false',
    },
  ];

  const customStyles = createCustomStyles(theme?.mode);

  const openBOMModal = (bomData) => {
    setSelectedBOMData(bomData);
    setIsModalOpen(true);
  };

  const openImageModal = (Images) => {
    console.log('image modeel before');
    setisImagesModalOpen(true);
    console.log(isImagesModalOpen, 'afterimage');
    setImages(Images);
  };

  const closeBOMModal = () => {
    setIsModalOpen(false);
    setSelectedBOMData(null);
  };

  const openINVENTORYModal = (id) => {
    const getInventory = async () => {
      try {
        const response = await fetch(`${GET_INVENTORYLOCATION}/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSelectedINVENTORYData(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Product');
      }
    };
    getInventory();
    setmrp(mrp);
    setIsINVENTORYModalOpen(true);
  };

  const closeINVENTORYModal = () => {
    setIsINVENTORYModalOpen(false);
    setSelectedINVENTORYData(null);
  };

  // Handle file selection
  const handleFileSelect = (e, id, type) => {
    console.log('Selected ID:', id);
    console.log('Type:', type);

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setCurrentProductId(id);
    setUploadType(type);
    setSelectedFiles(
      files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    );
    setUploadModalOpen(true);
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!currentProductId || selectedFiles.length === 0) return;
    console.log('Uploading for product ID:', currentProductId);

    setUploading(true);
    const toastId = toast.loading(
      `Uploading ${selectedFiles.length} ${uploadType} images...`,
    );

    try {
      const formData = new FormData();
      const fieldName =
        uploadType === 'referenceImages' ? 'referenceImages' : 'actualImages';

      selectedFiles.forEach((fileObj) => {
        if (!(fileObj.file instanceof File)) {
          throw new Error('Invalid file object');
        }
        formData.append(fieldName, fileObj.file);
      });

      const response = await fetch(
        `${UPDATE_PRODUCTIMAGE_URL}/${currentProductId}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      toast.success(
        `${selectedFiles.length} ${uploadType} images uploaded successfully!`,
      );
      getProduct(); // Refresh the product list
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.message || `Failed to upload ${uploadType} images`);
    } finally {
      setUploadModalOpen(false);
      setSelectedFiles([]);
      setCurrentProductId(null);
      setUploading(false);
      toast.dismiss(toastId);
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach((fileObj) => URL.revokeObjectURL(fileObj.preview));
    };
  }, [selectedFiles]);

  const renderTableRows = () => {
    if (!Product || !Product.length) {
      return (
        <tr className="bg-white dark:bg-slate-700 dark:text-white">
          <td
            colSpan="10"
            className="px-5 py-5 border-b border-gray-200 text-sm"
          >
            <p className="text-gray-900 whitespace-no-wrap text-center">
              No Products Found
            </p>
          </td>
        </tr>
      );
    }

    const startingSerialNumber =
      (pagination.currentPage - 1) * pagination.itemsPerPage + 1;

    const handleUpdateBom = (id) => {
      navigate(`/product/updateBom/${id}`);
    };

    const handleUpdateInventory = (id) => {
      navigate(`/product/updateInventory/${id}`);
    };

    return Product.map((item, index) => (
      <tr key={item.id} className="bg-white dark:bg-slate-700 dark:text-white">
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {startingSerialNumber + index}
          </p>
        </td>

        {/* Reference Image Column */}
        <td className="px-1 py-5 border-b border-gray-200 text-sm">
          <div className="relative group">
            {item?.images?.find((img) => img.referenceImage) ? (
              <img
                className="h-[50px] w-[50px] rounded-full transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                crossOrigin="use-credentials"
                src={`${GET_IMAGE}/products/getimages/${
                  item?.images?.find((img) => img.referenceImage).referenceImage
                }`}
                alt="Product Image"
              />
            ) : (
              <>
                <div
                  className="h-[50px] w-[50px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    fileInputRefs.current[`ref_${item.id}`]?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <input
                  ref={(el) => (fileInputRefs.current[`ref_${item.id}`] = el)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileSelect(e, item.id, 'referenceImages')
                  }
                  multiple
                />
              </>
            )}
          </div>
        </td>

        {/* Actual Image Column */}
        <td className="px-1 py-5 border-b border-gray-200 text-sm">
          <div className="relative group">
            {item?.images?.find((img) => img?.actualImage) ? (
              <img
                className="h-[50px] w-[50px] rounded-full transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                crossOrigin="use-credentials"
                src={`${GET_IMAGE}/products/getimages/${
                  item.images.find((img) => img?.actualImage)?.actualImage
                }`}
                alt="Product Actual Image"
              />
            ) : (
              <>
                <div
                  className="h-[50px] w-[50px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    fileInputRefs.current[`actual_${item.id}`]?.click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <input
                  ref={(el) =>
                    (fileInputRefs.current[`actual_${item.id}`] = el)
                  }
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, item.id, 'actualImages')}
                  multiple
                />
              </>
            )}
          </div>
        </td>

        {/* View Images Button */}
        {/* <td className="px-2 py-5 md:w-[50px] border-b border-gray-200 font-xs text-xs">
          <span
            onClick={() => openImageModal(item?.images)}
            className="bg-green-100 text-green-800 font-xs text-xs me-2 px-1 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer"
          >
            VIEW
          </span>
        </td> */}

        <td className="px-3 py-4 md:w-[90px] border-b border-gray-200">
          <button
            onClick={() => openImageModal(item?.images)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
               text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md
               hover:bg-emerald-100 hover:border-emerald-300
               focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
               transition-all duration-200
               dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700
               dark:hover:bg-emerald-900/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </button>
        </td>

        {/* Product ID */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item?.productId?.substring(0, 34) + '..'}
          </p>
        </td>

        {/* Product Group */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.productGroup?.productGroupName?.substring(0, 40)}
          </p>
        </td>

        {/* Category */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {item.productCategory?.productCategoryName?.substring(0, 50)}
          </p>
        </td>

        {/* BOM Section */}
        {item?.bom ? (
          <td className="py-5 border-b border-gray-200 text-sm">
            <div className="flex flex-col gap-2">
              <span
                onClick={() => openBOMModal(item.bom)}
                className="bg-green-100 text-green-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-green-400 border border-green-400 cursor-pointer w-[100px]"
              >
                VIEW BOM
              </span>
              <span
                onClick={() => handleUpdateBom(item?.bom?.id)}
                className="bg-red-100 text-red-800 text-[10px] font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 text-center dark:text-red-400 border border-red-400 cursor-pointer w-[100px]"
              >
                UPDATE BOM
              </span>
            </div>
          </td>
        ) : (
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <IoIosAdd
              size={30}
              onClick={() => navigate(`/product/addBom/${item.id}`)}
            />
          </td>
        )}

        {/* Inventory Section */}
        {item?.inventoryStatus ? (
          <td className="py-5 border-b border-gray-200 text-sm">
            <div className="flex flex-col gap-2 mx-3">
              <span
                onClick={() => openINVENTORYModal(item.id)}
                className="view-badge bg-green-100 text-green-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-pointer w-[110px]"
              >
                VIEW INVENTORY
              </span>
              <span
                onClick={() => handleUpdateInventory(item?.id)}
                className="view-badge bg-red-100 text-red-800 text-[10px] font-medium me-2 text-center py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 cursor-pointer w-[110px]"
              >
                UPDATE INVENTORY
              </span>
            </div>
          </td>
        ) : (
          <td className="px-5 py-5 border-b border-gray-200 text-sm">
            <IoIosAdd
              size={30}
              onClick={() =>
                navigate(`/product/addInventoryLocation/${item.id}`)
              }
            />
          </td>
        )}

        {/* Actions */}
        <td className="px-5 py-5 border-b border-gray-200 text-sm">
          <p className="flex text-gray-900 whitespace-no-wrap">
            <FiEdit
              size={17}
              className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
              onClick={(e) => handleUpdate(e, item)}
              title="Edit Product"
            />
            <FiTrash2
              size={17}
              className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
              onClick={(e) => handleDelete(e, item?.id)}
              title="Delete Product"
            />
          </p>
        </td>
      </tr>
    ));
  };

  const handleSubmit = (values) => {
    const filters = {
      productId: values.ProductId || undefined,
      hasActualImage: values.hasActualImage,
      hasReferenceImage: values.hasReferenceImage,
      searchText: values.searchText,
    };
    getProduct(pagination.currentPage, filters);
  };

  const renderUploadModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
      <div className="bg-slate-100 dark:bg-slate-600 border border-b-1 rounded p-6 shadow-lg w-[900px] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold">
            Upload Images ({selectedFiles.length} selected)
          </h2>
          <button
            onClick={() => {
              setUploadModalOpen(false);
              setSelectedFiles([]);
            }}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {selectedFiles.map((fileObj, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden group"
            >
              <img
                src={fileObj.preview}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedFiles = [...selectedFiles];
                  updatedFiles.splice(index, 1);
                  setSelectedFiles(updatedFiles);
                  URL.revokeObjectURL(fileObj.preview);
                }}
                className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setUploadModalOpen(false);
              setSelectedFiles([]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-slate-500 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleImageUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center transition-colors"
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} Images`
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products/ View Products" />
      <div className="container mx-auto px-4 sm:px-8 bg-white dark:bg-slate-800">
        <div className="pt-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
              <span>View Products</span>
              <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                TOTAL PRODUCTS: {pagination.totalItems}
              </span>
            </h2>
          </div>

          {/* BOM Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
              <div className="bg-slate-100 dark:bg-slate-500 border border-b-1 rounded p-6 shadow-lg md:ml-[100px] w-[350px] md:w-[700px] md:h-[400px] mt-[50px]">
                <div className="text-right">
                  <button
                    onClick={closeBOMModal}
                    className="text-red-500 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>
                <h2 className="text-2xl text-center mb-4 font-extrabold">
                  BOM Details
                </h2>
                <div className="md:inline-block md:min-w-full overflow-scroll w-[320px] shadow-md rounded-lg md:overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                        <th
                          className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          style={{ minWidth: '250px' }}
                        >
                          PRODUCT LIST
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          UNIT OF MEASURE
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          QUANTITY
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBOMData?.productMaterials?.map((row) => (
                        <tr key={row.id}>
                          <td className="px-2 py-2 border-b dark:text-white">
                            <p>{row?.products?.productDescription}</p>
                          </td>
                          <td className="px-2 py-2 border-b dark:text-white">
                            {row.unitOfMeasurement}
                          </td>
                          <td className="px-2 py-2 border-b dark:text-white">
                            {row.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Images Modal */}
          {isImagesModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50">
              {/* Modal Box */}
              <div className="relative bg-slate-100 dark:bg-slate-600 border rounded-lg shadow-lg w-[670px] h-[420px] mt-[60px] flex flex-col">
                {/* Fixed Close Button (top-right) */}
                <button
                  onClick={() => setisImagesModalOpen(false)}
                  className="absolute top-3 right-4 z-20 text-red-500 hover:text-red-700 text-4xl font-bold leading-none"
                >
                  &times;
                </button>

                {/* Fixed Title */}
                <h2 className="text-2xl text-center pt-5 pb-3 font-extrabold">
                  LIST OF IMAGES
                </h2>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {/* Reference Images Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Reference Images
                    </h3>
                    <div className="flex overflow-x-auto space-x-4 py-2">
                      {Images?.map((image, index) => {
                        if (image?.referenceImage) {
                          return (
                            <img
                              key={index}
                              className="h-[200px] w-[200px] rounded-lg object-cover flex-shrink-0 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                              crossOrigin="use-credentials"
                              src={`${GET_IMAGE}/products/getimages/${image.referenceImage}`}
                              alt="Reference Image"
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>

                  {/* Actual Images Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Actual Images
                    </h3>
                    <div className="flex overflow-x-auto space-x-4 py-2">
                      {Images?.map((image, index) => {
                        if (image?.actualImage) {
                          return (
                            <img
                              key={index}
                              className="h-[200px] w-[200px] rounded-lg object-cover flex-shrink-0 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                              crossOrigin="use-credentials"
                              src={`${GET_IMAGE}/products/getimages/${image.actualImage}`}
                              alt="Actual Image"
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {uploadModalOpen && renderUploadModal()}

          {/* Inventory Modal */}
          {isINVENTORYModalOpen && (
            <div className="min-w-[500px] fixed inset-0 bg-gray-500 bg-opacity-95 flex justify-center items-center z-50 overflow-scroll">
              <div className="min-w-[800px] bg-slate-100 border border-b-1 rounded p-6 shadow-lg ml-[100px] w-[70px] h-[400px] mt-[60px] dark:bg-slate-600 overflow-scroll">
                <div className="text-right">
                  <button
                    onClick={closeINVENTORYModal}
                    className="text-red-500 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>
                <h2 className="text-2xl text-center mb-4 font-extrabold">
                  INVENTORY DETAILS
                </h2>
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-auto">
                  <table className="min-w-full leading-normal overflow-auto">
                    <thead>
                      <tr className="px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white">
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          LOCATION
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          OPENING BALANCE
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedINVENTORYData && (
                        <>
                          {selectedINVENTORYData.map((row) => (
                            <tr key={row.id}>
                              <td className="px-2 py-2 border-b dark:text-white">
                                <p>{row?.location?.address}</p>
                              </td>
                              <td className="px-2 py-2 border-b dark:text-white">
                                <p>{row?.openingBalance}</p>
                              </td>
                              <td className="px-2 py-2 border-b dark:text-white">
                                {row.rate}
                              </td>
                              <td className="px-2 py-2 border-b dark:text-white">
                                {row.value}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              className="px-2 py-2 border-t font-bold text-black dark:text-white"
                              colSpan={3}
                            >
                              Total Values
                            </td>
                            <td className="px-2 py-2 border-t font-bold text-black dark:text-white">
                              {selectedINVENTORYData
                                .reduce(
                                  (total, currentRow) =>
                                    total + (currentRow.value || 0),
                                  0,
                                )
                                .toFixed(2)}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Search Form */}
          <div className="items-center justify-center">
            <Formik
              initialValues={{
                ProductId: '',
                hasActualImage: '',
                searchText: '',
                hasReferenceImage: '',
              }}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Product Id
                      </label>
                      <Field
                        name="ProductId"
                        component={ReactSelect}
                        options={[
                          { label: 'View All Products', value: null },
                          ...formattedProductId,
                        ]}
                        styles={customStyles}
                        placeholder="Select Product Id"
                        value={formattedProductId.find(
                          (option) => option.value === values.ProductId,
                        )}
                        onChange={(option) =>
                          setFieldValue('ProductId', option ? option.value : '')
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Has Reference Image
                      </label>
                      <Field
                        name="hasReferenceImage"
                        component={ReactSelect}
                        options={[
                          { label: 'Select', value: null },
                          ...optionsForImage,
                        ]}
                        styles={customStyles}
                        placeholder="Select Has Reference Image"
                        value={optionsForImage.find(
                          (option) => option.value === values.hasReferenceImage,
                        )}
                        onChange={(option) =>
                          setFieldValue(
                            'hasReferenceImage',
                            option ? option.value : '',
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-wrap gap-6 mt-12">
                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Has Actual Image
                      </label>
                      <Field
                        name="hasActualImage"
                        component={ReactSelect}
                        options={[
                          { label: 'Select', value: null },
                          ...optionsForImage,
                        ]}
                        styles={customStyles}
                        placeholder="Select Has Actual Image"
                        value={optionsForImage.find(
                          (option) => option.value === values.hasActualImage,
                        )}
                        onChange={(option) =>
                          setFieldValue(
                            'hasActualImage',
                            option ? option.value : '',
                          )
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-[300px]">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Description/Barcode/Alias
                      </label>
                      <Field
                        name="searchText"
                        type="text"
                        placeholder="Search Description/Barcode/Alias"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
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

          {/* Products Table */}
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-slate-300 dark:bg-slate-700 dark:text-white">
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SNO
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      REF IMAGE
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ACT IMAGE
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider md:w-[500px]">
                      View Images
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      PRODUCT ID
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      PRODUCT GROUP
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      CATEGORY
                    </th>
                    <th className="px-2 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[600px] md:w-[120px]">
                      BOM
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      INVENTORY
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

export default ViewProduct;
