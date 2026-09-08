import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ReactSelect from 'react-select';
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useSupplier from '../../hooks/useSupplier';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import { ADD_SUPPLIER_URL } from "../../Constants/utils"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddSupplier = () => {
    const [productGroupOptions, setproductGroupOptions] = useState([])
    const navigate = useNavigate();
    const {
        seloptions,
        groups
    } = useSupplier();

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



    const productGroup = useSelector(state => state?.persisted?.productGroup);


    useEffect(() => {
        if (productGroup.data) {
            const formattedOptions = productGroup.data.map(product => ({
                value: product.productGroupName,
                label: product.productGroupName,
                productGroupObject: product,
            }));
            setproductGroupOptions(formattedOptions);
        }
    }, [productGroup.data]);

    const theme = useSelector(state => state?.persisted?.theme);

    const customStyles = createCustomStyles(theme?.mode);

    const workerSelectStyles = {
        ...customStyles,
        control: (provided) => ({
            ...provided,
            ...customStyles.control, // Include existing custom control styles
            backgroundColor: customStyles.control.backgroundColor, // Ensure background color consistency
            border: "1px light gray", // Set border properties
            maxHeight: "80px", // Set the maximum height
            overflow: "auto",
            marginLeft: "10px"
            // Enable overflow scrolling
        }),
    };
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [rows, setRows] = useState([{ id: Date.now(), selectedOption1: null, selectedOption2: null, selectedOption3: [], numOfLooms: 0 }]);

    const weaveremb = [
        { value: 'BrandA', label: 'Brand A' },
        { value: 'BrandB', label: 'Brand B' },
        { value: 'BrandC', label: 'Brand C' }
    ];

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = {
            ...values,
            supplierType: values.supplierType?.value,
            groupTypes: rows.map(row => ({
                groupTypeName: row.selectedOption1?.value || row.selectedOption2?.value,
                noOfLooms: row.numOfLooms,
                workers: row.selectedOption3.map(worker => ({ workerCode: worker.value }))
            }))
        };

        console.log(formData,"Form Data"

        ); // Log the formData for debugging

        try {
            console.log("Submitting form...");
            const url = ADD_SUPPLIER_URL;
            const method = "POST";
            // Ensure token is fetched correctly

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData) // Stringify the formData
            });

            const data = await response.json();
            console.log(data, "Response data"); // Log the response data for debugging

            if (response.ok) {

                toast.success(`Supplier added successfully`);
                navigate("/supplier/view")
                // Call resetForm and setCurrentSupplier with proper state updates
            } else {
                console.log("error here");
                console.log(data.accountNo, "+++++++");
                toast.error(data.errorMessage ? `${data.errorMessage}` : `${data?.accountNo}`);
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), selectedOption1: null, selectedOption2: null, selectedOption3: [], numOfLooms: 0 }]);
    };

    const deleteRow = (index) => {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    };

    const generateWorkerOptions = (groupName, supplierCode, numOfLooms) => {
        const workerOptions = [];
        for (let i = 1; i <= numOfLooms; i++) {
            const label = `${groupName.slice(0, 3).toUpperCase()}-${supplierCode.slice(0, 5)}-${String(i).padStart(3, '0')}`;
            workerOptions.push({ value: label, label });
        }
        return workerOptions;
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Supplier /Add Supplier" />
            <div>
                <Formik
                    initialValues={{
                        name: '',
                        phoneNumber: '',
                        supplierCode: '',
                        address: '',
                        bankName: '',
                        accountNo: '',
                        shippingState: '',
                        ifscCode: '',
                        typeOfOpeningBalance: "",
                        previousOpType: "",
                        openingBalances: '',
                        previousOpBalance: '',
                        emailId: '',
                        supplierType: null
                    }}
                    validate={values => {
                        const errors = {};

                        // Validate name
                        if (!values.name) {
                            errors.name = 'Required';
                        }

                        if (!values.shippingState) {
                            errors.shippingState = 'Required';
                        }



                        // Validate phone number
                        if (!values.phoneNumber) {
                            errors.phoneNumber = 'Required';
                        } else if (values.phoneNumber.length < 10) {
                            errors.phoneNumber = 'Phone Number must be at least 10 digits';
                        }

                        // Validate supplier code
                        // if (!values.supplierCode) {
                        //     errors.supplierCode = 'Required';
                        // }

                        // Validate address
                        if (!values.address) {
                            errors.address = 'Required';
                        }

                        // Validate bank name
                        if (!values.bankName) {
                            errors.bankName = 'Required';
                        }

                        // Validate account number
                        if (!values.accountNo) {
                            errors.accountNo = 'Required';
                        }

                        // Validate IFSC code
                        if (!values.ifscCode) {
                            errors.ifscCode = 'Required';
                        }

                        return errors;
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Add Supplier
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Supplier Code <span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="supplierCode"
                                                    placeholder="Enter Supplier Code"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                {/* <ErrorMessage name="supplierCode" component="div" className="text-red-500" /> */}
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Name<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="name" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Phone<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="phoneNumber"
                                                    placeholder="Enter Phone Number"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Email</label>
                                                <Field
                                                    type="email"
                                                    name="emailId"
                                                    placeholder="Enter Email"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="emailId" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Address<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="address"
                                                    placeholder="Enter Address"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="address" component="div" className="text-red-500" />
                                            </div>

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    State <span className="text-red-600">*</span>
                                                </label>
                                                <ReactSelect
                                                    name="shippingState"
                                                    styles={customStyles}
                                                    value={stateOption.find(option => option.value === values.shippingState) || null}

                                                    onChange={(option) =>
                                                        setFieldValue(
                                                            'shippingState',
                                                            option ? option.value : null,
                                                        )
                                                    }

                                                    options={stateOption}
                                                    className="bg-white dark:bg-form-input"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select  State"
                                                />

                                                <ErrorMessage name="shippingState" component="div" className="text-red-600 text-sm" />

                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Supplier Type</label>
                                                <ReactSelect
                                                    name="supplierType"
                                                    value={seloptions.find(option => option.value === values.supplierType?.value) || null}
                                                    onChange={(option) => setFieldValue('supplierType', option)}
                                                    options={seloptions}
                                                    styles={customStyles}
                                                    className="bg-white dark:bg-form-input"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Supplier Type"
                                                />
                                                <ErrorMessage name="supplierType" component="div" className="text-red-600 text-sm" />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Bank Name<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="bankName"
                                                    placeholder="Bank Name"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="bankName" component="div" className="text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Bank Account Number<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="accountNo"
                                                    placeholder="Enter Bank Account Number"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="accountNo" component="div" className="text-red-500" />
                                            </div>
                                            <div className="min-w-[320px] sm:min-w-[400px]">
                                                <label className="mb-2.5 block text-black dark:text-white">IFSC Code<span className="text-red-500">*</span></label>
                                                <Field
                                                    type="text"
                                                    name="ifscCode"
                                                    placeholder="Enter IFSC Code"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                />
                                                <ErrorMessage name="ifscCode" component="div" className="text-red-500" />
                                            </div>
                                            <div className="mb-4.5  gap-6">
                                                <div className="flex mb-4.5 gap-7   pt-4 dark:border-strokedark w-full">
                                                    {/* Radio Buttons for Opening Balance Type */}
                                                    <div className="mb-2.5 flex items-center gap-4">
                                                        <h4 className="font-medium text-black dark:text-white">Opening Balance Type:</h4>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="typeOfOpeningBalance"
                                                                value="DEBIT"
                                                                checked={values.typeOfOpeningBalance === "DEBIT"}
                                                                onChange={(e) => {
                                                                    setFieldValue('typeOfOpeningBalance', e.target.value);
                                                                    setFieldValue('previousOpType', e.target.value);
                                                                }}
                                                                className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                                                            />
                                                            <span className="text-black dark:text-white"> (DR)</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name="typeOfOpeningBalance"
                                                                value="CREDIT"
                                                                checked={values.typeOfOpeningBalance === "CREDIT"}
                                                                onChange={(e) => {
                                                                    setFieldValue('typeOfOpeningBalance', e.target.value);
                                                                    setFieldValue('previousOpType', e.target.value);
                                                                }}
                                                                className="h-4 w-4 border-stroke bg-transparent text-primary focus:ring-0 dark:border-form-strokedark dark:bg-slate-700"
                                                            />
                                                            <span className="text-black dark:text-white"> (CR)</span>
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

                                                                    setFieldValue('previousOpBalance', e.target.value);
                                                                    setFieldValue('openingBalances', e.target.value);
                                                                }}
                                                                //   onBlur={formik.handleBlur}
                                                                value={values.openingBalances}
                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                            />
                                                        </div>
                                                        {/* Display "CR" if Credit is selected */}
                                                        {values.typeOfOpeningBalance === "CREDIT" ? (
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

                                        </div>

                                        {values.supplierType?.value === "PRODUCT" && (
                                            <>


                                                <div className='text-center flex justify-between'>
                                                    <h2 className='text-2xl'>Groups</h2>

                                                    <div className='text-end'>
                                                        <button
                                                            type="button"
                                                            onClick={addRow}
                                                            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                                        >
                                                            <IoMdAdd className="mr-2" size={20} />
                                                            Add Row
                                                        </button>

                                                    </div>
                                                </div>
                                                <div className="overflow-x-scroll md:overflow-x-visible  md:overflow-y-visible -mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
                                                    <div className="min-w-full shadow-md rounded-lg">
                                                        <table className="table-fixed w-full">
                                                            <thead>
                                                                <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ minWidth: '250px' }}>Group</th>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No of Looms</th>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Workers</th>
                                                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {rows.map((row, index) => (
                                                                    <tr key={row.id}>
                                                                        <td className="px-2 py-2 border-b">
                                                                            <ReactSelect
                                                                                name='group'
                                                                                value={row.selectedOption1}
                                                                                onChange={(option) => {
                                                                                    const newRows = [...rows];
                                                                                    newRows[index].selectedOption1 = option;
                                                                                    setRows(newRows);
                                                                                }}
                                                                                classNamePrefix="react-select"
                                                                                options={productGroupOptions}
                                                                                placeholder="Group Name"
                                                                                styles={customStyles}
                                                                            />
                                                                            <ErrorMessage name="group" component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b">
                                                                            <Field
                                                                                type="number"
                                                                                name={`rows[${index}].numOfLooms`}
                                                                                placeholder="Enter Number Of Looms"
                                                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                                onChange={(e) => {
                                                                                    const newRows = [...rows];
                                                                                    const numOfLooms = parseInt(e.target.value, 10);
                                                                                    newRows[index].numOfLooms = numOfLooms;
                                                                                    newRows[index].selectedOption3 = generateWorkerOptions(
                                                                                        newRows[index].selectedOption1?.label || '',
                                                                                        values.supplierCode,
                                                                                        numOfLooms
                                                                                    );
                                                                                    setRows(newRows);
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b">
                                                                            <ReactSelect
                                                                                name='workers'
                                                                                value={row.selectedOption3}
                                                                                onChange={(option) => {
                                                                                    const newRows = [...rows];
                                                                                    newRows[index].selectedOption3 = option;
                                                                                    setRows(newRows);
                                                                                }}
                                                                                classNamePrefix="react-select"
                                                                                options={row.selectedOption3}
                                                                                placeholder="Workers"
                                                                                styles={workerSelectStyles}
                                                                                isMulti
                                                                                components={{ DropdownIndicator: () => null, ClearIndicator: () => null }}
                                                                            />
                                                                            <ErrorMessage name="workers" component="div" className="text-red-500" />
                                                                        </td>
                                                                        <td className="px-2 py-2 border-b">
                                                                            {rows.length > 1 && (
                                                                                <button type='button' onClick={() => deleteRow(index)}>
                                                                                    <IoMdTrash size={24} />
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-center mt-4 items-center">
                                            <button type="submit" className="flex md:w-[230px] w-[190px] md:h-[37px] h-[47px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-4">
                                                Add Supplier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DefaultLayout>
    );
};

export default AddSupplier;