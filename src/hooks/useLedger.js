import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import { GET_Ledger_URL, DELETE_Ledger_URL, UPDATE_Ledger_URL, ADD_Ledger_URL } from "../Constants/utils";
import { ADD_Ledger_URL, DELETE_Ledger_URL, GET_Groupss_URL, GET_LEDGERRExpense__URL,GET_LEDGERRENAME__URL, GET_LEDGERR__URL, GET_LEDGER_ID_URL, GET_LEDGER__URL, UPDATE_Ledger_URL, } from "../Constants/utils";
import { useNavigate, useNavigation } from 'react-router-dom';
const useLedger = () => {
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;
    const [Group, setGroup] = useState([])
    const navigate= useNavigate()
    const [Ledger, setLedger] = useState([]);
    const [LedgerIncome, setLedgerIncome] = useState([])

    const [ledgerName, setledgerName] = useState([])

    const [edit, setEdit] = useState(false);
    const [currentLedger, setCurrentLedger] = useState({
       groupName:"",
       subGroup:[],
       natureOfGroup:"",
       under:"",
       allocatePurchaseInvoice:"",
       calculation:"",
       balanceReporting:"",
       subLedgerGroup:"",
       affectGrossProfit:""
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
      

    const [pagination, setPagination] = useState({
        totalItems: 0,
        data: [],
        totalPages: 0,
        currentPage: 1,
        itemsPerPage:0
    });

    // useEffect(() => {
    //     getLedger(pagination.currentPage);
    // }, []);

    const getLedger = async (page) => {
        try {
            const response = await fetch(`${GET_LEDGERR__URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            
           
            setLedger(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        }
    };


     const getLedgerIncome = async (page) => {
        try {
            const response = await fetch(`${GET_LEDGERRExpense__URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            
           console.log(data,"222222222222222222222222222222222222222222.");
           
            setLedgerIncome(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        }
    };


         const getLedgerName = async () => {
        try {
            const response = await fetch(`${GET_LEDGERRENAME__URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();

       
            
            
         
            setledgerName(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Ledger");
        }
    };
   
    



    const getGroup = async (page) => {
        try {
            const response = await fetch(`${GET_Groupss_URL}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"groupppsss+++");
            setGroup(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch group");
        }
    };




    const handleDelete = async (e, id) => {
        console.log(id,"del");
        e.preventDefault();
        try {
            const response = await fetch(`${DELETE_Ledger_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // const data = await response.json();
            if (response.ok) {
                toast.success(`Ledger Deleted Successfully !!`);

                // Check if the current page becomes empty
                const isCurrentPageEmpty = Ledger.length === 1;

                if (isCurrentPageEmpty && pagination.currentPage > 1) {
                    const previousPage = pagination.currentPage - 1;
                    handlePageChange(previousPage);
                } else {
                    getLedger(pagination.currentPage);
                }
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleUpdateSubmit = async (values,id) => {
        console.log(values,id,"+++++++++++++++++kk");
        try {
            const url =  `${UPDATE_Ledger_URL}/${id}` ;
            const method =  "PUT" 

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Ledger updated successfully`);
                navigate("/ledger/view")
               
              
                
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error, response);
            toast.error("An error occurred");
        }
    };
    const handleUpdateSubmitt = async (values,id) => {
        console.log(values,id,"+++++++++++++++++kk");
        try {
            const url =  `${UPDATE_Ledger_URL}/${id}` ;
            const method =  "PUT" 

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Ledger updated successfully`);
                navigate("/ledger/view")
               
              
                
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error, response);
            toast.error("An error occurred");
        }
    };
  


    const handleSubmit = async (values,  resetForm ) => {
        console.log(values,"kk");
        try {
            const url =  ADD_Ledger_URL;
            const method =  "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`Ledger'added successfully`);
                navigate("/ledger/view")
                // resetForm();
                // setEdit(false);
             
                 // Fetch updated Ledger
            } else {
                toast.error(`${data.errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            // toast.error("An error occurred");
        } finally {
            //   toast.error("An error occurred");
           
        }
    };

    const handlePageChange = (newPage) => {

        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        getLedger(newPage); // API is 0-indexed for pages
    };

    return {
        Ledger,
        edit,
        currentLedger,
        pagination,
        handleDelete,
        getLedger,
        handleSubmit,
        handlePageChange,
        nature,
        invoice,
        under,
        getGroup,
        Group,
        handleUpdateSubmit,
        handleUpdateSubmitt,
        LedgerIncome,
        getLedgerIncome,
        getLedgerName,
        ledgerName
    };
};

export default useLedger;
