import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import { ADD_STOCKJOURNELL_URL, ADD_STOCKJOURNEL_URL, GET_QUANTITY, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../Constants/utils';
import useorder from '../../hooks/useOrder';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaExchangeAlt } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import useVoucher from '../../hooks/useVoucher';

const AddStockJournels = () => {
  const { id } = useParams();

  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { token } = currentUser;
  const units = useSelector(state => state?.nonPersisted?.unit);

  const [isLoading, setIsLoading] = useState(false);
  const [prodIdOptions, setProdIdOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [sourceQuantity, setSourceQuantity] = useState("");
  const [voucherNo, setVoucherNo] = useState('');
  const [sourceProduct, setSourceProduct] = useState(null);
  const [sourceLocation, setSourceLocation] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [totalTransferredQty, setTotalTransferredQty] = useState(0);

  const theme = useSelector(state => state?.persisted?.theme);
  const customStyles = createCustomStyles(theme?.mode);
  const { getprodId, productId, getLocation, Location } = useorder();
  const { GetVoucherById, Vouchers } = useVoucher();

  useEffect(() => {
    const fetchVoucher = async () => {
      setIsLoading(true);
      await GetVoucherById(id);
      setIsLoading(false);
    };
    fetchVoucher();
  }, [id]);

  // Fetch voucher number
  const getVoucherNumber = async () => {
    if (!Vouchers?.id) return;

    try {
      const response = await fetch(`${GET_VoucherNos_URL}/${Vouchers.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVoucherNo(data.nextReceipt);
        return data.nextReceipt;
      } else {
        toast.error(data.errorMessage || "Error fetching voucher number");
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching voucher number");
      return null;
    }
  };

  useEffect(() => {
    if (Vouchers && Vouchers.id) {
      getVoucherNumber();
    }
  }, [Vouchers]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getprodId();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (Location) {
      const formattedOptions = Location.map(location => ({
        value: location?.id,
        label: `${location?.state} (${location.address})`,
        LocationObject: location,
        LocationId: { id: location.id },
      }));
      setSelectedLocation(formattedOptions);
    }
  }, [Location]);

  useEffect(() => {
    if (productId) {
      const formattedProdIdOptions = productId?.map(prodId => ({
        value: prodId.id,
        label: prodId?.productId,
        prodIdObject: prodId,
        prodId: prodId.id,
        cost: prodId?.cost || 0
      }));
      setProdIdOptions(formattedProdIdOptions);
    }
  }, [productId]);

  const [destinationRows, setDestinationRows] = useState([{
    id: uuidv4(),
    destProductId: "",
    destinationLocation: "",
    transferQuantity: "",
    embroideryCost: 0,
    dyeingCost: 0,
    tailoringCost: 0,
    otherCost: 0
  }]);

  const addDestinationRow = () => {
    setDestinationRows([...destinationRows, {
      id: uuidv4(),
      destProductId: "",
      destinationLocation: "",
      transferQuantity: "",
      embroideryCost: 0,
      dyeingCost: 0,
      tailoringCost: 0,
      otherCost: 0
    }]);
  };

  const duplicateDestinationRow = (index) => {
    const rowToDuplicate = destinationRows[index];
    setDestinationRows([...destinationRows, {
      ...rowToDuplicate,
      id: uuidv4()
    }]);
  };

  const removeDestinationRow = (id) => {
    if (destinationRows.length > 1) {
      setDestinationRows(destinationRows.filter(row => row.id !== id));
    } else {
      toast.error("At least one destination row is required");
    }
  };

  const validationSchema = Yup.object({
    voucherNo: Yup.string().required('Voucher Number is required'),
    // sourceProduct: Yup.object().required('Source Product is required'),
    // sourceLocation: Yup.object().required('Source Location is required'),
    // sourceQuantity: Yup.number()
    //   .required('Quantity used is required')
    //   .min(1, 'Quantity used must be at least 1')
    //   .max(Yup.ref('availableQuantity'), 'Quantity used cannot exceed available quantity'),
    destinationRows: Yup.array().of(
      Yup.object().shape({
        destProductId: Yup.object().required('Destination Product is required'),
        destinationLocation: Yup.object().required('Destination Location is required'),
        transferQuantity: Yup.number()
          .required('Transfer quantity is required')
          .min(1, 'Transfer quantity must be at least 1')
      })
    )
  });

  const fetchQuantityForSource = async (productId, locationId) => {
    if (!productId || !locationId) return;

    try {
      const response = await fetch(GET_QUANTITY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          locationId: locationId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAvailableQuantity(data.closingBalance);
      } else {
        toast.error(data.errorMessage || "Failed to fetch quantity");
      }
    } catch (error) {
      console.error("Error fetching quantity:", error);
      toast.error("An error occurred while fetching quantity");
    }
  };

  // Calculate total transferred quantity (sum of all destination quantities)
  useEffect(() => {
    const total = destinationRows.reduce((sum, row) => {
      return sum + (Number(row.transferQuantity) || 0);
    }, 0);
    setTotalTransferredQty(total);
  }, [destinationRows]);

  // Calculate source amount based on source quantity (not total transferred)
  const calculateSourceAmount = () => {
    const cost = sourceProduct?.cost || 0;
    const qty = Number(sourceQuantity) || 0;
    return Number((cost * qty).toFixed(2));
  };

  const calculateDestinationAmount = (row) => {
    const cost = sourceProduct?.cost || 0;
    const transferQty = Number(row.transferQuantity) || 0;
    const embroideryCost = Number(row.embroideryCost) || 0;
    const dyeingCost = Number(row.dyeingCost) || 0;
    const tailoringCost = Number(row.tailoringCost) || 0;
    const otherCost = Number(row.otherCost) || 0;

    const totalAdditionalCost = embroideryCost + dyeingCost + tailoringCost + otherCost;
    return Number(((cost * transferQty) + totalAdditionalCost).toFixed(2));
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("immmm");
    
    // Validate total transfer quantity doesn't exceed source quantity
    if (totalTransferredQty > Number(values.sourceQuantity)) {
      toast.error(`Total transfer quantity (${totalTransferredQty}) exceeds source quantity (${values.sourceQuantity})`);
      setSubmitting(false);
      return;
    }

    // Validate that quantity used is provided and valid
    if (!values.sourceQuantity || values.sourceQuantity <= 0) {
      toast.error("Please enter quantity used");
      setSubmitting(false);
      return;
    }

    // Validate that quantity used doesn't exceed available quantity
    if (Number(values.sourceQuantity) > availableQuantity) {
      toast.error(`Quantity used (${values.sourceQuantity}) exceeds available quantity (${availableQuantity})`);
      setSubmitting(false);
      return;
    }

    const formValues = {
      stockVoucherNo: values?.voucherNo,
     
        fromProductId: sourceProduct?.value,
        fromLocationId: sourceLocation?.value,
        fromQty: Number(values.sourceQuantity),
        // availableQuantity: availableQuantity,
        fromValue: calculateSourceAmount(),
        voucherId:id,
    
      toStockVoucher: destinationRows.map((row) => ({
        toProductId: row.destProductId?.value,
        toLocationId: row.destinationLocation?.value,
        toQty: Number(row.transferQuantity),
        toValue: calculateDestinationAmount(row),
        // costs: {
        //   embroidery: Number(row.embroideryCost) || 0,
        //   dyeing: Number(row.dyeingCost) || 0,
        //   tailoring: Number(row.tailoringCost) || 0,
        //   other: Number(row.otherCost) || 0
        // },
        // totalAdditionalCost: (
        //   (Number(row.embroideryCost) || 0) +
        //   (Number(row.dyeingCost) || 0) +
        //   (Number(row.tailoringCost) || 0) +
        //   (Number(row.otherCost) || 0)
        // ).toFixed(2)
      }))
    };

    console.log("Form Values:", formValues);

    try {
      const url = `${ADD_STOCKJOURNELL_URL}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Stock Journal created successfully`);
        navigate("/chart")
        // await getVoucherNumber();
        // setSourceProduct(null);
        // setSourceLocation(null);
        // setAvailableQuantity(0);
        // setSourceQuantity("");
        // setDestinationRows([{
        //   id: uuidv4(),
        //   destProductId: "",
        //   destinationLocation: "",
        //   transferQuantity: "",
        //   embroideryCost: 0,
        //   dyeingCost: 0,
        //   tailoringCost: 0,
        //   otherCost: 0
        // }]);
        // resetForm();
      } else {
        toast.error(`${data.errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={"Stock Journal / Add Stock Journal"} />
      <div className="p-4">
        <Formik
          initialValues={{
            voucherNo: voucherNo,
            sourceProduct: sourceProduct,
            sourceLocation: sourceLocation,
            sourceQuantity: sourceQuantity,
            destinationRows: destinationRows
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              {/* Header Card */}
           
                
                  {/* <div className="flex items-center gap-4">
                    <div className="p-3 text-black rounded-xl shadow">
                      <FaExchangeAlt className="w-6 h-6 text-black dark:text-white" />
                    </div>
                    <div>
                      <h2 className="text-md font-xs font-bold text-black dark:text-white bg-clip-text">
                        Create Stock Journal
                      </h2>
                    </div>
                  </div> */}
                     <div className='flex flex-row items-center justify-between w-full'>
                        <h2 className="text-xl text-slate-500 font-semibold w-full flex items-center justify-between">
                          <FaExchangeAlt className="w-6 h-6 text-black dark:text-white" />
                            <span>  Create Stock Journal</span>
                            <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm font-semibold text-blue-700 dark:text-blue-300 ml-4">
                                {/* Count: {pagination.totalItems} */}
                            </span>
                        </h2>
                    </div>

                 
              
              

              {/* Main Table - Source and Destination Side by Side */}
              <div className=" ml-[-30px] mr-[-20px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                   
                     <div className="w-full md:w-auto">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Voucher Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        name="voucherNo"
                        type="text"
                      
                        className="w-full md:w-64 pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 "
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-400">#</span>
                      </div>
                    </div>
                    <ErrorMessage name="voucherNo" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Stock Transfer Details
                    </h3>
                    <button
                      type="button"
                      onClick={addDestinationRow}
                      disabled={!sourceProduct || !sourceLocation}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Destination
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <th colSpan="4" className="py-4 px-4 text-center text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-r">
                          SOURCE
                        </th>
                        <th colSpan="5" className="py-4 px-4 text-center text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                          DESTINATION
                        </th>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        {/* Source Headers */}
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Product
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Location
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                           Qty  (Avail.={availableQuantity})
                        </th>
                         {/* <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Used. Qty
                        </th> */}
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase border-r">
                          Value (Qty×Cost)
                        </th>
                        
                        {/* Destination Headers */}
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Product
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Location
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Qty
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Value
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {destinationRows.map((row, index) => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                          {/* Source Fields (only show for first row) */}
                          {index === 0 ? (
                            <>
                              <td className="py-4 px-4" rowSpan={destinationRows.length}>
                                <div className="w-48">
                                  <ReactSelect
                                    name="sourceProduct"
                                    value={sourceProduct}
                                    onChange={(option) => {
                                      setSourceProduct(option);
                                      setFieldValue('sourceProduct', option);
                                      if (option?.value && sourceLocation?.value) {
                                        fetchQuantityForSource(option.value, sourceLocation.value);
                                      }
                                    }}
                                    options={prodIdOptions}
                                    styles={customStyles}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Select"
                                    isClearable
                                  />
                                  <ErrorMessage name="sourceProduct" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </td>
                              <td className="py-4 px-4" rowSpan={destinationRows.length}>
                                <div className="w-48">
                                  <ReactSelect
                                    name="sourceLocation"
                                    value={sourceLocation}
                                    onChange={(option) => {
                                      setSourceLocation(option);
                                      setFieldValue('sourceLocation', option);
                                      if (sourceProduct?.value && option?.value) {
                                        fetchQuantityForSource(sourceProduct.value, option.value);
                                      }
                                    }}
                                    options={selectedLocation}
                                    styles={customStyles}
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    placeholder="Select"
                                    isClearable
                                  />
                                  <ErrorMessage name="sourceLocation" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </td>
                              
                                 {/* <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Available: {availableQuantity}
                                  </div> */}
                            
                              <td className="py-4 px-4" rowSpan={destinationRows.length}>
                                <div>
                                 
                                  <Field
                                    name="sourceQuantity"
                                    type="number"
                                    min="1"
                                    max={availableQuantity}
                                    placeholder=" Qty"
                                    className="w-[90px] px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-center"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setFieldValue("sourceQuantity", value);
                                      setSourceQuantity(value);
                                    }}
                                    value={values.sourceQuantity || ""}
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-4 border-r" rowSpan={destinationRows.length}>
                                <div className="w-24 font-medium text-blue-600 dark:text-blue-400">
                                  ₹{calculateSourceAmount()}
                                </div>
                              </td>
                            </>
                          ) : null}

                          {/* Destination Fields */}
                          <td className="py-4 px-4">
                            <div className="w-48">
                              <ReactSelect
                                name={`destinationRows.${index}.destProductId`}
                                value={prodIdOptions.find(option =>
                                  option.value === values.destinationRows[index]?.destProductId?.value
                                )}
                                onChange={(option) => {
                                  setFieldValue(`destinationRows.${index}.destProductId`, option);
                                  const updatedRows = [...destinationRows];
                                  updatedRows[index].destProductId = option;
                                  setDestinationRows(updatedRows);
                                }}
                                options={prodIdOptions}
                                styles={customStyles}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                placeholder="Select"
                                isClearable
                                isDisabled={!sourceProduct}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-48">
                              <ReactSelect
                                name={`destinationRows.${index}.destinationLocation`}
                                value={selectedLocation.find(option =>
                                  option.value === values.destinationRows[index]?.destinationLocation?.value
                                )}
                                onChange={(option) => {
                                  setFieldValue(`destinationRows.${index}.destinationLocation`, option);
                                  const updatedRows = [...destinationRows];
                                  updatedRows[index].destinationLocation = option;
                                  setDestinationRows(updatedRows);
                                }}
                                options={selectedLocation}
                                styles={customStyles}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                placeholder="Select"
                                isClearable
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-20">
                              <Field
                                name={`destinationRows.${index}.transferQuantity`}
                                type="number"
                                min="1"
                                placeholder="Qty"
                                className="w-full px-2 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-center"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setFieldValue(`destinationRows.${index}.transferQuantity`, value);
                                  const updatedRows = [...destinationRows];
                                  updatedRows[index].transferQuantity = value;
                                  setDestinationRows(updatedRows);
                                }}
                                value={values.destinationRows[index]?.transferQuantity || ""}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-24 font-medium text-green-600 dark:text-green-400">
                              ₹{calculateDestinationAmount(row)}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => duplicateDestinationRow(index)}
                                className="p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 rounded-lg"
                                title="Duplicate"
                              >
                                <MdContentCopy className="w-4 h-4" />
                              </button>
                              {destinationRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDestinationRow(row.id)}
                                  className="p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 rounded-lg"
                                  title="Delete"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                    {/* Table Footer with Totals */}
                    <tfoot className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                      <tr>
                        <td colSpan="3" className="py-4 px-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                          Source Total:
                        </td>
                        <td className="py-4 px-4 border-r font-bold text-blue-600 dark:text-blue-400">
                          ₹{calculateSourceAmount()}
                        </td>
                        <td colSpan="3" className="py-4 px-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                          Destination Total:
                        </td>
                        <td className="py-4 px-4 font-bold text-green-600 dark:text-green-400">
                          ₹{destinationRows.reduce((sum, row) => sum + (Number(calculateDestinationAmount(row)) || 0), 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4"></td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="py-2 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                          Source Qty:
                        </td>
                        <td className="py-2 px-4 border-r font-medium text-blue-600 dark:text-blue-400">
                          {sourceQuantity || 0}
                        </td>
                        <td colSpan="3" className="py-2 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                          Destination Total Qty:
                        </td>
                        <td className="py-2 px-4 font-medium">
                          <span className={totalTransferredQty > Number(sourceQuantity) ? 'text-red-600' : 'text-green-600'}>
                            {totalTransferredQty}
                          </span>
                        </td>
                        <td className="py-2 px-4"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Submit Button */}
                <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || totalTransferredQty > Number(sourceQuantity) || !sourceProduct || !sourceLocation || !sourceQuantity}
                      className="px-8 py-3 bg-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Create Stock Journal'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation Warning */}
              {totalTransferredQty > Number(sourceQuantity) && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium">Warning:</span>
                    <span>Total transfer quantity ({totalTransferredQty}) exceeds source quantity ({sourceQuantity})</span>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddStockJournels;