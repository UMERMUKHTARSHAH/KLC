import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { SIGNUPURL,ROLESURL } from "../Constants/utils";
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
    const navigate = useNavigate();
    const [Role, setRole] = useState([])
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { token } = currentUser;

    const [FormData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        username: "",
        password: "",
        role:"",
        email:""
    });

    const getRole = async (page) => {
        
        try {
            const response = await fetch(`${ROLESURL}?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data,"data");
            setRole(data);
          
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch Roles");
        }
    };










    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values, "from use");


        const formattedOptions = {
            name: values?.name,
            password: values?.password,
            phoneNumber: values?.phoneNumber,
            address: values?.address,
            email: values?.email,
            roleId: values.role.value , // Ensure role is not null
            username: values?.username,
        };
        console.log(formattedOptions,"heyyy");

        try {
            const url = SIGNUPURL;
            const method = "POST";

            const response = await fetch(url, {
                headers: {
                    "content-type": "application/json"
                },
                method: method,


                body: JSON.stringify(formattedOptions)
            });

            const data = await response.json();
            if (response?.ok) {
                toast.success("User Added Successfully");
                navigate("/auth/viewUsers")



            } else {
                console.log(data,"errorrr");
                const errorMessages = Object.values(data);
                toast.error(`${errorMessages}`);
            }
        } catch (error) {
            console.error(error,"dd");
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };



    return {

        handleSubmit, FormData,getRole,Role

    };
};

export default useSignup;
