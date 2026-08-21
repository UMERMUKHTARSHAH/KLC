import React, { useEffect, useRef, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ErrorMessage, Field, Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_IMAGE, GET_PRODUCTBYID_URL, UPDATE_PRODUCT_URL, VIEW_ORDERPRODUCT_ALL } from '../../Constants/utils';
import { useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { customStyles as createCustomStyles } from '../../Constants/utils';
import useProduct from '../../hooks/useProduct';
import { toast } from 'react-toastify';




const ViewKaniProducts = () => {


    const productIdField = "";

    const [product, setProduct] = useState(null);

    const [productSuppliers, setproductSuppliers] = useState([])
    // To store fetched product data
    const [colorGroupOptions, setColorGroupOptions] = useState([]); // Color group options for ReactSelect
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const theme = useSelector(state => state?.persisted?.theme);
    const customStyles = createCustomStyles(theme?.mode);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const [unitOptions, setunitOptions] = useState([])
    const colorGroup = useSelector(state => state?.persisted?.color);
    const design = useSelector(state => state?.persisted?.design); const [designOptions, setdesignOptions] = useState([])
    const [styleOptions, setstyleOptions] = useState([])
    const [sizeOptions, setsizeOptions] = useState([])
    const style = useSelector(state => state?.persisted?.style);
    const size = useSelector(state => state?.persisted?.size);
    const [productCategoryOptions, setproductCategoryOptions] = useState([]);
    const [hsnOptions, sethsnOptions] = useState([]);
    const productCategory = useSelector(state => state?.persisted?.productCategory);
    const hsnCode = useSelector(state => state?.persisted?.hsn);
    const [supplierNameOptions, setsupplierNameOptions] = useState([])
    const [supplierCodeOptions, setsupplierCodeOptions] = useState([])
    const supplier = useSelector(state => state?.nonPersisted?.supplier);
    const [productGroupOption, setproductGroupOption] = useState([])
    const [gstDetailModal, setgstDetailModal] = useState(false)
    const productGroup = useSelector(state => state?.persisted?.productGroup);
    const [vaaluee, setvaaluee] = useState({})

    const [referenceImages, setrefImage] = useState({})
    const [actualImages, setactualImage] = useState({})
    const navigate = useNavigate(); // Initialize navigate


    const [previews, setPreviews] = useState([]);
    const [previewsActual, setPreviewsActual] = useState([]);
    const [gstDetails, setgstDetails] = useState([])

    const { token } = currentUser;
    const { id } = useParams();
    const productId = id;

    // Runs only once when the component mounts



    const getProductById = async () => {
        try {
            const response = await fetch(`${VIEW_ORDERPRODUCT_ALL}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }

            const data = await response.json();

            console.log(data, "giu");
            setProduct(data?.products);
            setproductSuppliers(data?.productSuppliers) // Store fetched product
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setIsLoading(false); // Stop loader
        }
    };
    console.log(product, 'hloooooo')

    // Fetch data when component mounts
    useEffect(() => {
        getProductById();
    }, [id]);

    // Prepare color group options
    useEffect(() => {
        if (colorGroup.data) {
            const formattedOptions = colorGroup.data.map((color) => ({
                value: color.id,
                label: color.colorName,
                colorGroupObject: color,
                color: { id: color.id }
            }));
            setColorGroupOptions(formattedOptions);
        }
    }, [colorGroup]);
    useEffect(() => {
        if (productCategory.data) {
            const formattedOptions = productCategory.data.map(prodCat => ({
                value: prodCat.id,
                label: prodCat?.productCategoryName,
                productCategoryObject: prodCat,
                productCategoryid: { id: prodCat.id },

            }));
            setproductCategoryOptions(formattedOptions);
        }
    }, [productCategory]);
    useEffect(() => {
        if (hsnCode.data) {
            const formattedOptions = hsnCode.data.map(hsn => ({
                value: hsn.id,
                label: hsn?.hsnCodeName,
                hsnObject: hsn,
                hsnCode: { id: hsn.id }
            }));
            sethsnOptions(formattedOptions);
        }
    }, [hsnCode]);
    useEffect(() => {
        if (design.data) {
            const formattedOptions = design.data.map(design => ({
                value: design.id,
                label: design?.designName,
                designObject: design,
                designid: { id: design.id }
            }));
            setdesignOptions(formattedOptions);
        }
    }, [design]);
    useEffect(() => {
        if (style.data) {
            const formattedOptions = style.data.map(style => ({
                value: style.id,
                label: style?.stylesName,
                styleObject: style,
                styleid: { id: style.id }
            }));
            setstyleOptions(formattedOptions);
        }
    }, [style]);
    useEffect(() => {
        if (size.data) {
            const formattedOptions = size.data.map(size => ({
                value: size.id,
                label: size?.sizeName,
                sizeObject: size,
                sizeid: { id: size.id }
            }));
            setsizeOptions(formattedOptions);
        }
    }, [size]);

    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.name,
                supplierNameObject: supp,
                suplierid: { id: supp.id }
            }));
            setsupplierNameOptions(formattedOptions);
        }
    }, [supplier.data]);
    useEffect(() => {
        if (supplier.data) {
            const formattedOptions = supplier.data.map(supp => ({
                value: supp.id,
                label: supp?.supplierCode,
                supplierCodeObject: supp,
                suplieridd: { id: supp.id }
            }));
            setsupplierCodeOptions(formattedOptions);
        }
    }, [supplier.data]);
    // useEffect(() => {
    //     if (supplier.data) {
    //         const formattedOptions = supplier.data.map(supp => ({
    //             value: supp.id,
    //             label: supp?.supplierCode,
    //             supplierCodeObject: supp,
    //             suplieridd: { id: supp.id }
    //         }));
    //         setsupplierCodeOptions(formattedOptions);
    //     }
    // }, [supplier.data]);
    const formikRef = useRef(null);


    useEffect(() => {
        if (productGroup?.data && Array.isArray(productGroup.data)) {
            const formattedOptions = productGroup.data.map(product => ({
                value: product.id,
                label: product.productGroupName,
                productGroupObject: product,
            }));
            setproductGroupOption(formattedOptions);
        } else {
            setproductGroupOption([]); // Clear options if data is unavailable
        }
    }, [productGroup]);


    const gstOptions = [

        { value: 'Applicable', label: 'Applicable' },
        { value: 'NotApplicable', label: 'NotApplicable' },

    ]
    const supplyType = [

        { value: 'Goods', label: 'Goods' },
        { value: 'Service', label: 'Service' },
        { value: 'capital Goods', label: 'capital Goods' },
    ]

    const gstdetails = [

        { value: 'specifySlabBasedRates', label: 'Specify Slab Based Rates' },
        { value: 'useGstClassification', label: 'Use Gst Classification' },

    ]



    // Show loader until product data is fetched
    if (isLoading) {
        return <div>Loading...</div>;
    }







    const handlerateDetails = (option, setFieldValue) => {
        console.log(option, "optoooon");
        setFieldValue('gstratedetails', option.value);
        if (option.value === "specifySlabBasedRates") {

            setgstDetailModal(true)
        }

    }

    console.log(product, "brocode");
    console.log(productGroupOption, "codeeeee");


    const handleModalSubmit = (newValues) => {
        console.log(newValues, "Submitted GST Rates");

        // Retrieve the current slabBasedRates from Formik
        const currentValues = formikRef.current.values.slabBasedRates || [];

        // Merge current values with only the truly new rows
        const updatedValues = [...currentValues, ...newValues.filter(row => !currentValues.some(existing => existing.id === row.id))];

        // Update Formik's field value with the deduplicated array
        formikRef.current.setFieldValue('slabBasedRates', updatedValues);

        setgstDetailModal(false); // Close the modal
    };



    console.log(productSuppliers, "prodyuuuuuuuuuuuuuuuuuuuuuuct");


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Products / ViewProduct" />
            <div>
                <Formik
                    innerRef={formikRef}
                    enableReinitialize // Update initial values when product data changes
                    initialValues={{
                        ...product,
                        // id: product?.id || "",
                        productGroup: product?.productGroup,
                        colors: product?.colors || { id: 0 },
                        // colors: product?.colors?.id || '',

                        productCategory: product?.productCategory || { id: 0 },
                        hsnCode: product?.hsnCode || { id: 0 },
                        design: product?.design || { id: 0 },
                        styles: product?.styles || { id: 0 },
                        sizes: product?.sizes || { id: 1, sizeName: "3l" },
                        gstDetails: product?.gstDetails || [],
                        hsnCodes: product?.hsnCodes || '',
                        hsn_Sac: product?.hsn_Sac || '',
                        gstDescription: product?.gstDescription || '',
                        taxationType: product?.taxationType || '',
                        gstRate: product?.gstRate || '',
                        typeOfSupply: product?.typeOfSupply || '',
                        productId: product?.productId || '',
                        colorName: product?.colorName || '',
                        barcode: product?.barcode || '',
                        finishedWeight: product?.finishedWeight || '',
                        materialWeight: product?.materialWeight || '',
                        warpColors: product?.warpColors || '',
                        weftColors: product?.weftColors || '',
                        weave: product?.weave || '',
                        warpYarn: product?.warpYarn || '',
                        weftYarn: product?.weftYarn || '',
                        gstratedetails: product?.gstratedetails || '',
                        pixAndReed: product?.pixAndReed || '',
                        // units: product?.units || '',
                        cost: product?.cost || '',
                        mrp: product?.mrp || '',
                        dyeingCost: product?.dyeingCost || '',
                        wholesalePrice: product?.wholesalePrice || '',
                        usdPrice: product?.usdPrice || '',
                        euroPrice: product?.euroPrice || '',
                        gbpPrice: product?.gbpPrice || '',
                        rmbPrice: product?.rmbPrice || '',
                        productDescription: product?.productDescription || '',
                        baseColour: product?.baseColour || '',
                        kaniColors: product?.kaniColors || '',
                        fabricWeave: product?.fabricWeave || '',
                        fabricCode: product?.fabricCode || '',
                        fabricCost: product?.fabricCost || '',
                        productStatus: product?.productStatus || '',
                        supplier: productSuppliers,
                        // supplierCode: product?.supplierCode || { id: 0 },
                        embroideryCost: product?.embroideryCost || '',
                        totalCost: product?.totalCost || '',
                        slabBasedRates: product?.slabBasedRates || [],
                        unit: product.unit || { id: 0 },
                        supplierCode: product.supplierCode || { id: 0 }

                        // igst :vaaluee?.hsnCode?.igst ??product?.hsnCode?.igst ??  '',
                        // cgst :vaaluee?.hsnCode?.cgst ?? product?.hsnCode?.cgst ?? '',
                        // sgst :vaaluee?.hsnCode?.sgst ??product?.hsnCode?.sgst ??  '',
                        // productDescriptionn : vaaluee?.hsnCode?.productDescription ?? product?.hsnCode?.productDescription ??''








                    }}
                    validate={values => {

                        const errors = {};

                        if (values) {


                            setvaaluee(values)
                            // setFieldValue('productId', productIdField);
                        }
                        return errors;


                    }}
                // onSubmit={(values) => {
                //     console.log('Submitted values:', values);
                //     // Add API call for updating the product here
                // }}
                // onSubmit={onSubmit}
                // onSubmit={handleUpdateSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <form>
                            <div className="flex flex-col gap-9">
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                        <h3 className="font-medium text-slate-500 text-center text-xl dark:text-white">
                                            View Production Dashboard
                                        </h3>
                                    </div>
                                    <div className="p-6.5">
                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            {/* Product Group Field */}

                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">Product Group <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className="bg-white dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="productGroup"
                                                        value={productGroupOption?.find(option => option.value === values?.productGroup?.id) || null}

                                                        options={productGroupOption}
                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Product Group"
                                                        isDisabled={true}  // This makes the select readonly
                                                    />
                                                </div>
                                            </div>


                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">
                                                    Color Group <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span>
                                                </label>
                                                <div className="z-20 bg-transparent dark:bg-form-field">
                                                    <ReactSelect
                                                        isDisabled={true}
                                                        name="colors"
                                                        value={
                                                            colorGroupOptions.find(option => option.value === values.colors?.id) || null
                                                        } // Match the current value
                                                        // onChange={(option) => {
                                                        //     setFieldValue(
                                                        //         'colors',
                                                        //         option
                                                        //             ? { id: option.value, colorName: option.label }
                                                        //             : null
                                                        //     ); // Update the formik state
                                                        // }}
                                                        onChange={(option) => setFieldValue('colors', option ? option.color : null)}
                                                        options={colorGroupOptions}
                                                        styles={customStyles} // Apply custom styles
                                                        className="bg-white dark:bg-form-field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Color Group" // Static placeholder
                                                    />
                                                </div>
                                            </div>


                                        </div>

                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Category <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect

                                                        name="productCategory"
                                                        value={productCategoryOptions?.find(option => option.value === values.productCategory?.id) || null}

                                                        options={productCategoryOptions}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Product Category"
                                                        isDisabled={true}  // This makes the select readonly

                                                    />


                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> HSN Codee <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <ReactSelect
                                                    name="hsnCode"
                                                    value={hsnOptions?.find(option => option.value === values.hsnCode?.id) || null}
                                                    // onChange={(option) => setFieldValue('supplier', option ? option.suplierid : null)}

                                                    options={hsnOptions}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Hsn Code"
                                                    isDisabled={true}


                                                />
                                            </div>
                                        </div>



                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            {/* GST DETAILS Select */}
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white">GST DETAILS</label>
                                                <div className="z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="gstDetails"
                                                        options={gstOptions}
                                                        value={gstOptions.find(option => option.value === values.gstDetails)}

                                                        styles={customStyles}
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select GST details"
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>

                                            {/* Conditional Fields based on gstDetails */}
                                            {values.gstDetails === "Applicable" && (
                                                <>
                                                    {/* HSN Codes Field */}


                                                    {/* HSN/SAC Field */}
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">HSN/SAC</label>
                                                        <Field
                                                            readOnly
                                                            name="hsn_Sac"
                                                            type="text"
                                                            placeholder="Enter HSN/SAC"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    {/* GST Description Field */}
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                        <Field
                                                            readOnly
                                                            name="gstDescription"
                                                            type="text"
                                                            placeholder="Enter GST Description"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    {/* Taxation Type Field */}
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Taxation Type</label>
                                                        <Field
                                                            readOnly
                                                            name="taxationType"
                                                            type="text"
                                                            placeholder="Enter Taxation Type"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    {/* GST Rate Field */}
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">GST Rate</label>
                                                        <Field
                                                            readOnly
                                                            name="gstRate"
                                                            type="number"
                                                            placeholder="Enter GST Rate"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    {/* Type of Supply Field */}
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Type of Supply</label>
                                                        <Field
                                                            readOnly
                                                            name="typeOfSupply"
                                                            type="text"
                                                            placeholder="Enter Type of Supply"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Design Name  <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="design"
                                                        value={designOptions?.find(option => option.value === values.design?.id) || null}

                                                        options={designOptions}
                                                        styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Design"
                                                        isDisabled={true}  // This makes the select readonly

                                                    />

                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Color Name <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <Field
                                                    name='colorName'
                                                    type="text"
                                                    placeholder="Enter your Color name"

                                                    readOnly // Make the field read-only

                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Style <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="styles"
                                                        value={styleOptions?.find(option => option.value === values.styles?.id) || null}

                                                        options={styleOptions}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,  // Set high z-index to make sure the dropdown appears above other components
                                                            }),
                                                        }} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Style"
                                                        isDisabled={true}  // This makes the select readonly

                                                    />

                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Size(in cms) <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                <div className="relative z-20 bg-transparent dark:bg-form-Field">
                                                    <ReactSelect
                                                        name="sizes"
                                                        value={sizeOptions?.find(option => option.value === values.sizes?.id) || null}

                                                        options={sizeOptions}
                                                        styles={{
                                                            ...customStyles,
                                                            menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,  // Set high z-index to make sure the dropdown appears above other components
                                                            }),
                                                        }}
                                                        // styles={customStyles} // Pass custom styles here
                                                        className="bg-white dark:bg-form-Field"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Size"
                                                        isDisabled={true}  // This makes the select readonly

                                                    />

                                                </div>
                                            </div>
                                        </div>


                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Product Id </label>
                                                <Field

                                                    name='productId'
                                                    type="text"
                                                    placeholder="Enter Product id"
                                                    value={values.productId}
                                                    readOnly
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Barcode</label>
                                                <Field
                                                    readOnly
                                                    name='barcode'
                                                    type="text"
                                                    placeholder="Enter Barcode"
                                                    // value={product.barcode}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>




                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Finished Weight </label>
                                                <Field
                                                    readOnly
                                                    name='finishedWeight'
                                                    type="number"
                                                    placeholder="Enter Finished Weight"
                                                    value={values.finishedWeight}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[300px]">
                                                <label className="mb-2.5 block text-black dark:text-white"> Material Weight</label>
                                                <Field
                                                    readOnly
                                                    name='materialWeight'
                                                    type="numer"
                                                    placeholder="Enter material Weight"
                                                    value={values.materialWeight}
                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        {product.productGroup?.productGroupName === "Contemporary Pashmina" && (
                                            <>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Warp Colors
                                                        </label>
                                                        <Field
                                                            readOnly
                                                            name="warpColors"
                                                            type="text"
                                                            placeholder="Enter Warp Colors"
                                                            value={values.warpColors}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Weft Colors
                                                        </label>
                                                        <Field
                                                            readOnly
                                                            name="weftColors"
                                                            type="text"
                                                            placeholder="Enter Weft Colors"
                                                            value={values.weftColors}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white dark:border-form-strokedark dark:bg-form-field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>



                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wave </label>
                                                        <Field
                                                            readOnly
                                                            name='weave'
                                                            type="text"
                                                            placeholder="Enter Wave"
                                                            value={values.weave}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Warp Yarn</label>
                                                        <Field
                                                            readOnly
                                                            name='warpYarn'
                                                            type="text"
                                                            placeholder="Enter Warp Yarn"
                                                            value={values.warpYarn}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Weft Yarn</label>
                                                        <Field
                                                            readOnly
                                                            name='weftYarn'
                                                            type="text"
                                                            placeholder="Enter Weft Yarn"
                                                            value={values.weftYarn}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                        <Field
                                                            readOnly
                                                            name='cost'
                                                            type="text"
                                                            placeholder="Enter Cost Price"
                                                            value={values.cost}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter Mrp"
                                                            value={values.mrp}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            value={values.dyeingCost}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wholesale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale Price"
                                                            value={values.wholesalePrice}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter Usd price"
                                                            value={values.usdPrice}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> EURO Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            value={values.euroPrice}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-2 min-w-[200px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter Gbp Price"
                                                            value={values.gbpPrice}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-2 min-w-[200px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter Rmb Price"
                                                            value={values.rmbPrice}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>

                                                    <div className="flex-2 min-w-[200px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}
                                                                isDisabled={true}
                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"
                                                            />

                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}



                                        {product.productGroup?.productGroupName === "Kani" && (
                                            <>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Base Color </label>
                                                        <Field
                                                            readOnly
                                                            name='baseColour'
                                                            type="text"
                                                            placeholder="Enter Base Color"
                                                            value={values.baseColour}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Kani Colors</label>
                                                        <Field
                                                            readOnly
                                                            name='kaniColors'
                                                            type="text"
                                                            placeholder="Enter Kani Colors"
                                                            value={values.kaniColors}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">

                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}

                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"
                                                                isDisabled={true}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                        <Field
                                                            readOnly
                                                            name='cost'
                                                            type="text"
                                                            placeholder="Enter Cost Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter Mrp"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> WholeSale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale PRice"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter Usd Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Euro Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter Gbp Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter Rmb Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Conditionally render the fields based on the selected product group */}
                                        {product.productGroup?.productGroupName === "Pashmina Embroidery" && (

                                            <>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                        <Field
                                                            readOnly
                                                            name="baseColour"
                                                            type="text"
                                                            placeholder="Enter Base Color"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Embroidery Colors</label>
                                                        <Field
                                                            readOnly
                                                            name="embroideryColors"
                                                            type="text"
                                                            placeholder="Enter Embroidery Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>





                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Wave </label>
                                                        <Field
                                                            readOnly
                                                            name='fabricWeave'
                                                            type="text"
                                                            placeholder="Enter Fabric Wave"
                                                            value={values.fabricWeave}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Code</label>
                                                        <Field
                                                            readOnly
                                                            name='fabricCode'
                                                            type="text"
                                                            placeholder="Enter Fabric Code "
                                                            value={values.fabricCode}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>




                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='fabricCost'
                                                            type="text"
                                                            placeholder="Enter Fabric Cost"
                                                            value={values.fabricCost}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Embroidery Cost</label>
                                                        <Field
                                                            readOnly
                                                            name='embroideryCost'
                                                            type="text"
                                                            placeholder="Enter Embroidery Cost"
                                                            value={values.embroideryCost}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>




                                                <div className="mb-4.5 flex flex-wrap gap-6">

                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}

                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"
                                                                isDisabled={true}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Total Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='totalCost'
                                                            type="text"
                                                            placeholder="Enter Total Cost"
                                                            value={values.totalCost}
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter Mrp"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wholesale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter Usd Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Euro Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter Gbp Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter Rmb Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                            </>
                                        )}

                                        {product.productGroup?.productGroupName === "Contemporary Wool" && (
                                            <>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Warp Colors </label>
                                                        <Field
                                                            readOnly
                                                            name='warpColors'
                                                            type="text"
                                                            placeholder="Enter Warp Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Weft Colors</label>
                                                        <Field
                                                            readOnly
                                                            name='weftColors'
                                                            type="text"
                                                            placeholder="Enter Weft Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wave </label>
                                                        <Field
                                                            readOnly
                                                            name='weave'
                                                            type="text"
                                                            placeholder="Enter Wave"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Warp Yarn</label>
                                                        <Field
                                                            readOnly
                                                            name='warpYarn'
                                                            type="text"
                                                            placeholder="Enter Warp Yarn"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Weft Yarn</label>
                                                        <Field
                                                            readOnly
                                                            name='weftYarn'
                                                            type="text"
                                                            placeholder="Enter Weft Yarn"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">



                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}

                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"
                                                                isDisabled={true}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                        <Field
                                                            readOnly
                                                            name='cost'
                                                            type="text"
                                                            placeholder="Enter Cost Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter Mrp"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wholesale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter Usd Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> EURO Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter Gbp Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter Rmb Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}




                                        {/* Wool Embroidery */}

                                        {product.productGroup?.productGroupName === "Wool Embroidery" && (

                                            <>
                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                        <Field
                                                            readOnly
                                                            name="baseColour"
                                                            type="text"
                                                            placeholder="Enter Base Color"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Embroidery Colors</label>
                                                        <Field
                                                            readOnly
                                                            name="embroideryColors"
                                                            type="text"
                                                            placeholder="Enter Embroidery Colors"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>






                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Wave </label>
                                                        <Field
                                                            readOnly
                                                            name='fabricWeave'
                                                            type="text"
                                                            placeholder="Enter Fabric Wave"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Code</label>
                                                        <Field
                                                            readOnly
                                                            name='fabricCode'
                                                            type="text"
                                                            placeholder="Enter Fabric Code"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>




                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Fabric Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='fabricWeave'
                                                            type="text"
                                                            placeholder="Enter Fabric Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Embroidery Cost</label>
                                                        <Field
                                                            readOnly
                                                            name='fabricCode'
                                                            type="text"
                                                            placeholder="Enter Embroidery Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>




                                                <div className="mb-4.5 flex flex-wrap gap-6">

                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}

                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-white dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"
                                                                isDisabled={true}
                                                            />

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Total Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='totalCost'
                                                            type="text"
                                                            placeholder="Enter Total Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter MRP"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wholesale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter USD Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Euro Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter GBP Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter RMB Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {/* Papier Machie */}

                                        {product.productGroup?.productGroupName === "Papier Machie" && (

                                            <>

                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Base Color</label>
                                                        <Field
                                                            readOnly
                                                            name="baseColour"
                                                            type="text"
                                                            placeholder="Enter Base Color"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white">Pattern Color</label>
                                                        <Field
                                                            readOnly
                                                            name="patternColor"
                                                            type="text"
                                                            placeholder="Enter Pattern Color"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>















                                                <div className="mb-4.5 flex flex-wrap gap-6">

                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Units <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                                        <div className=" z-20 bg-transparent dark:bg-form-Field">
                                                            <ReactSelect
                                                                isDisabled={true}
                                                                name="unit"
                                                                value={unitOptions?.find(option => option.value === values.unit?.id) || null}

                                                                options={unitOptions}
                                                                styles={customStyles} // Pass custom styles here
                                                                className="bg-graydark dark:bg-form-Field"
                                                                classNamePrefix="react-select"
                                                                placeholder="Select Color Group"

                                                            />

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Cost Price </label>
                                                        <Field
                                                            readOnly
                                                            name='cost'
                                                            type="text"
                                                            placeholder="Enter Cost Price "
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> MRP</label>
                                                        <Field
                                                            readOnly
                                                            name='mrp'
                                                            type="text"
                                                            placeholder="Enter MRP"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Dyeing Cost </label>
                                                        <Field
                                                            readOnly
                                                            name='dyeingCost'
                                                            type="text"
                                                            placeholder="Enter Dyeing Cost"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Wholesale Price</label>
                                                        <Field
                                                            readOnly
                                                            name='wholesalePrice'
                                                            type="text"
                                                            placeholder="Enter Wholesale Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> USD Price </label>
                                                        <Field
                                                            readOnly
                                                            name='usdPrice'
                                                            type="text"
                                                            placeholder="Enter USD Price "
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> Euro Price</label>
                                                        <Field
                                                            readOnly
                                                            name='euroPrice'
                                                            type="text"
                                                            placeholder="Enter Euro Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                                <div className="mb-4.5 flex flex-wrap gap-6">
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> GBP Price </label>
                                                        <Field
                                                            readOnly
                                                            name='gbpPrice'
                                                            type="text"
                                                            placeholder="Enter GBP Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-[300px]">
                                                        <label className="mb-2.5 block text-black dark:text-white"> RMB Price</label>
                                                        <Field
                                                            readOnly
                                                            name='rmbPrice'
                                                            type="text"
                                                            placeholder="Enter RMB Price"
                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                        />
                                                    </div>
                                                </div>


                                            </>
                                        )}




                                        <div className="mb-6">
                                            <label className="mb-2.5 block text-black dark:text-white"> Product Description </label>
                                            <textarea
                                                name='productDescription'
                                                rows={6}
                                                placeholder="Type your message"
                                                value={values.productDescription}
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                            ></textarea>
                                        </div>




                                        {product.gstDetails === "Applicable" && (
                                            <>

                                                <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold'>Statutory Details</h1>


                                                <div className="flex flex-wrap gap-4">
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
                                                                isDisabled={true}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* GST RATE DETAILS Section (Conditional) */}
                                                    {product.gstDetails === "Applicable" && (

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

                                                                isDisabled={true}
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
                                                            {values.gstratedetails === "specifySlabBasedRates" ? (

                                                                // Render GST Details Section
                                                                <div className="flex flex-wrap gap-6">
                                                                    {Array.isArray(values.slabBasedRates) &&
                                                                        values.slabBasedRates.map((gst, index) => (
                                                                            <div key={index} className="mb-4.5 flex flex-wrap gap-6">
                                                                                <div className="flex-2 min-w-[100px]">
                                                                                    <label className="mb-2.5 block text-black dark:text-white">Greater Than</label>
                                                                                    <Field
                                                                                        readOnly
                                                                                        name={`slabBasedRates[${index}].greaterThan`}
                                                                                        type="text"
                                                                                        placeholder="Enter Greater Than Value"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-2 min-w-[100px]">
                                                                                    <label className="mb-2.5 block text-black dark:text-white">Upto</label>
                                                                                    <Field
                                                                                        readOnly
                                                                                        name={`slabBasedRates[${index}].upTo`}
                                                                                        type="text"
                                                                                        value={gst.upTo}
                                                                                        placeholder="Upto"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-2 min-w-[100px]">
                                                                                    <label className="mb-2.5 block text-black dark:text-white">Type</label>
                                                                                    <Field
                                                                                        readOnly
                                                                                        name={`slabBasedRates[${index}].type`}
                                                                                        type="text"
                                                                                        value={gst.type}
                                                                                        placeholder="Type"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-2 min-w-[100px]">
                                                                                    <label className="mb-2.5 block text-black dark:text-white">Rate</label>
                                                                                    <Field
                                                                                        readOnly
                                                                                        name={`slabBasedRates[${index}].gstRate`}
                                                                                        type="text"
                                                                                        value={gst.gstRate}
                                                                                        placeholder="Rate"
                                                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            ) : values.gstratedetails === "useGstClassification" ? (
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
                                                                            isDisabled={true}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">IGST (%)</label>
                                                                        <Field
                                                                            readOnly
                                                                            type="number"
                                                                            value={product?.hsnCode?.igst ?? vaaluee?.hsnCode?.igst ?? ''}
                                                                            disabled
                                                                            placeholder="Enter IGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="igst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">CGST (%)</label>
                                                                        <Field
                                                                            readOnly
                                                                            type="number"
                                                                            value={vaaluee?.hsnCode?.cgst ?? product?.hsnCode?.cgst ?? ''}
                                                                            disabled
                                                                            placeholder="Enter CGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="cgst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">SGST (%)</label>
                                                                        <Field
                                                                            readOnly
                                                                            type="number"
                                                                            value={vaaluee?.hsnCode?.sgst ?? product?.hsnCode?.sgst ?? ''}
                                                                            disabled
                                                                            placeholder="Enter SGST Name"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:disabled:bg-slate-600 dark:text-white dark:focus:border-primary"
                                                                        />
                                                                        <ErrorMessage name="sgst" component="div" className="text-red-500" />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">GST Description</label>
                                                                        <Field
                                                                            readOnly
                                                                            name="gstDescription"
                                                                            value={vaaluee?.hsnCode?.productDescription ?? product?.hsnCode?.productDescription ?? ''}
                                                                            type="text"
                                                                            placeholder="Enter GST Description"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-2 min-w-[250px]">
                                                                        <label className="mb-2.5 block text-black dark:text-white">HSN/SAC</label>
                                                                        <Field
                                                                            readOnly
                                                                            name="hsn_Sac"
                                                                            type="text"
                                                                            placeholder="Enter HSN/SAC"
                                                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>



















                                                        <h1 className='text-center text-xl mt-[40px] mb-[40px] font-semibold '>GST Rate & Related Details </h1>
                                                        <div className="mb-4.5 flex flex-wrap gap-6">






                                                            {/* Taxation Type Field */}
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">Taxation Type</label>
                                                                <Field
                                                                    name="taxationType"
                                                                    type="text"
                                                                    placeholder="Enter Taxation Type"
                                                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                                />
                                                            </div>

                                                            {/* GST Rate Field */}


                                                            {/* Type of Supply Field */}
                                                            <div className="flex-2 min-w-[250px]">
                                                                <label className="mb-2.5 block text-black dark:text-white">Type of Supply</label>


                                                                <ReactSelect
                                                                    isDisabled={true}
                                                                    name="typeOfSupply"
                                                                    options={supplyType}
                                                                    value={supplyType.find(option => option.value === values.typeOfSupply)}
                                                                    onChange={(option) => setFieldValue("typeOfSupply", option?.value)}
                                                                    styles={customStyles}

                                                                    placeholder="Enter Type of Supply"

                                                                />

                                                            </div>
                                                        </div>
                                                    </>

                                                </div>




                                            </>



                                        )




                                        }













                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            <div className="flex flex-col space-y-4">
                                                {/* Upload Field */}
                                                <div className="flex-1 min-w-[400px] max-w-[600px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Reference Image <span className="text-meta-1">*</span>
                                                    </label>
                                                    <div className="relative w-full">
                                                        <Field
                                                            name="refrenceImage"
                                                            type="file"
                                                            //multiple={false}
                                                            multiple // Allow multiple files
                                                            accept="image/*"

                                                            className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px] border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border p-3 border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <p>
                                                                <span className="text-primary">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="mt-1.5"> PNG, JPG or GIF(Less Than 5 mb)</p>
                                                            <p>(max, 800 X 800px)</p>
                                                        </div>
                                                    </div>
                                                </div>





                                                <div className="mt-4">


                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Image Previews
                                                    </label>


                                                    <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                                                        {/* Grid Layout */}
                                                        <div className="flex flex-col grid-cols-3">

                                                            <div className="flex flex-row gap-4 ">
                                                                {/* Image Preview */}
                                                                {product?.images.map((ref) => (
                                                                    <>
                                                                        {
                                                                            ref.referenceImage != null &&

                                                                            <img
                                                                                className="h-20 w-20  transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                                                                crossOrigin="use-credentials"
                                                                                src={`${GET_IMAGE}/products/getimages/${ref.referenceImage}`}
                                                                                alt="Product Image"
                                                                            />
                                                                        }
                                                                    </>
                                                                ))}
                                                                {/* Cancel Button */}
                                                                <button
                                                                    // onClick={() => handleRemoveImage(index)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>





                                                </div>




                                                {previews.length > 0 && (
                                                    <div className="mt-4">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            New Image Previews
                                                        </label>
                                                        {/* Box Wrapper */}
                                                        <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark">
                                                            {/* Grid Layout */}
                                                            <div className="grid grid-cols-3 gap-4">
                                                                {previews.map((preview, index) => (
                                                                    <div key={index} className="relative group">
                                                                        {/* Image Preview */}
                                                                        <img
                                                                            src={preview.url}
                                                                            alt={`Preview ${index + 1}`}
                                                                            className="h-20 border rounded object-cover min-w-[100px] max-w-[100px] transition-transform duration-200 hover:scale-110"
                                                                        />
                                                                        {/* Cancel Button */}
                                                                        <button
                                                                            onClick={() => handleRemoveImage(index)}
                                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}



                                            </div>

                                            <div className="flex-1 min-w-[300px]">
                                                {/* Upload Field */}
                                                <div className="flex-1 min-w-[400px] max-w-[600px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Actual Image <span className="text-meta-1">*</span>
                                                    </label>
                                                    <div className="relative w-full">
                                                        <Field
                                                            name="actualImage"
                                                            type="file"
                                                            //multiple={false}
                                                            multiple // Allow multiple files
                                                            accept="image/*"
                                                            // onChange={handleFileChangeActual}
                                                            className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="flex flex-col items-center justify-center space-y-3 border-[1.5px] border-stroke bg-transparent py-3 px-5 rounded text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary">
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border p-3 border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 16 16"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                                        fill="#3C50E0"
                                                                    />
                                                                </svg>
                                                            </span>
                                                            <p>
                                                                <span className="text-primary">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                                            <p>(max, 800 X 800px)</p>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="mt-4">


                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Image Previews
                                                    </label>


                                                    <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark flex flex-row">
                                                        {/* Grid Layout */}
                                                        <div className="flex flex-col grid-cols-3">

                                                            <div className="flex flex-row gap-4 ">
                                                                {/* Image Preview */}
                                                                {product?.images.map((ref) => (
                                                                    <>
                                                                        {
                                                                            ref.actualImage != null &&

                                                                            <img
                                                                                className="h-20 w-20  transition-transform duration-500 ease-in-out transform group-hover:scale-[2] group-hover:shadow-2xl"
                                                                                crossOrigin="use-credentials"
                                                                                src={`${GET_IMAGE}/products/getimages/${ref.actualImage}`}
                                                                                alt="Product Image"
                                                                            />
                                                                        }
                                                                    </>
                                                                ))}
                                                                {/* Cancel Button */}
                                                                <button
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>





                                                </div>


                                                {previewsActual.length > 0 && (
                                                    <div className="mt-4">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            Image Previews
                                                        </label>
                                                        {/* Box Wrapper */}
                                                        <div className="p-4 border-2 border-dashed rounded-md bg-gray-50 dark:bg-boxdark dark:border-strokedark">
                                                            {/* Grid Layout */}
                                                            <div className="grid grid-cols-3 gap-4">
                                                                {previewsActual.map((previewActual, index) => (
                                                                    <div key={index} className="relative group">
                                                                        {/* Image Preview */}
                                                                        <img
                                                                            src={previewActual.url}
                                                                            alt={`Preview ${index + 1}`}
                                                                            className="h-20 border rounded object-cover min-w-[100px] max-w-[100px] transition-transform duration-200 hover:scale-110"
                                                                        />
                                                                        {/* Cancel Button */}
                                                                        <button
                                                                            // onClick={() => handleRemoveActual(index)}
                                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}



                                            </div>




                                        </div>


                                        <div className="mb-4.5 flex flex-wrap gap-6">
                                            {/* Container for Supplier and Product Status */}
                                            <div className="flex flex-1 flex-col md:flex-row gap-6">
                                                {/* Supplier Field */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2.5 block text-black dark:text-white">
                                                        Supplier
                                                        <span className="text-red-700 text-xl mt-[40px] justify-center items-center"> *</span>
                                                    </label>
                                                    <div className="z-20 bg-transparent dark:bg-form-Field">
                                                        <ReactSelect
                                                            isDisabled={true}
                                                            isMulti
                                                            name="supplier"
                                                            value={values?.supplier?.map((supp) => ({
                                                                value: supp.supplier.id, // Correct value mapping
                                                                label: supp.supplier.name, // Display supplier name
                                                            }))}
                                                            styles={customStyles}
                                                            className="pointer-events-none bg-gray-100 dark:bg-gray-800 cursor-default"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Supplier Name"
                                                        />

                                                    </div>

                                                </div>

                                                {/* Product Status Field */}
                                                {/* <div className="flex-1 min-w-[300px]">
            <label className="mb-2.5 block text-black dark:text-white">Product Status</label>
            <Field
                name="productStatus"
                type="text"
                placeholder="Enter Product Status"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
            />
        </div> */}
                                                <div className="flex-1 min-w-[300px]">
                                                    <label className="mb-2 block text-black dark:text-white"> Product Status</label>
                                                    <Field
                                                        name='productStatus'
                                                        type="text"
                                                        placeholder="Enter Product Status"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 mt-[6px] px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-Field dark:text-white dark:focus:border-primary"
                                                    />
                                                    {/* <ErrorMessage name="productStatus" component="div" className="text-red-500" /> */}

                                                </div>
                                            </div>
                                        </div>








                                        <div className="flex-1 min-w-[300px]">
                                            <label className="mb-2.5 block text-black dark:text-white"> Supplier Code <span className='text-red-700 text-xl mt-[40px] justify-center items-center'> *</span></label>
                                            <div className=" bg-transparent dark:bg-form-Field">


                                                <ReactSelect
                                                    name="supplierCode"
                                                    value={
                                                        values?.supplierCode
                                                            ? { value: values.supplierCode.supplierCode, label: values.supplierCode.supplierCode }
                                                            : null
                                                    }
                                                   
                                                   
                                                    isDisabled={true}
                                                    styles={customStyles} // Pass custom styles here
                                                    className="bg-white dark:bg-form-Field"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select supplier Code"
                                                />



                                            </div>
                                        </div>




                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>

        </DefaultLayout>
    );
};

export default ViewKaniProducts;
