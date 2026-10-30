import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../../layout/DefaultLayout'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useVoucher from '../../../hooks/useVoucher';
import { CREATE_DEBITNOTE_URL, GET_VoucherNos_URL, customStyles as createCustomStyles } from '../../../Constants/utils';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useLedger from '../../../hooks/useLedger';
import { toast } from 'react-toastify';

const CreateContra = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const { GetVoucherById, Vouchers,  } = useVoucher();
    const [voucherNos, setvoucherNos] = useState('')
    const { getLedger, Ledger } = useLedger();
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);



      const handleCreateVoucher = async (values) => {
     
    
            try {
                const response = await fetch(`${CREATE_DEBITNOTE_URL}/${id}/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(values)
                });
    
                let data;
                try {
                    data = await response.json();
                } catch {
                    console.log(data, "catccccccch");
                    data = { errorMessage: response.errorMessage };
                }
    
                if (response.ok) {
                    toast.success(`Contra added successfully`);
                    navigate("/Vouchers/view");
                } else {
                    console.log("i am in error else ");
                    toast.error(`${data.errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            }
        };

    // Get all bank and cash ledgers
    const BankCashLedgers = Ledger.filter(ledg => 
        ledg?.name && (ledg.name.toLowerCase().includes('bank') || ledg.name.toLowerCase().includes('cash'))
    );

    const ledgerOptions = BankCashLedgers?.map(ledg => ({
        value: ledg?.id,
        label: ledg?.name,
        obj: ledg,
        balance: ledg?.openingBalances,
        type: ledg.typeOfOpeningBalance
    }));

    useEffect(() => {
        GetVoucherById(id);
        getLedger();
    }, []);

    const GetVoucherNos = async () => {
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
                setvoucherNos(data.nextReceipt);
                return data.nextReceipt;
            } else {
                toast.error(data.errorMessage || "Error");
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

    useEffect(() => {
        if (Vouchers?.id) {
            GetVoucherNos();
        }
    }, [Vouchers.id]);

    const validationSchema = Yup.object().shape({
        noteNumber: Yup.string().required('Voucher number is required'),
        ledgerId: Yup.string().required('From account is required'),
        destinationLedgerId: Yup.string().required('To account is required'),
        totalAmount: Yup.number().required('totalAmount is required').positive('totalAmount must be positive'),
        date: Yup.date().required('Date is required'),
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Configurator/Create Contra" />
            <div>
                <Formik
                    initialValues={{
                        noteNumber: voucherNos,
                        date: '',
                        voucherId: Number(id),
                        ledgerId: "",
                        destinationLedgerId: "",
                        totalAmount: "",
                        fromBalance: "",
                        toBalance: "",
                        narration: "",
                        noteType: "CONTRA"
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateVoucher}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            Contra Entry
                                        </h3>
                                    </div>

                                    <div className="flex flex-col p-6.5">
                                        {/* Top Section */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Contra Number</label>
                                                <Field
                                                    type="text"
                                                    name="noteNumber"
                                                    placeholder="Enter No"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-slate-700 dark:text-white"
                                                />
                                                <ErrorMessage name="noteNumber" component="div" className="text-red-500" />
                                            </div>

                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">Date</label>
                                                <Field
                                                    name="date"
                                                    type="date"
                                                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                />
                                                <ErrorMessage name="date" component="div" className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* From Account */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">From Account <span className='text-red-600'>*</span></label>
                                                <ReactSelect
                                                    name='ledgerId'
                                                    value={ledgerOptions.find(opt => opt.value === values.ledgerId)}
                                                    onChange={(option) => {
                                                        setFieldValue('ledgerId', option?.value || '');
                                                        setFieldValue('fromBalance', option?.balance || 0);
                                                    }}
                                                    options={ledgerOptions}
                                                    classNamePrefix="react-select"
                                                    placeholder="Select From Account"
                                                    menuPortalTarget={document.body}
                                                    styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                />
                                                <ErrorMessage name="ledgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                {values.fromBalance && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        Balance: ₹{values.fromBalance}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">To Account <span className='text-red-600'>*</span></label>
                                                <ReactSelect
                                                    name='destinationLedgerId'
                                                    value={ledgerOptions.find(opt => opt.value === values.destinationLedgerId)}
                                                    onChange={(option) => {
                                                        setFieldValue('destinationLedgerId', option?.value || '');
                                                        setFieldValue('toBalance', option?.balance || 0);
                                                    }}
                                                    options={ledgerOptions.filter(opt => opt.value !== values.ledgerId)}
                                                    classNamePrefix="react-select"
                                                    placeholder="Select To Account"
                                                    menuPortalTarget={document.body}
                                                    styles={{ ...customStyles, menuPortal: (base) => ({ ...base, zIndex: 100000 }) }}
                                                />
                                                <ErrorMessage name="destinationLedgerId" component="div" className="text-red-500 text-xs mt-1" />
                                                {values.toBalance && (
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        Balance: ₹{values.toBalance}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* totalAmount */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                            <div>
                                                <label className="mb-2.5 block text-black dark:text-white">totalAmount <span className='text-red-600'>*</span></label>
                                                <Field
                                                    type="number"
                                                    name="totalAmount"
                                                    placeholder="Enter totalAmount"
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                                    validate={(value) => {
                                                        const totalAmount = parseFloat(value) || 0;
                                                        const fromBalance = parseFloat(values.fromBalance) || 0;
                                                        if (totalAmount > fromBalance) {
                                                            return `totalAmount cannot exceed from account balance (₹${fromBalance})`;
                                                        }
                                                        return undefined;
                                                    }}
                                                />
                                                <ErrorMessage name="totalAmount" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>

                                        {/* Narration */}
                                        <div className="mb-4">
                                            <label className="mb-2.5 block text-black dark:text-white">Narration</label>
                                            <Field
                                                as="textarea"
                                                name="narration"
                                                placeholder="Enter narration"
                                                rows="3"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white"
                                            />
                                        </div>

                                        {/* Summary */}
                                        {values.ledgerId && values.destinationLedgerId && values.totalAmount && (
                                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Transaction Summary</h4>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>From: {ledgerOptions.find(opt => opt.value === values.ledgerId)?.label}</div>
                                                    <div>To: {ledgerOptions.find(opt => opt.value === values.destinationLedgerId)?.label}</div>
                                                    <div>totalAmount: ₹{values.totalAmount}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-center mt-6">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex md:w-[220px] w-full justify-center bg-primary p-3 font-medium text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Creating...' : 'Create Contra'}
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

export default CreateContra;