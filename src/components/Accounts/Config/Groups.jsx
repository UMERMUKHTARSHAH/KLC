import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import useColorMode from '../../../hooks/useColorMode';
import ReactSelect from 'react-select';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useGroups from '../../../hooks/useGroups';
import ViewTable from './ViewTable';
import Pagination from '../../Pagination/Pagination';
import { customStyles as createCustomStyles, DELETE_Groups_URL } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import Modall from '../../Products/Modall';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
const Groups = () => {
    const [gstDetails, setgstDetails] = useState([])
    const [hsnOptions, sethsnOptions] = useState([])

     const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const {
        Groups,
        edit,
        currentGroups,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        nature,
        invoice,
        under,
        setCurrentGroups,
        setEdit,
        Groupss,
        getGroupss

    } = useGroups(gstDetails,setgstDetails);
    const theme = useSelector(state => state?.persisted?.theme);
    const [vaaluee, setvaaluee] = useState({})
    const customStyles = createCustomStyles(theme?.mode);


    const hsnCode = useSelector(state => state?.persisted?.hsn);
    useEffect(() => {
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode]);

    const gstOptions = [

        { value: 'Applicable', label: 'Applicable' },
        { value: 'NotApplicable', label: 'NotApplicable' },

    ]
    const gstdetails = [

        // { value: 'Specify Slab Based Rates', label: 'Specify Slab Based Rates' },
        { value: 'Use GST Classification', label: 'Use GST Classification' },

    ]


    const supplyType = [

        { value: 'Goods', label: 'Goods' },
        { value: 'Service', label: 'Service' },
        { value: 'capital Goods', label: 'capital Goods' },
    ]
    const [gstDetailModal, setgstDetailModal] = useState(false)
    const handlerateDetails = (option, setFieldValue) => {
   
        setFieldValue('gstratedetails', option.value);
        if (option.value === "Specify Slab Based Rates") {

            setgstDetailModal(true)
        }

    }


    const handleModalSubmit = (values) => {

      
        setgstDetails(values)

    }
    useEffect(() => {
    getGroupss()
    }, [])

    
    

    

    const GroupsDropdown = Groupss.map(group => ({
        value: group.id,
        label: group.groupName
    }))
const handleEdit = (groupId) => {
    const groupToEdit = Groups.find(g => g.id === groupId);
    if (groupToEdit) {
        setCurrentGroups({
            ...groupToEdit,
            under: groupToEdit.under ? { id: groupToEdit.under.id } : null,
            hsnCode: groupToEdit.hsnCode || null,
            gstDetails: groupToEdit.gstDetails || "",
            gstratedetails: groupToEdit.gstratedetails || "",
            allocatePurchaseInvoice: groupToEdit.allocatePurchaseInvoice || "",
            hsn_Sac: groupToEdit.hsn_Sac || "",
            gstDescription: groupToEdit.gstDescription || "",
        });
        
        // If there are slab based rates, populate gstDetails
        if (groupToEdit.slabBasedRates && groupToEdit.slabBasedRates.length > 0) {
            setgstDetails(groupToEdit.slabBasedRates);
        }
        
        setEdit(true);
    }
};

const handleDeleteGroup = async (groupId) => {
  
        try {
            const response = await fetch(`${DELETE_Groups_URL}/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast.success('Group deleted successfully');
                window.location.reload()// Refresh the list
            } else {
                const data = await response.json();
                toast.error(data.errorMessage || 'Failed to delete group');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('An error occurred while deleting');
        }
   
};



    return (
        <DefaultLayout>
            <Breadcrumb pageName={edit ? "Configurator/Update Groups" : "Configurator/Create Groups"} />
            <div>
                <Formik
                    initialValues={currentGroups}
                    enableReinitialize={true}

                    validate={values => {
                        const errors = {};
                        if (!values.groupName) {
                            errors.groupName = 'Required';
                        }
                        if (!values.under) {
                            errors.under = 'Acount Group Is Required';
                        }
                        if (!values.natureOfGroup) {
                            errors.natureOfGroup = 'Nature Of Group  Is Required';
                        }

                        setvaaluee(values)


                        return errors;
                    }}

                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            {edit ? "Update Groups" : "Create Groups"}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col  p-6.5">
                                        <div className="mb-4.5 flex flex-col gap-6">
                                            <div className='flex flex-row gap-4'>
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">Group <span className='text-red-600 ml-1'>*</span></label>
                                                    <Field
                                                        type="text"
                                                        name="groupName"
                                                        placeholder="Enter Group Name"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                    />
                                                    <ErrorMessage name="groupName" component="div" className="text-red-500" />
                                                </div>

                                                <div className="flex-1 min-w-[250px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Under <span className='text-red-600 ml-1'>*</span></label>
                                                    <ReactSelect
                                                        name="under"
                                                        value={GroupsDropdown.find(option => option.value === values.under?.id) || null}
                                                        onChange={(option) => setFieldValue('under', option ? { id: option.value } : null)}
                                                        options={GroupsDropdown}

                                                        className="bg-white dark:bg-form-Field w-full z-99"
                                                        classNamePrefix="react-select"
                                                        placeholder="Under"
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 999 })
                                                        }}
                                                    />

                                                    <ErrorMessage
                                                        name="under"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-[300px] z-20 bg-transparent dark:bg-form-Field">
                                                    <label className="mb-2.5 block text-black dark:text-white">Nature Of Group <span className='text-red-600 ml-1'>*</span></label>
                                                    <ReactSelect
                                                        name="natureOfGroup"
                                                        value={nature.find(option => option.value === values.natureOfGroup) || null}
                                                        onChange={(option) => setFieldValue('natureOfGroup', option ? option.value : null)}
                                                        options={nature}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field w-full"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Units"
                                                    />

                                                    <ErrorMessage
                                                        name="natureOfGroup"
                                                        component="div"
                                                        className="text-red-600 text-sm mt-1"
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="flex flex-col gap-4 mt-6">
                                                {[
                                                    { name: 'affectGrossProfit', label: 'Does It Affect Gross Profit?' },
                                                    { name: 'subLedgerGroup', label: 'Group Behaves Like a Sub Ledger' },
                                                    { name: 'balanceReporting', label: 'Nett Debit/Credit Balances for Reporting' },
                                                    { name: 'calculation', label: 'Used For Calculation (e.g., Taxes, Discounts)' },
                                                ].map(({ name, label }) => (
                                                    <div key={name} className="flex items-center justify-between w-full max-w-[500px]">
                                                        <label className="text-black dark:text-white w-1/2">{label}</label>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="true"
                                                                    checked={values[name] === true}
                                                                    onChange={() => setFieldValue(name, true)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                Yes
                                                            </label>
                                                            <label className="flex items-center gap-1 text-black dark:text-white">
                                                                <input
                                                                    type="radio"
                                                                    name={name}
                                                                    value="false"
                                                                    checked={values[name] === false}
                                                                    onChange={() => setFieldValue(name, false)}
                                                                    className="form-radio text-primary"
                                                                />
                                                                No
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div> */}









                                        </div>

                                        {/* --- subGroup FieldArray --- */}
                                        {/* <div className="mb-6">
                                            <label className=" flex mb-2.5  text-black dark:text-white">Sub Group</label>
                                            <FieldArray name="subGroup">
                                                {({ push, remove, form }) => (
                                                    <div className="space-y-4 ">
                                                        {form.values.subGroup && form.values.subGroup.length > 0 ? (
                                                            form.values.subGroup.map((_, index) => (
                                                                <div key={index} className="flex items-center w-[440px] gap-4">
                                                                    <Field
                                                                        name={`subGroup[${index}]`}
                                                                        placeholder={`Subgroup ${index + 1}`}
                                                                        className="flex-1 rounded border-[1.5px] w-[200px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white dark:focus:border-primary"
                                                                    />

                                                                    <MdDelete className=' size-6 ' type="button" onClick={() => remove(index)} />

                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No subGroup added.</p>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => push('')}
                                                            className="mt-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                                                        >
                                                            + Add Subgroup
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </div> */}
                                        {/* gst */}



                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex-1 min-w-[250px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Method To Allocate When Used in Purchase Invoice</label>
                                                <div className="z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="allocatePurchaseInvoice"
                                                        value={invoice.find(option => option.value === values?.allocatePurchaseInvoice) || null}
                                                        onChange={(option) => setFieldValue('allocatePurchaseInvoice', option ? option?.value : '')}
                                                        options={invoice}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Method"
                                                    />
                                                </div>
                                            </div>
                                            {/* GST DETAILS Section */}
                                            <div className="flex-1 min-w-[250px]">
                                                <label className="mb-2.5 block text-black dark:text-white">GST DETAILS</label>
                                                <div className="z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="gstDetails"
                                                        options={gstOptions}
                                                        value={gstOptions.find((option) => option.value === values.gstDetails)}
                                                        onChange={(option) => setFieldValue("gstDetails", option?.value)}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select GST details"
                                                    />
                                                </div>
                                            </div>

                                            {/* GST RATE DETAILS Section (Conditional) */}
                                            {values.gstDetails === "Applicable" && (
                                                <div className="flex-1 min-w-[250px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">GST RATE DETAILS</label>
                                                    <ReactSelect
                                                        name="gstratedetails"
                                                        options={gstdetails}
                                                        value={gstdetails.find((option) => option.value === values.gstratedetails)}
                                                        onChange={(option) => handlerateDetails(option, setFieldValue)}
                                                        styles={customStyles}
                                                        classNamePrefix="react-select"
                                                        placeholder="Enter GST Rate Details"
                                                    />
                                                </div>
                                            )}
                                        </div>


                                        <div className="mb-4.5  gap-6">
                                            {/* GST DETAILS Select */}

                                            {/* Conditional Fields based on gstDetails */}


                                            <>

                                                <div className="mb-4.5 mt-6">
                                                    {/* Conditional Rendering: GST Details or HSN Code Section */}
                                                    {/* {gstDetails && gstDetails.length > 0 ? ( */}
                                                    {values.gstratedetails === "Specify Slab Based Rates" && values.gstDetails === "Applicable" ? (

                                                        // Render GST Details Section
                                                        <div className="flex flex-wrap gap-6">
                                                            {gstDetails.map((gst, index) => (
                                                                <div key={index} className="mb-4.5 flex flex-wrap gap-6">
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Greater Than</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].greaterThan`}
                                                                            type="text"
                                                                            value={gst.greaterThan}
                                                                            placeholder="Enter GBP Price"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Upto</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].upTo`}
                                                                            type="text"
                                                                            value={gst.upTo}
                                                                            placeholder="Upto"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Type</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].type`}
                                                                            type="text"
                                                                            value={gst.type}
                                                                            placeholder="Type"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[100px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">Rate</label>
                                                                        <Field
                                                                            name={`gstDetails[${index}].gstRate`}
                                                                            type="text"
                                                                            value={gst.gstRate}
                                                                            placeholder="Rate"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : values.gstratedetails === "Use GST Classification" && values.gstDetails === "Applicable" ? (
                                                        // Render HSN Code and Related Fields Section
                                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">
                                                                    HSN Code <span className="text-red-700 text-xl">*</span>
                                                                </label>
                                                                <ReactSelect
                                                                    name="hsnCode"
                                                                    value={hsnOptions?.find((option) => option.value === values.hsnCode?.id) || null}
                                                                    onChange={(option) => setFieldValue("hsnCode", option ? option.hsnObject : null)}
                                                                    options={hsnOptions}
                                                                    styles={customStyles}
                                                                    className="bg-white dark:bg-form-Field"
                                                                    classNamePrefix="react-select"
                                                                    placeholder="Select HSN Code"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">IGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.igst}
                                                                    disabled
                                                                    placeholder="Enter IGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="igst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">CGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.cgst}
                                                                    disabled
                                                                    placeholder="Enter CGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="cgst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">SGST (%)</label>
                                                                <Field
                                                                    type="number"
                                                                    value={vaaluee?.hsnCode?.sgst}
                                                                    disabled
                                                                    placeholder="Enter SGST Name"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                />
                                                                <ErrorMessage name="sgst" component="div" className="text-red-500" />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                                <Field
                                                                    name="gstDescription"
                                                                    value={vaaluee?.hsnCode?.productDescription}
                                                                    type="text"
                                                                    placeholder="Enter GST Description"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">HSN/SAC</label>
                                                                <Field
                                                                    name="hsn_Sac"
                                                                    type="text"
                                                                    placeholder="Enter HSN/SAC"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>




















                                            </>

                                        </div>


                                        <div className="flex justify-center mt-4 items-center">
                                            <button
                                                type="submit"
                                                className="flex md:w-[170px] w-[170px] md:h-[37px] h-[40px] pt-2 rounded-lg justify-center bg-primary md:p-2.5 font-medium md:text-sm text-gray hover:bg-opacity-90"
                                            >
                                                {edit ? "Update Groups" : "Create Groups"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* View Table */}
                                {!edit && (
                                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                            <table className="min-w-full leading-normal">
                                                <thead>
                                                    <tr className='px-5 py-3 bg-slate-300 dark:bg-slate-700 dark:text-white'>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SNO</th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Group Name</th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Under Group</th>
                                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nature Of Group</th>

                                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Groups && Groups.length > 0 ? (
                                                            Groups.map((group, index) => (
                                                                <tr key={group.id} className='bg-white dark:bg-slate-700 dark:text-white'>
                                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                        {group.groupName}
                                                                    </td>
                                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                        {group.under ? group.under.groupName : '-'}
                                                                    </td>
                                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                        {group.natureOfGroup}
                                                                    </td>
                                                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                                        <div className="flex">
                                                                            <FiEdit
                                                                                size={17}
                                                                                className="text-teal-500 hover:text-teal-700 mx-2 cursor-pointer"
                                                                                onClick={() => handleEdit(group.id)}
                                                                                title="Edit Group"
                                                                            />
                                                                            <FiTrash2
                                                                                size={17}
                                                                                className="text-red-500 hover:text-red-700 mx-2 cursor-pointer"
                                                                                onClick={() => handleDeleteGroup(group.id)}
                                                                                title="Delete Group"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                                                    No groups found.
                                                                </td>
                                                            </tr>
                                                        )

                                                    }
                                              
                                                </tbody>
                                            </table>
                                        </div>

                                        {pagination.totalPages > 1 && (
                                            <Pagination
                                                totalPages={pagination.totalPages}
                                                currentPage={pagination.currentPage}
                                                handlePageChange={handlePageChange}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </Form>

                    )}


                </Formik>

            </div>
            <Modall
                setIsModalOpen={setgstDetailModal}
                isOpen={gstDetailModal}
                onRequestClose={() => setgstDetailModal(false)}
                //   prodIdd={}
                //   GET_PRODUCTBYID_URL={GET_PRODUCTBYID_URL}
                onSubmit={handleModalSubmit}
                width="70%"
                height="80%"
                style={{ marginLeft: '70px', marginRight: '0' }}  // Add this line
            />
        </DefaultLayout >
    )
}

export default Groups
