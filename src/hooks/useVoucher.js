import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Voucher_URL, DELETE_Voucher_URL, UPDATE_Voucher_URL, ADD_Voucher_URL } from "../Constants/utils";
import { ADD_VoucherEntry_URL, ADD_VoucherPaymentEntry_URL, ADD_Voucher_URL, DELETE_Voucher_URL, GET_VoucherBYID, GET_Voucher_URL, UPDATEVoucher_URL } from "../Constants/utils";
import { fetchHsnCode } from '../redux/Slice/HsnCodeSlice';
import { useNavigate } from 'react-router-dom';
const useVoucher = (numberingDetails) => {

    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Vouchers, setVoucher] = useState([]);
    const [voucherNos, setvoucherNos] = useState([])
    const [Voucherr, setVoucherr] = useState([]);
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {

        dispatch(fetchHsnCode(token))

    }, []);
    const [currentVoucher, setCurrentVoucher] = useState({


        name: "",

        abbreviation: "",
        actVoucher: "",

        typeOfVoucher: "",

        methodVouchNumbering: "",

        numbInsertDelete: "",

        setAdditionalNumb: "",

        unusedVchNos: "",

        dateForVchs: "",

        zeroTransactionAllowed: "",

        optionalVchType: "",

        narrationVchs: "",

        narratLedgerVch: "",

        costPurchase: "",

        whatsAppVch: "",

        defAccounting: "",

        inteCompTransfer: "",
        //     Printing
        printVch: "",

        posInvoicing: "",

        msgPrintOne: "",

        msgPrintTwo: "",

        defaultGodown: {},

        defTitlePrint: "",

        defJurisdiction: "",

        defBank: "",

        setAlterDecl: "",
        //     Statuatory Details

        defGstRegist: "",

        vchNumbGstRegistration: "",


        gstDetails: "",
        productStatus: "",
        gstratedetails: "",

        hsnCodes: "",
        hsnCode: {},

        hsn_Sac: "",

        gstDescription: "",

        taxationType: "",

        gstRate: "",

    });

    const nature = [
        { value: '', label: 'Select' },
        { value: 'Income', label: 'Income' },
        { value: 'Liabilities', label: 'Liabilities' },
        { value: 'Assets', label: 'Assets' },
        { value: 'Expenses', label: 'Expenses' },

    ]
    const under = [
        { value: '', label: 'Select' },
        { value: 'Primary', label: 'Primary' },
        { value: 'CapitalAccount', label: 'Capital Account' },


    ]
    const invoice = [
        { value: '', label: 'Select' },
        { value: 'NotApplicable', label: 'NotApplicable' },
        { value: 'AppropriatebyQTY', label: 'AppropriatebyQTY' },
        { value: 'AppropriatebyValue', label: 'AppropriatebyValue' },
    ];






    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const getVoucherr = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${GET_Voucher_URL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // Check if response is OK (status 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle empty response
            const text = await response.text();
            if (!text) {
                throw new Error("Empty response from server");
            }

            const data = JSON.parse(text);
            console.log("Vouchers data:", data);

            // Update state with pagination info if available
            setVoucherr(data.content || []);
            setPagination(prev => ({
                ...prev,
                currentPage: data.number + 1 || 1,
                totalPages: data.totalPages || 1,
                totalItems: data.totalElements || 0
            }));

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.message || "Failed to fetch vouchers");
            setVoucherr([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Usage with pagination






    const GetVoucherById = async (id) => {
        console.log("heere");
        try {
            const response = await fetch(`${GET_VoucherBYID}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await response.json();
            console.log(data + "xsdfghjkl")
            if (response.ok) {
           
                setVoucher(data);
                return data; // Return the fetched data
            } else {
                toast.error(`${data.errorMessage}`);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            return null;
        }
    };

    const handleDelete = async (e, id) => {
        console.log(id, "del");
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_Voucher_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // const data = await response.json();
            if (response.ok) {
                toast.success(`Voucher Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Voucher.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getVoucher(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleUpdate = (e, item) => {
        e.preventDefault();
        setEdit(true);
        setCurrentVoucher(item);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {

        const formData = { ...values, ...numberingDetails }

        console.log(formData, "jj");


        // if (gstDetails && gstDetails.length > 0) {
        //     product.slabBasedRates = gstDetails.map(({ id, ...rest }) => rest);// Add gstDetails to the product
        // }
        // if (values.gstratedetails === "Specify Slab Based Rates") {
        //     product.slabBasedRates = gstDetails.map(({ id, ...rest }) => rest); // Include slab-based rates
        //     delete values.hsnCode; // Remove HSN-related fields if they exist
        //     delete product.igst;
        //     delete product.cgst;
        //     delete product.sgst;
        //     delete product.gstDescription;
        //     delete product.hsn_Sac;
        // } else if (values.gstratedetails === "useGstClassification") {
        //     // Include HSN classification details
        //     product.hsnCode = values.hsnCode;
        //     // product.igst = values.hsnCode?.igst;
        //     // product.cgst = values.hsnCode?.cgst;
        //     // product.sgst = values.hsnCode?.sgst;
        //     product.gstDescription = values.hsnCode?.productDescription;
        //     product.hsn_Sac = values.hsn_Sac;

        //     // Remove slab-based rates if they exist
        //     delete product.slabBasedRates;
        // }
        // console.log(product, "jamshedpur+++++++++++++");

        // const finalresult = {
        //     ...values,  // Spread all form values
        //     ...(product?.slabBasedRates && { slabBasedRates: product.slabBasedRates }) // Conditionally add slabBasedRates
        // };

        // // Remove the product object if it exists
        // delete finalresult.product;

        // console.log(finalresult);
        // console.log(finalresult, "jahahaha++++++++");


        // try {
        //     const url = ADD_Voucher_URL;
        //     const method = "POST";

        //     const response = await fetch(url, {
        //         method: method,
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify(formData)
        //     });

        //     const data = await response.json();
        //     if (response.ok) {
        //         toast.success(`Voucher added successfully`);
        //         // Fetch updated Voucher
        //     } else {
        //         toast.error(`${data.errorMessage}`);
        //     }
        // } catch (error) {
        //     console.error(error, response);
        //     toast.error("An error occurred");
        // } finally {
        //     setSubmitting(false);
        // }
    };









  // In useVoucher.js hook
// In useVoucher.js hook
const handleCreateVoucher = async (values, action = 'save', onSuccess, onError) => {
    // Note: We're not setting loading state here since it's handled by Formik's isSubmitting
    try {
        let url;

        if (values.typeOfVoucher === "Payment") {
            url = `${ADD_VoucherPaymentEntry_URL}/${values.voucherId}/create`;
        } else {
           url = `${ADD_VoucherEntry_URL}?action=save`;
        }

        // Remove formAction from payload
        const { formAction, ...payload } = values;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = { errorMessage: response.statusText || "An error occurred" };
        }

        if (response.ok) {
            const successMessage = action === 'saveAndSync' 
                ? 'Voucher saved and synced successfully!' 
                : 'Voucher saved successfully!';
            toast.success(successMessage);
            
            if (onSuccess) onSuccess();
            
            navigate("/Vouchers/view");
        } else {
            toast.error(data.errorMessage || "Failed to save voucher");
            if (onError) onError(data);
        }
    } catch (error) {
        console.error("Error in handleCreateVoucher:", error);
        toast.error("An error occurred while saving");
        if (onError) onError(error);
    }
    // No finally block needed - Formik handles isSubmitting state
};

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getVoucher(newPage); // API is 0-indexed for pages
    };

    return {
        Vouchers,
        edit,
        currentVoucher,
        pagination,
        handleDelete,
        handleUpdate,
        handleSubmit,
        handlePageChange,
        nature,
        invoice,
        under,
        GetVoucherById,
        getVoucherr,
        Voucherr,
        handleCreateVoucher
    };
};

export default useVoucher;
