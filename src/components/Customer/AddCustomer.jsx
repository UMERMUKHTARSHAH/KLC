import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Field, useFormik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import useCustomer from '../../hooks/useCustomer';
import { customStyles as createCustomStyles } from '../../Constants/utils';

const AddCustomer = () => {
  const customerGroup = useSelector(
    (state) => state?.nonPersisted?.customerGroup,
  );
  const [customerGroupList, setCustomerGroupList] = useState([]);
  const theme = useSelector(state => state?.persisted?.theme);
  const {
    handleSubmit,
  } = useCustomer();

  const stateOption = [
    { value: '01', label: 'Jammu & Kashmir' },
    { value: '02', label: 'Himachal Pradesh' },
    { value: '03', label: 'Punjab' },
    { value: '04', label: 'Chandigarh' },
    { value: '05', label: 'Uttarakhand' },
    { value: '06', label: 'Haryana' },
    { value: '07', label: 'Delhi' },
    { value: '08', label: 'Rajasthan' },
    { value: '09', label: 'Uttar Pradesh' },
    { value: '10', label: 'Bihar' },
    { value: '11', label: 'Sikkim' },
    { value: '12', label: 'Arunachal Pradesh' },
    { value: '13', label: 'Nagaland' },
    { value: '14', label: 'Manipur' },
    { value: '15', label: 'Mizoram' },
    { value: '16', label: 'Tripura' },
    { value: '17', label: 'Meghalaya' },
    { value: '18', label: 'Assam' },
    { value: '19', label: 'West Bengal' },
    { value: '20', label: 'Jharkhand' },
    { value: '21', label: 'Odisha' },
    { value: '22', label: 'Chhattisgarh' },
    { value: '23', label: 'Madhya Pradesh' },
    { value: '24', label: 'Gujarat' },
    { value: '25', label: 'Daman & Diu' },
    { value: '26', label: 'Dadra & Nagar Haveli' },
    { value: '27', label: 'Maharashtra' },
    { value: '28', label: 'Andhra Pradesh' },
    { value: '29', label: 'Karnataka' },
    { value: '30', label: 'Goa' },
    { value: '31', label: 'Lakshadweep' },
    { value: '32', label: 'Kerala' },
    { value: '33', label: 'Tamil Nadu' },
    { value: '34', label: 'Puducherry' },
    { value: '35', label: 'Andaman & Nicobar Islands' },
    { value: '36', label: 'Telangana' },
    { value: '37', label: 'Andhra Pradesh (New)' },
    { value: '38', label: 'Ladakh' }
  ];

  const customerOriginOptions=[
    { value: 'International', label: 'International' },
    { value: 'Domestic', label: 'Domestic' },
  ,
  ]


  useEffect(() => {
    if (customerGroup.data) {
      const formattedOptions = customerGroup.data.content.map((customer) => ({
        value: customer.id,
        label: customer.customerGroupName,
        customerObject: customer,
      }));
      setCustomerGroupList(formattedOptions);
    }
  }, [customerGroup.data]);

  const customStyles = createCustomStyles(theme?.mode);

  // Safe error display function
  const renderError = (error) => {
    if (!error) return null;

    // Convert error to string safely
    let errorMessage = '';
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object') {
      // Handle specific object errors
      if (error.id || error.customerGroupName) {
        errorMessage = 'Please select a customer group';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = JSON.stringify(error);
      }
    } else {
      errorMessage = String(error);
    }

    return <div className="text-red-600 text-sm mt-1">{errorMessage}</div>;
  };

  const formik = useFormik({
    initialValues: {
      customerName: '',
      customerGroup: null,
      countryName: '',
      city: '',
      contactNumber: '',
      billTo: '',
      email: '',
      reference: '',
      billingAddress: '',
      shippingAddress: '',
      shippingState: '',
      gstin_vatno: '',
      iecNumber: '',
      customerId: '', // Assuming customerId is same as contactNumber
      clientcategory: '',
      referalId: '',
      customerOrigin: '',

      instaId: '',
      registrationType: '',
      discountOffered: '',
      retailLocation: '',
      website: '',
      social: '',
      event: '',
      eventType: '',
      typeOfopeningBalance: "",
      previousOpType: "",
      openingBalances: '',
      previousOpBalance: '',
    },
    validationSchema: Yup.object().shape({
      customerName: Yup.string().required('Customer Name is required'),
      customerGroup: Yup.object()
        .nullable()
        .required('Customer Group is required')
        .test('has-id', 'Customer Group is required', (value) => {
          return value !== null && value.id && value.customerGroupName;
        }),
      countryName: Yup.string().required('Country is required'),
      city: Yup.string().required('City is required'),
      contactNumber: Yup.string()
        .matches(/^[0-9]{8,}$/, 'Contact number must be at least 8 digits')
        .required('Contact Number is required'),
      //  billTo: Yup.string().nullable(),
      billTo: Yup.string().optional(),
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      reference: Yup.string().optional(),
      billingAddress: Yup.string().required('Billing Address is required'),
      shippingAddress: Yup.string().required('Shipping Address is required'),
      shippingState: Yup.string().required('Shipping State is required'),
      gstin_vatno: Yup.string().optional(),
      iecNumber: Yup.string().nullable(),
      instaId: Yup.string().optional(),
      discountOffered: Yup.string().optional(),
      retailLocation: Yup.string().nullable(),
      website: Yup.string().nullable(),
      social: Yup.string().nullable(),
      event: Yup.string().nullable(),
      eventType: Yup.string().nullable(),
    }),
    onSubmit: (values) => {
      if (values) {
        console.log('Submitting values:', values);
        handleSubmit(values);
      }
    },
  });

  const handleRadioChange = (event) => {
    formik.setFieldValue('retailLocation', event.target.value);
  };

  const handleRadioChangeWebsite = (event) => {
    formik.setFieldValue('website', event.target.value);
  };

  const handleRadioChangeSocial = (event) => {
    formik.setFieldValue('social', event.target.value);
  };

  const handleRadioChangeEvent = (event) => {
    formik.setFieldValue('event', event.target.value);
  };

  const handleRadioChangeEventType = (event) => {
    formik.setFieldValue('eventType', event.target.value);
  };

  // Get current ReactSelect value
  const getCustomerGroupValue = () => {
    if (!formik.values.customerGroup) return null;
    return customerGroupList?.find(
      (option) => option.value === formik.values.customerGroup?.id
    ) || null;
  };

    const clientcategoryOptions = [
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'STANDARD', label: 'Standard' },
    { value: 'BASIC', label: 'Basic' },
    { value: 'VIP', label: 'VIP' },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Customer / Add Customer" />
      <div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                Add Customer
              </h3>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Customer Name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.customerName}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.customerName && formik.errors.customerName && (
                      renderError(formik.errors.customerName)
                    )}
                  </div>

                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer Group <span className="text-red-600">*</span>
                    </label>
                    <ReactSelect
                      name="customerGroup"
                      styles={customStyles}
                      value={getCustomerGroupValue()}
                      onChange={(option) =>
                        formik.setFieldValue(
                          'customerGroup',
                          option ? option.customerObject : null,
                        )
                      }
                      onBlur={() => formik.setFieldTouched('customerGroup', true)}
                      options={customerGroupList}
                      className="bg-white dark:bg-form-input"
                      classNamePrefix="react-select"
                      placeholder="Select Customer Group"
                    />
                    {formik.touched.customerGroup && formik.errors.customerGroup && (
                      renderError(formik.errors.customerGroup)
                    )}
                  </div>
                      <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="countryName"
                      placeholder="Country Name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.countryName}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.countryName && formik.errors.countryName && (
                      renderError(formik.errors.countryName)
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex flex-wrap gap-6">
              

                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City Name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.city && formik.errors.city && (
                      renderError(formik.errors.city)
                    )}
                  </div>
                     <div className="flex-1 min-w-[300px]">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Client Category
                        </label>
                        <ReactSelect
                          name="clientcategory"
                          value={clientcategoryOptions.find(
                            option => option.value === formik.values.clientcategory
                          )}
                          onChange={(option) =>
                            formik.setFieldValue('clientcategory', option?.value || '')
                          }
                          options={clientcategoryOptions}
                          onBlur={formik.handleBlur}
                          styles={customStyles}
                          className="bg-white dark:bg-form-input"
                          classNamePrefix="react-select"
                          placeholder="Select Client Category"
                          isClearable
                        />
                      </div>

                   <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Referal Id <span className="text-red-600"></span>
                    </label>
                    <input
                      type="text"
                      name="referalId"
                      placeholder="Referral Id"

                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.referalId}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.referalId && formik.errors.referalId && (
                      renderError(formik.errors.referalId)
                    )}
                  </div>
                </div>
                  <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.email && formik.errors.email && (
                      renderError(formik.errors.email)
                    )}
                  </div>

                     <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Registration Type <span className="text-red-600"></span>
                    </label>
                    <input
                      type="text"
                      name="registrationType"
                      placeholder="Registration Type"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.registrationType}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.registrationType && formik.errors.registrationType && (
                      renderError(formik.errors.registrationType)
                    )}
                  </div>

                        <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer Id <span className="text-red-600"></span>
                    </label>
                    <input
                      type="text"
                      name="customerId"
                      placeholder="Customer Id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.contactNumber}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  
                  </div>

                  

              
                </div>

                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Contact Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      placeholder="Contact Number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.contactNumber}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.contactNumber && formik.errors.contactNumber && (
                      renderError(formik.errors.contactNumber)
                    )}
                  </div>
                    <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Customer Origin <span className="text-red-600">*</span>
                    </label>
                    <ReactSelect
                      name="customerOrigin"
                      styles={customStyles}
                      value={customerOriginOptions.find(option => option?.value === formik?.values.customerOrigin) || null}
                      onChange={(option) =>
                        formik.setFieldValue(
                          'customerOrigin',
                          option ? option.value : null,
                        )
                      }
                      onBlur={() => formik.setFieldTouched('customerOrigin', true)}
                      options={customerOriginOptions}
                      className="bg-white dark:bg-form-input"
                      classNamePrefix="react-select"
                      placeholder="Select Customer Origin"
                    />
                    {formik.touched.customerOrigin && formik.errors.customerOrigin && (
                      renderError(formik.errors.customerOrigin)
                    )}
                  </div>

                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Bill To
                    </label>
                    <input
                      type="text"
                      name="billTo"
                      placeholder="Billing To"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.billTo}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.billTo && formik.errors.billTo && (
                      renderError(formik.errors.billTo)
                    )}
                  </div>
                </div>

              

                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Billing Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="billingAddress"
                      placeholder="Billing Address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.billingAddress}
                      rows="3"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.billingAddress && formik.errors.billingAddress && (
                      renderError(formik.errors.billingAddress)
                    )}
                  </div>

                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Shipping Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="shippingAddress"
                      placeholder="Shipping Address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shippingAddress}
                      rows="3"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                      renderError(formik.errors.shippingAddress)
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Billing State <span className="text-red-600">*</span>
                    </label>
                    <ReactSelect
                      name="shippingState"
                      styles={customStyles}
                      value={stateOption.find(option => option.value === formik.values.shippingState) || null}

                      onChange={(option) =>
                        formik.setFieldValue(
                          'shippingState',
                          option ? option.value : null,
                        )
                      }
                      onBlur={() => formik.setFieldTouched('shippingState', true)}
                      options={stateOption}
                      className="bg-white dark:bg-form-input"
                      classNamePrefix="react-select"
                      placeholder="Select Shipping State"
                    />
                   
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      GSTIN/VAT No
                    </label>
                    <input
                      type="text"
                      name="gstin_vatno"
                      placeholder="GSTIN/VAT No"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.gstin_vatno}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.gstin_vatno && formik.errors.gstin_vatno && (
                      renderError(formik.errors.gstin_vatno)
                    )}
                  </div>

                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      IEC No
                    </label>
                    <input
                      type="text"
                      name="iecNumber"
                      placeholder="IEC No"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.iecNumber}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Instagram ID
                    </label>
                    <input
                      type="text"
                      name="instaId"
                      placeholder="Instagram ID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.instaId}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.instaId && formik.errors.instaId && (
                      renderError(formik.errors.instaId)
                    )}
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Discount Offered(%)
                    </label>
                    <input
                      type="text"
                      name="discountOffered"
                      placeholder="Discount Offered(%)"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.discountOffered}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {formik.touched.discountOffered && formik.errors.discountOffered && (
                      renderError(formik.errors.discountOffered)
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex flex-wrap gap-6">
                  <div className="mb-4.5 border-t border-stroke pt-4 dark:border-strokedark w-full">
                    {/* Radio Buttons for Opening Balance Type */}
                    <div className="mb-2.5 flex items-center gap-4">
                      <h4 className="font-medium text-black dark:text-white">Opening Balance Type:</h4>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="typeOfopeningBalance"
                          value="DEBIT"
                          checked={formik.values.typeOfopeningBalance === "DEBIT"}
                          onChange={(e) => {
                            formik.setFieldValue('typeOfopeningBalance', e.target.value);
                            formik.setFieldValue('previousOpType', e.target.value);
                          }}
                          className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                        />
                        <span className="text-black dark:text-white">Debit (DR)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="typeOfopeningBalance"
                          value="CREDIT"
                          checked={formik.values.typeOfopeningBalance === "CREDIT"}
                          onChange={(e) => {
                            formik.setFieldValue('typeOfopeningBalance', e.target.value);
                            formik.setFieldValue('previousOpType', e.target.value);
                          }}
                          className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                        />
                        <span className="text-black dark:text-white">Credit (CR)</span>
                      </label>
                    </div>

                    {/* Opening Balance Input */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 min-w-[250px]">
                        <input
                          type="number"
                          name="openingBalances"
                          placeholder="Opening Balance"
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldValue('previousOpBalance', e.target.value);
                          }}
                          onBlur={formik.handleBlur}
                          value={formik.values.openingBalances}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      {/* Display "CR" if Credit is selected */}
                      {formik.values.typeOfopeningBalance === "CREDIT" ? (
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          Cr.
                        </span>
                      ) : (
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          Dr.
                        </span>
                      )}
                    </div>
                  </div>
                </div>


                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                    CUSTOMER INTERACTION
                  </h3>
                </div>

                <div className="p-4 flex flex-wrap lg:flex-nowrap gap-8 items-start justify-between">

                  {/* Retail Location */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <p className="font-medium">Retail Location</p>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="retailLocation" value="SRX"
                        checked={formik.values.retailLocation === 'SRX'}
                        onChange={handleRadioChange}
                      />
                      SRX
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="retailLocation" value="Delhi"
                        checked={formik.values.retailLocation === 'Delhi'}
                        onChange={handleRadioChange}
                      />
                      Delhi
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="retailLocation" value="SXR and Delhi"
                        checked={formik.values.retailLocation === 'SXR and Delhi'}
                        onChange={handleRadioChange}
                      />
                      SXR and Delhi
                    </label>
                  </div>

                  {/* Website */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <p className="font-medium">Website</p>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="website" value="Subscribed"
                        checked={formik.values.website === 'Subscribed'}
                        onChange={handleRadioChangeWebsite}
                      />
                      Subscribed
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="website" value="Subscribed/Purchased"
                        checked={formik.values.website === 'Subscribed/Purchased'}
                        onChange={handleRadioChangeWebsite}
                      />
                      Subscribed / Purchased
                    </label>
                  </div>

                  {/* Social */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <p className="font-medium">Social</p>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="social" value="Interaction"
                        checked={formik.values.social === 'Interaction'}
                        onChange={handleRadioChangeSocial}
                      />
                      Interaction
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="social" value="Purchased"
                        checked={formik.values.social === 'Purchased'}
                        onChange={handleRadioChangeSocial}
                      />
                      Purchased
                    </label>
                  </div>

                  {/* Event */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <p className="font-medium">Event</p>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="event" value="Domestic"
                        checked={formik.values.event === 'Domestic'}
                        onChange={handleRadioChangeEvent}
                      />
                      Domestic
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="event" value="International"
                        checked={formik.values.event === 'International'}
                        onChange={handleRadioChangeEvent}
                      />
                      International
                    </label>
                  </div>

                  {/* Event Type */}
                  <div className="flex flex-col gap-2 min-w-[170px]">
                    <p className="font-medium">Event Type</p>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="eventType" value="Interaction"
                        checked={formik.values.eventType === 'Interaction'}
                        onChange={handleRadioChangeEventType}
                      />
                      Interaction
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="eventType" value="Purchased"
                        checked={formik.values.eventType === 'Purchased'}
                        onChange={handleRadioChangeEventType}
                      />
                      Purchased
                    </label>
                  </div>

                </div>


                {/* <div className="p-4 space-y-4 flex flex-col items-center md:space-y-0 md:flex-row md:justify-center md:items-center">
                  <div className="md:flex-1 md:px-4">
                  
                   
                  </div>
                </div> */}



                {/* <button
                  type="submit"
                  className="flex md:w-[240px] w-[220px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center items-center bg-primary font-medium text-white hover:bg-opacity-90"
                >
                  Add Customer
                </button> */}


                <div className="flex justify-center mt-13  pt-6 border-t border-gray-300">
                  <button
                    type="submit"
                    className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] pt-2 rounded-lg justify-center  bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCustomer;