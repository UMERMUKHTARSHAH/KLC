export const BASE_URL = 'http://localhost:8081';
export const SIGNIN_URL = `${BASE_URL}/api/v1/auth/signin`;
export const VIEWUSERS_URL = `${BASE_URL}/user`;
//Unit Url's
export const ADD_UNIT_URL = `${BASE_URL}/unit/addUnit`;
export const GET_UNIT_URL = `${BASE_URL}/unit/search`;
export const UPDATE_UNIT_URL = `${BASE_URL}/unit/updateUnit`;
export const VIEW_ALL_UNITS = `${BASE_URL}/unit/viewAll`;
export const DELETE_UNIT_URL = `${BASE_URL}/unit/deleteUnit/`;
//BOM

// Product Url
export const PRODUCTCOUNT_URL = `${BASE_URL}/api/dashboard/productGroupCounts`;


export const ADDBOM = `${BASE_URL}/bom`;
export const VIEWBOM = `${BASE_URL}/bom`;
export const UPDATEBOM = `${BASE_URL}/bom/update`;
//Location Url's
export const ADD_LOCATION_URL = `${BASE_URL}/location/add`;
export const GET_LOCATION_URL = `${BASE_URL}/location/all`;
export const UPDATE_LOCATION_URL = `${BASE_URL}/location/update`;
export const VIEW_ALL_LOCATIONS = `${BASE_URL}/location/viewAll`;
export const DELETE_LOCATION_URL = `${BASE_URL}/location/delete/`;

// stock journl

export const GET_QUANTITY = `${BASE_URL}/productInventory/closingBalance`;

// add location inventory

export const ADD_LOCATIONINVENTORY_URL = `${BASE_URL}/productInventory`;

export const GET_INVENTORYLOCATION = `${BASE_URL}/productInventory/getByProduct`;

export const GET_INPROGRESSTRACK = `${BASE_URL}/api/in-progress-tracking/product/`;

export const GET_INVENTORYBalance = `${BASE_URL}/productInventory/getBy`;
export const DELETEINVENTORY_PRODUCT_URL = `${BASE_URL}/productInventory/delete/`;
export const GETPRODUCTS = `${BASE_URL}/products/entrypayment/dropdown`;
export const GETDESCRIPTIONS = `${BASE_URL}/products/all-products`;

//inventory

export const GET_INVENTORY = `${BASE_URL}/productInventory/search`;
export const GET_INVENTORYYS = `${BASE_URL}/productgroup/product-inventories`;

export const GET_INVENTORYY = `${BASE_URL}/productInventory/recent-transactions`;
//Godown
export const GET_GODOWN = `${BASE_URL}/productInventory/searchGoDown`;

// Supplier Urls's
export const ADD_SUPPLIER_URL = `${BASE_URL}/supplier/addSupplier`;
export const GET_SUPPLIER_URL = `${BASE_URL}/supplier/viewAll`;
export const VIEW_ALL_SUPPLIER_URL = `${BASE_URL}/supplier/getAll`;
export const GET_SUPPLIER_ID_URL = `${BASE_URL}/supplier/getSupplier`;
export const GET_SUPPLIERLedger_ID_URL = `${BASE_URL}/supplier/getSupplierWithLedger`;

export const UPDATE_SUPPLIER_URL = `${BASE_URL}/supplier/updateSupplier`;
export const DELETE_SUPPLIER_URL = `${BASE_URL}/supplier/deleteSupplier/`;
//ledger
export const VIEW_SUPPLIER_LEDGER = `${BASE_URL}/ledger/searchLedger`;
export const VIEW_SUPPLIER = `${BASE_URL}/supplier/searchSupplier`;
export const GET_LEDGER_ID_URL = `${BASE_URL}/ledger/get`;
export const GET_LEDGER__URL = `${BASE_URL}/ledger/viewAll`;
export const GET_LEDGERR__URL = `${BASE_URL}/ledger/getAll`;

export const GET_LEDGERRExpense__URL = `${BASE_URL}/ledger/dropdown/income-expense`;

export const GET_LEDGERRENAME__URL = `${BASE_URL}/ledger/dropdown/ledgername`;
export const GET_LEDGERRENAMEE__URL = `${BASE_URL}/ledger/dropdown/by-type`;

export const GET_LEDGERSupplierId__URL = `${BASE_URL}/ledger`;

export const VIEW_SUPPLIER_LEDGERBYID = `${BASE_URL}/supplier/getBySupplierLedger`;
export const VIEW_LEDGERBYDATE = `${BASE_URL}/ledger/getLedger`;

//Material Url's
export const ADD_MATERIAL_URL = `${BASE_URL}/material/add`;
export const GET_MATERIAL_URL = `${BASE_URL}/material/getAll`;
export const VIEW_ALL_MATERIAL_URL = `${BASE_URL}/material/viewAll`;
export const UPDATE_MATERIAL_URL = `${BASE_URL}/material/update`;
export const DELETE_MATERIAL_URL = `${BASE_URL}/material/delete/`;

// material po

export const ADD_MATERIALPO_URL = `${BASE_URL}/purchaseOrder`;
export const GET_MATERIALPO_BY_ID_URL = `${BASE_URL}/purchaseOrder`;
export const GET_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/search`;
export const UPDATE_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/updatePurchase`;
export const DELETE_MATERIALPO_URL = `${BASE_URL}/purchaseOrder/`;

//signup

export const SIGNUPURL = `${BASE_URL}/api/v1/auth/signup`;
export const ROLESURL = `${BASE_URL}/user/roles`;

//color url's
export const ADD_COLOR_URL = `${BASE_URL}/productgroup/add-colors`;

export const DELETE_COLOR_URL = `${BASE_URL}/productgroup/delete`;
export const UPDATE_COLOR_URL = `${BASE_URL}/productgroup/update-colors`;
export const GET_COLOR_URL = `${BASE_URL}/productgroup/viewProductGroupWithColors`;
export const GET_COLORAll_URL = `${BASE_URL}/colors/viewAll`;

//create Inventory Material
export const ADD_INVENTORY_URL = `${BASE_URL}/inventory`;
export const GET_INVENTORY_URL = `${BASE_URL}/inventory/search`;
export const UPDATE_INVENTORY_URL = `${BASE_URL}/inventory`;
export const GET_INVENTORYBYID_URL = `${BASE_URL}/inventory`;
export const DELETE_INVENTORY_URL = `${BASE_URL}/inventory`;

//stock journel url
export const ADD_STOCKJOURNELL_URL = `${BASE_URL}/stock-voucher/transfer`;
export const VIEW_STOCKJOURNALL_URL = `${BASE_URL}/stock-voucher/all`;

export const ADD_STOCKJOURNEL_URL = `${BASE_URL}/stockjournals/add`;
export const VIEW_VOUCHERNOS = `${BASE_URL}/stockjournals/voucherNos`;
export const VIEW_STOCKJOURNALCREATED = `${BASE_URL}/stockjournals/search`;
export const VIEW_STOCKJOURNALBYID = `${BASE_URL}/stockjournals/getById`;
export const VERIFY_STOCK_JOURNAL = `${BASE_URL}/stockjournals/accept`;

export const GET_STOCK_URL = `${BASE_URL}/stockjournals/search`;
export const GET_STOCKBYID_URL = `${BASE_URL}/stockjournal`;
export const UPDATE_STOCK_URL = `${BASE_URL}/stockjournal`;
export const DELETE_STOCK_URL = `${BASE_URL}/stockjournal/delete`;

//product group
export const ADD_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;
export const GET_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;

export const UPDATE_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup`;
export const VIEW_ALL_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup/viewAll`;
export const DELETE_PRODUCT_GROUP_URL = `${BASE_URL}/productgroup/`;
export const GET_GROUPS_URL = `${BASE_URL}/productgroup/`;

//productSub group
export const ADD_PRODUCT_SUBGROUP_URL = `${BASE_URL}/productgroup`;

export const ADD_PRODUCT_SUBGROUPS_BULK_URL = `${BASE_URL}/subGroup/save`;
export const GET_PRODUCT_SUBGROUP_URL = `${BASE_URL}/subGroup/getAll`;
export const GET_PRODUCT_GROUP_SUBGROUP_URL = `${BASE_URL}/subGroup`;

export const UPDATE_PRODUCT_SUBGROUP_URL = `${BASE_URL}/subGroup/update`;
export const VIEW_ALL_PRODUCT_SUBGROUP_URL = `${BASE_URL}/productgroup/viewAll`;
export const DELETE_PRODUCT_SUBGROUP_URL = `${BASE_URL}/productgroup/`;
export const DELETE_PRODUCT_SUBGROUPP_URL = `${BASE_URL}/subGroup/`;

//notification
export const NOTIF_COUNT = `${BASE_URL}/api/notifications/unread-count`;
export const NOTIF_ = `${BASE_URL}/api/notifications/unread`;
export const NOTIF = `${BASE_URL}/api/notifications`;

export const DELAYPRODUCT = `${BASE_URL}/order/late-products`;


//Currency
export const ADD_CURRENCY_URL = `${BASE_URL}/currency`;
export const GET_CURRENCY_URL = `${BASE_URL}/currency`;
export const UPDATE_CURRENCY_URL = `${BASE_URL}/currency`;
export const VIEW_ALL_CURRENCY = `${BASE_URL}/currency/viewAll`;
export const DELETE_CURRENCY_URL = `${BASE_URL}/currency/`;

//Size
export const ADD_SIZE_URL = `${BASE_URL}/sizes`;
export const GET_SIZE_URL = `${BASE_URL}/sizes`;
export const UPDATE_SIZE_URL = `${BASE_URL}/sizes`;
export const VIEW_ALL_SIZE = `${BASE_URL}/sizes/viewAll`;
export const DELETE_SIZE_URL = `${BASE_URL}/sizes/`;

//Design
export const ADD_DESIGN_URL = `${BASE_URL}/design`;
export const GET_DESIGN_URL = `${BASE_URL}/design`;
export const UPDATE_DESIGN_URL = `${BASE_URL}/design`;
export const VIEW_ALL_DESIGN = `${BASE_URL}/design/viewAll`;
export const DELETE_DESIGN_URL = `${BASE_URL}/design/`;

export const DESIGNBYPR = `${BASE_URL}/design/fetch-designs/product-groups`;

//pRODUCT CATEGORY
export const ADD_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const GET_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const UPDATE_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category`;
export const VIEW_ALL_PRODUCTCATEGORY = `${BASE_URL}/product-category/viewAll`;
export const DELETE_PRODUCTCATEGORY_URL = `${BASE_URL}/product-category/`;

//Weave
export const ADD_WEAVE_URL = `${BASE_URL}/weave/create`;
export const GET_WEAVE_URL = `${BASE_URL}/weave`;
export const UPDATE_WEAVE_URL = `${BASE_URL}/weave/update`;
export const VIEW_ALL_WEAVE = `${BASE_URL}/weave/viewAll`;
export const VIEW_ALL_WEAVEPAGINATION = `${BASE_URL}/weave/allWeaves`;
export const DELETE_WEAVE_URL = `${BASE_URL}/weave/`;

//CUSTOMER GROUP
export const ADD_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const GET_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const UPDATE_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group`;
export const GET_CUSTOMER_ID_URL = `${BASE_URL}/customer`;
export const VIEW_ALL_CUSTOMERGROUP = `${BASE_URL}/customer-group`;
export const DELETE_CUSTOMERGROUP_URL = `${BASE_URL}/customer-group/`;

export const CUSTOMERSHOPIFY_URL = `${BASE_URL}/customer/shopify/sync`;

//STYLE
export const ADD_STYLE_URL = `${BASE_URL}/styles`;
export const GET_STYLE_URL = `${BASE_URL}/styles`;
export const UPDATE_STYLE_URL = `${BASE_URL}/styles`;
export const VIEW_ALL_STYLE = `${BASE_URL}/styles/viewAll`;
export const DELETE_STYLE_URL = `${BASE_URL}/styles/`;

//STYLE
export const ADD_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const GET_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const UPDATE_ORDERTYPE_URL = `${BASE_URL}/orderType`;
export const VIEW_ALL_ORDERTYPE = `${BASE_URL}/orderType/viewAll`;
export const DELETE_ORDERTYPE_URL = `${BASE_URL}/orderType/`;

//BUDGET
export const ADD_BUDGET_URL = `${BASE_URL}/budget`;
export const GET_BUDGET_URL = `${BASE_URL}/budget`;
export const SEARCH_BUDGET_URL = `${BASE_URL}/budget/searchBudget`;
export const GETBUDGETBYDATE_URL = `${BASE_URL}/budget/frbybudgetdate`;

export const UPDATE_BUDGET_URL = `${BASE_URL}/budget`;
export const VIEW_ALL_BUDGET = `${BASE_URL}/budget/viewAll`;
export const DELETE_BUDGET_URL = `${BASE_URL}/budget/`;

//BUDGET
export const ADD_CUSTOMER_URL = `${BASE_URL}/customer`;
export const GET_CUSTOMER_URL = `${BASE_URL}/customer`;
export const GET_CUSTOMERBYID_URL = `${BASE_URL}/customer/getCustomerWithLedger`;
export const GET_CUSTOMERR_URL = `${BASE_URL}/customer/searchCustomer`;

export const UPDATE_CUSTOMER_URL = `${BASE_URL}/customer`;
export const VIEW_ALL_CUSTOMER = `${BASE_URL}/customer/viewAll`;

export const DOWNLOAD_REPORT = `${BASE_URL}/report/searchReport`;
export const DOWNLOADPRODUCT_REPORT = `${BASE_URL}/report/downloadProductCsv`;

export const DOWNLOADCUSTOMER_REPORT = `${BASE_URL}/report/downloadCustomerCsv`;

export const DOWNLOADPRODUCTRE_REPORT = `${BASE_URL}/api/reports/productReports/download`;

export const DOWNLOADINPROGRESSORDERS_REPORT = `${BASE_URL}/report/downloadInProgressPdf`;
export const DOWNLOADPENDINGFINNCIALORDERS_REPORT = `${BASE_URL}/report/downloadPendingPdf`;

export const DOWNLOADCSV_REPORT = `${BASE_URL}/report/downloadCsv`;

export const DOWNLOADACCCSV_REPORT = `${BASE_URL}/api/reports/creditor-report`;
export const DOWNLOADACClient_REPORT = `${BASE_URL}/api/reports/client-report`;
export const DOWNLOADAC_STOCK_REPORT = `${BASE_URL}/api/reports/order/stock-report`;
export const DOWNLOADAC_PROFITLOSS_REPORT = `${BASE_URL}/api/reports/order/profit-loss`;

export const DOWNLOADACCCSVDebi_REPORT = `${BASE_URL}/api/reports/debtor-report`;

export const VIEWSALES_REPORT = `${BASE_URL}/api/reports/salesReport`;

export const DOWNLOADSALESCSV_REPORT = `${BASE_URL}/api/reports/salesReport`;
export const DOWNLOADPURCHASECSV_REPORT = `${BASE_URL}/api/reports/purchaseReport`;

export const DOWNLOADPENDINGPDFBYDATE_REPORT = `${BASE_URL}/report/downloadPendingPdf`;

export const DOWNLOADINPROGRESSBYDATE_REPORT = `${BASE_URL}/report/downloadInProgressPdf`;

export const DOWNLOADINPROGRESSBYDATECSV_REPORT = `${BASE_URL}/report/downloadInProgressCsv`;

export const DOWNLOADPENDINGORDERCSV_REPORT = `${BASE_URL}/report/downloadPendingCsv`;

export const DELETE_CUSTOMER_URL = `${BASE_URL}/customer/`;

//PRODUCT
export const ADD_PRODUCT_URL = `${BASE_URL}/products/add-product`;
export const GET_PRODUCTSID_URL = `${BASE_URL}/products/processProductIds`;

export const GET_PRODUCT_URL = `${BASE_URL}/products/search`;

export const GET_PRODUCTBYID_URL = `${BASE_URL}/products`;
export const UPDATE_PRODUCT_URL = `${BASE_URL}/products/update-product`;
export const UPDATE_PRODUCTIMAGE_URL = `${BASE_URL}/products/update-product-images`;
export const VIEW_ALL_PRODUCT = `${BASE_URL}/products/viewAll`;
export const DELETE_PRODUCT_URL = `${BASE_URL}/products/`;
export const GET_PRODUCTID_URL = `${BASE_URL}/products`;

export const GET_PRODUCTIDD_URL = `${BASE_URL}/products`;

export const GET_PRODUCTIDDD_URL = `${BASE_URL}/order`;

//ORDER
export const VIEW_ALL_ORDERS = `${BASE_URL}/order/search`;

export const VIEW_CREATED_ORDERS = `${BASE_URL}/order/searchCreated`;
export const EDIT_CREATED_ORDERS = `${BASE_URL}/order/searchCreatedEditOrder`;

export const GET_PID = `${BASE_URL}/order/generateOrderProforma`;
export const GET_PROFORMAID_URL = `${BASE_URL}/order/getOrderProforma`;

export const UPDATE_PROFORMA_URL = `${BASE_URL}/order/updateOrderProforma`;

export const UPDATE_ReceivedQuantity_URL = `${BASE_URL}/order/updateReceivedQtyData`;

export const VIEW_ALLACCEPTED_ORDERS = `${BASE_URL}/order/searchAccepted`;

export const VIEW_PARTIALLYAPPROVED_ORDERS = `${BASE_URL}/order/searchApprovedAndAccepted`;

export const VIEW_APPROVED_ORDERS = `${BASE_URL}/order/searchApproved`;
export const VIEW_APPROVED_KANI_ORDERS = `${BASE_URL}/order/inProgress-kani`;
export const VIEW_APPROVED_PASHMINAEMBROIDERY_ORDERS = `${BASE_URL}/order/inProgress-pashminaEmbroidery`;

//pending for bill

export const VIEW_SEARCHBILL = `${BASE_URL}/order/searchBillStatus`;

export const VIEW_PENDINGFORBILLBYID = `${BASE_URL}/order/getBillStatus`;

export const UPDATE_PENDINGFORBILLBYID = `${BASE_URL}/order/updatePhysicalBillNo`;

//ledger

export const UPDATE_Ledger_URL = `${BASE_URL}/ledger/update`;
export const ADD_Ledger_URL = `${BASE_URL}/ledger/add`;

export const DELETE_Ledger_URL = `${BASE_URL}/ledger/delete`;
// export const GET_Ledger_URL = `${BASE_URL}/order/get`;
export const GET_GROUPLedger_URL = `${BASE_URL}/ledger/getLedgerByAcountGroup`;
export const VIEW_PROFORMA = `${BASE_URL}/order/searchOrderProforma`;
export const VIEW_PROFORMABYID = `${BASE_URL}/order/getOrderProforma`;

export const VIEW_CANCELLED_ORDERS = `${BASE_URL}/order/searchCancel`;
export const VIEW_REPORT = `${BASE_URL}/report/search`;

export const VIEW_ORDERSHIPPING_ORDERS = `${BASE_URL}/order/searchShippingDate`;

export const VIEW_NEEDMODIFICATION_ORDERS = `${BASE_URL}/order/searchModification`;
export const VIEW_RECIEVEDQUANTITY_ORDERS = `${BASE_URL}/order/searchEditReceivedQty`;

export const VIEW_PARTIALLYCLOSED_ORDERS = `${BASE_URL}/order/searchPartiallyClosed`;

export const VIEW_PARTIALLYCREATED_ORDERS = `${BASE_URL}/order/searchCreatedAndAccepted`;

export const VIEW_CLOSED_ORDERS = `${BASE_URL}/order/searchClosed`;

export const VIEW_CHALLAN_ORDERS = `${BASE_URL}/order/searchUpdateChallan`;
export const VIEW_EXPECTEDDATE_ORDERS = `${BASE_URL}/order/searchSupplierData`;
export const VIEW_RECIEVINGQTY_ORDERS = `${BASE_URL}/order/searchSupplierReceiving`;

export const VIEW_PENDING_ORDERS = `${BASE_URL}/order/searchPending`;
export const VIEW_REJECTED_ORDERS = `${BASE_URL}/order/searchRejected`;

export const VIEW_PARTIALLYPENDING_ORDERS = `${BASE_URL}/order/searchPendingPartially`;
export const VIEW_FORCEDCLOSURE_ORDERS = `${BASE_URL}/order/searchForcedClosure`;
export const UPDATE_ORDERCREATED_ALL = `${BASE_URL}/order/updateOrderProductsAccepted`;
export const ADD_ORDERPROFORMA = `${BASE_URL}/order/saveOrderProforma`;

export const UPDATE_CANCELLEDORDER_ALL = `${BASE_URL}/order/updateOrderProductsCancelled`;

export const UPDATE_ORDERCREATEDDATE = `${BASE_URL}/order/updateShipDate`;

export const UPDATE_ORDERPRODUCT_ALL = `${BASE_URL}/order/orderProducts`;
export const VIEW_ORDERPRODUCT_ALL = `${BASE_URL}/order/orderProduct`;
export const UPDATE_ISSUECHALLAN = `${BASE_URL}/order/orderProductsIssue`;

export const UPDATE_CHALLAN = `${BASE_URL}/order/challan`;
export const UPDATE_EXPECTEDDATE = `${BASE_URL}/order/updateOrderProductExpectDate`;
export const UPDATE_ORDERRECIEVED = `${BASE_URL}/order/orderProductRecievDetail`;

export const VIEW_ALL_PRODID = `${BASE_URL}/order/viewCreatedProductId`;
export const VIEW_ALL_ORDERSCREATED = `${BASE_URL}/order/search`;

export const VIEW_ORDER_PRODUCT = `${BASE_URL}/order/orderProduct`;
export const VIEW_FABRIC_DETAIL = `${BASE_URL}/order/plain-order`;
export const VIEW_SUPPLIERHISTORY = `${BASE_URL}/order/orderProduct`;

export const DELETE_ORDER_URL = `${BASE_URL}/order/delete`;
export const VIEW_ALL_ORDER_URL = `${BASE_URL}/order/viewAll`;
export const ADD_ORDER_URL = `${BASE_URL}/order/add`;
export const VIEW_ORDERNO = `${BASE_URL}/order/viewOrderNo`;

export const GET_ORDERBYID_URL = `${BASE_URL}/order/get`;
export const GET_ORDERBYIDDD_URL = `${BASE_URL}/order/getOrderBy`;
export const GET_ORDERBYIDD_URL = `${BASE_URL}/order/orderReponse`;

export const UPDATE_ORDER_URL = `${BASE_URL}/order/update`;

export const GET_PRODUCTIDINVENTORY_URL = `${BASE_URL}/products/inventoryProductIds`;
export const GET_PRODUCTInventory_URL = `${BASE_URL}/productInventory/getByProduct`;
export const UPDATE_PRODUCTInventory_URL = `${BASE_URL}/productInventory/update`;

export const UPDATE_PRODUCTInventoryy_URL = `${BASE_URL}/productInventory/updateLocation`;

export const ADD_CONTEMPORARY = `${BASE_URL}/products/upload-excel`;
export const ADD_PASHMINA_EMB = `${BASE_URL}/uploadExcel/peshmina`;
export const ADD_WOOL_EMB = `${BASE_URL}/uploadExcel/wool`;
export const ADD_KANI = `${BASE_URL}/uploadExcel/kani`;
export const ADD_PAPERMACHIE = `${BASE_URL}/uploadExcel/paper`;
export const ADD_COTTON = `${BASE_URL}/uploadExcel/cotton`;
export const ADD_CONTEM_SAREE = `${BASE_URL}/uploadExcel/saree`;
export const ADD_CONTEMP_WOOL = `${BASE_URL}/uploadExcel/contempWool`;

//PRODUCT
export const ADD_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const GET_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const UPDATE_HSNCODE_URL = `${BASE_URL}/hsncode`;
export const VIEW_ALL_HSNCODE = `${BASE_URL}/hsncode/viewAll`;
export const DELETE_HSNCODE_URL = `${BASE_URL}/hsncode`;

// Kani

export const GET_Kani_URL = `${BASE_URL}/order/kani`;
export const GET_SUPPLIER_ORDERS_URL = `${BASE_URL}/order`;
export const GET_PRODUCTS_URL = `${BASE_URL}/products/updateProduct`;
export const GET_Kani_CLIENTORDERS_URL = `${BASE_URL}/order/kani-clientOrder`;
export const GET_RETAIL_CLIENTORDERS_URL = `${BASE_URL}/order/kani/retail-client-orders`;
export const GET_WHOLESALE_CLIENTORDERS_URL = `${BASE_URL}/order/kani/ws-client-orders`;
export const GET_KLCORDERS_URL = `${BASE_URL}/order/klcc`;
export const GET_PASHMINA_URL = `${BASE_URL}/order/pashmina-embroidery`;
export const GET_RETAIL_EMBROIDERY_URL = `${BASE_URL}/order/pashminaEmbroidery/retail-client-orders`;
export const GET_WHOLESALE_EMBROIDERY_URL = `${BASE_URL}/order/pashminaEmbroidery/ws-client-orders`;
export const GET_KLC_EMBROIDERY_URL = `${BASE_URL}/order/klc-pashmEmbroidery`;
export const GET_PASHMINA_ORDERS_URL = `${BASE_URL}/order/pashminaEmbroidery`;
export const GET_CONTEMPORARY_URL = `${BASE_URL}/order/contemporary-pashmina`;
export const GET_CONTEMPORARY_ORDERS_URL = `${BASE_URL}/order/contemporaryPashmina`;
export const GET_INPROGRESS_CONTEMPORARY_ORDERS_URL = `${BASE_URL}/order/inProgress-contemporaryPashmina`;
export const GET_RETAIL_CONTEMPORARY_URL = `${BASE_URL}/order/contempPashmina/retail-client-orders`;
export const GET_WHOLESALE_CONTEMPORARY_URL = `${BASE_URL}/order/contempPashmina/ws-client-orders`;
export const GET_KLC_CONTEMPORARY_URL = `${BASE_URL}/order/klc-contempPashmina`;
export const GET_PAPERMACHE_ORDERS_URL = `${BASE_URL}/order/papier-machie`;
export const GET_RETAIL_PAPIERMACGE_URL = `${BASE_URL}/order/papierMachie/retail-client-orders`;
export const GET_WHOLESALE_PAPIERMACGE_URL = `${BASE_URL}/order/papierMachie/ws-client-orders`;
export const GET_KLC_PAPIERMACHE_URL = `${BASE_URL}/order/klc-papierMachie`;
export const GET_SUPP_PAPIERMACHE_URL = `${BASE_URL}/order/papierMachie`;
export const GET_INPROGRESS_PAPERMACHE_ORDERS_URL = `${BASE_URL}/order/inProgress-papierMachie`;
export const GET_WOOL_ORDERS_URL = `${BASE_URL}/order/wool-embroidery`;
export const GET_WOOL_SUPPORDERS_URL = `${BASE_URL}/order/woolEmbroidery`;
export const GET_WOOL_INPROGRESS_ORDERS_URL = `${BASE_URL}/order/inProgress-woolEmbroidery`;
export const GET_WOOL_WHOLESALE_ORDERS_URL = `${BASE_URL}/order/woolEmbroidery/ws-client-orders`;
export const GET_WOOL_KLC_ORDERS_URL = `${BASE_URL}/order/klc-woolEmbroidery`;
export const GET_WOOL_RETAIL_ORDERS_URL = `${BASE_URL}/order/woolEmbroidery/retail-client-orders`;
export const GET_CONTWOOL_ORDERS_URL = `${BASE_URL}/order/contemporary-wool`;
export const GET_CONTWOOL_INPROGRESS_URL = `${BASE_URL}/order/inProgress-contemporary-wool`;
export const GET_CONTWOOL_RETAIL_URL = `${BASE_URL}/order/contemporary-wool/retail-client-orders`;
export const GET_CONTWOOL_WS_URL = `${BASE_URL}/order/contemporary-wool/ws-client-orders`;
export const GET_CONTWOOL_KLC_URL = `${BASE_URL}/order/klc-contemporary-wool`;
export const GET_CONTWOOL_SUPP_URL = `${BASE_URL}/order/contemporary-wool`;
export const GET_COTTON_URL = `${BASE_URL}/order/cotton`;
export const GET_COTTONORDERS_URL = `${BASE_URL}/order/cotton`;
export const GET_COTTON_INPROGRESS_URL = `${BASE_URL}/order/inProgress-cotton`;
export const GET_COTTON_RETAIL_URL = `${BASE_URL}/order/cotton/retail-client-orders`;
export const GET_COTTON_WHOLESALE_URL = `${BASE_URL}/order/cotton/ws-client-orders`;
export const GET_COTTON_KLC_URL = `${BASE_URL}/order/klc-cotton`;
export const GET_CONT_SAREE_URL = `${BASE_URL}/order/contemporary-saree`;
export const GET_SAREE_INPROGRESS_URL = `${BASE_URL}/order/inProgress-contemporary-saree`;
export const GET_SAREE_Supp_URL = `${BASE_URL}/order/contemporary-saree`;
export const GET_SAREE_Retail_URL = `${BASE_URL}/order/contemporary-saree/retail-client-orders`;
export const GET_SAREE_WHOLESALE_URL = `${BASE_URL}/order/contemporary-saree/ws-client-orders`;
export const GET_SAREE_KLC_URL = `${BASE_URL}/order/klc-contemporary-saree`;
export const GET_PRODUCTDETAILS_URL = `${BASE_URL}/order/by-product-group`;
export const GET_SUPPLIERS_URL = `${BASE_URL}/order/by-product-group`;
export const GET_INPROGRESS_URL = `${BASE_URL}/order/approved-orders`;

//dahsboard

//acountsss
export const ADD_Groups_URL = `${BASE_URL}/accountGroup/add`;
export const GET_Groups_URL = `${BASE_URL}/accountGroup/getAll`;
export const GET_Groupss_URL = `${BASE_URL}/accountGroup/viewAll`;

export const UPDATE_Groups_URL = `${BASE_URL}/accountGroup/update`;
export const DELETE_Groups_URL = `${BASE_URL}/accountGroup/delete`;

//Vouchers
export const ADD_Voucher_URL = `${BASE_URL}/voucher/addVoucher`;
export const ADD_VoucherEntry_URL = `${BASE_URL}/entryPayment/add`;
export const ENTRYPAYMENT_URL = `${BASE_URL}/entryPayment`;
export const ADD_VoucherPaymentEntry_URL = `${BASE_URL}/api/voucher/payment-voucher`;

export const GET_Voucher_URL = `${BASE_URL}/voucher/getAll`;
export const GET_Vouchersearch_URL = `${BASE_URL}/voucher/search`;
export const GET_VoucherName_URL = `${BASE_URL}/voucher/dropdown`;

export const GET_VoucherNameFromType_URL = `${BASE_URL}/voucher/names/by-type/`;
export const GET_VoucherEntriessearch_URL = `${BASE_URL}/entryPayment/voucher`;

export const GET_VoucherEntriessearchFORDEBIT_URL = `${BASE_URL}/credit-debit-note/all-vouchers/credit-debit-notes`;

export const GET_VoucherEntriessearchPayment_URL = `${BASE_URL}/api/voucher/payment-voucher`;

// entry payment receipts

export const GET_VoucherReceipt_URL = `${BASE_URL}/credit-debit-note/ledger/`;

export const CREATE_CREDITNOTE_URL = `${BASE_URL}/credit-debit-note/voucher`;

export const CREATE_DEBITNOTE_URL = `${BASE_URL}/credit-debit-note/voucher`;

export const PRINTEntries_URL = `${BASE_URL}/entryPayment`;
export const PRINTPAYMENT_URL = `${BASE_URL}/api/voucher/payment-voucher`;

export const GET_VoucherNoss_URL = `${BASE_URL}/voucher/getReceipt`;
export const GET_VoucherNos_URL = `${BASE_URL}/voucher/getNextReceipt`;

export const GET_VoucherBYID = `${BASE_URL}/voucher/get`;
export const SEARCH_DayBook_URL = `${BASE_URL}/daybook/today`;
export const SEARCH_PAYMENTSUMMARY_URL = `${BASE_URL}/ledger/search-balance-summary`;

export const GETPRODUCTBYSUPPLIER = `${BASE_URL}/order/order-products/accepted`;

export const SEARCH_OrderVoucher_URL = `${BASE_URL}/voucher/ordersWithVouchers`;

//lut

export const ADD_Lut_URL = `${BASE_URL}/api/lut/save`;
export const DELETE_Lut_URL = `${BASE_URL}/api/entryPayment/add`;
export const GET_LutBYID = `${BASE_URL}/api/voucher/addVoucher`;
export const UPDATELut_URL = `${BASE_URL}/api/entryPayment/add`;
export const GET_Lut_URL = `${BASE_URL}/api/lut/viewAll`;
export const EDIT_ENTRY_URL = `${BASE_URL}/entryPayment`;

export const TOGGLE_Lut_URL = `${BASE_URL}/api/lut/toggle`;

export const UPDATEVoucher_URL = `${BASE_URL}/voucher/update`;
export const DELETE_Voucher_URL = `${BASE_URL}/voucher/delete`;

export const UPDATETOGGLE_Voucher_URL = `${BASE_URL}/voucher/actVoucher`;

//images

export const GET_IMAGE = `${BASE_URL}`;

export const Count = `${BASE_URL}/api/dashboard`;

export const options = {
  position: 'top-center',
  autoClose: 1500,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  theme: 'dark',
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
};

//React-select customStyles function

export const customStyles = (theme) => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: '52px',
    fontSize: '14px',
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    border: `2px solid ${
      state.isFocused ? '#3B82F6' : theme === 'dark' ? '#334155' : '#E2E8F0'
    }`,
    borderRadius: '12px',
    boxShadow: state.isFocused
      ? `0 0 0 3px ${
          theme === 'dark'
            ? 'rgba(59, 130, 246, 0.2)'
            : 'rgba(59, 130, 246, 0.1)'
        }`
      : `0 1px 3px 0 ${
          theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'
        }`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: state.isFocused
        ? '#3B82F6'
        : theme === 'dark'
        ? '#475569'
        : '#CBD5E1',
      boxShadow: `0 4px 6px -1px ${
        theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'
      }`,
    },
    '&:focus-within': {
      borderColor: '#3B82F6',
      boxShadow: `0 0 0 3px ${
        theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
      }`,
    },
    cursor: 'pointer',
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: '12px 16px',
  }),

  input: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    margin: 0,
    padding: 0,
  }),

  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    fontWeight: '500',
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#3B82F6' : '#EFF6FF',
    borderRadius: '8px',
    padding: '2px 4px',
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#FFFFFF' : '#1E40AF',
    fontSize: '12px',
    fontWeight: '500',
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#FFFFFF' : '#1E40AF',
    '&:hover': {
      backgroundColor: theme === 'dark' ? '#1D4ED8' : '#DBEAFE',
      color: theme === 'dark' ? '#FFFFFF' : '#1E3A8A',
    },
  }),

  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    fontWeight: '400',
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
    borderRadius: '12px',
    boxShadow: `0 10px 25px -5px ${
      theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'
    }, 0 8px 10px -6px ${
      theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'
    }`,
    border: `1px solid ${theme === 'dark' ? '#334155' : '#E2E8F0'}`,
    overflow: 'hidden',
    zIndex: 99999,
    marginTop: '4px',
  }),

  menuList: (provided) => ({
    ...provided,
    padding: '8px',
    maxHeight: '300px',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: theme === 'dark' ? '#334155' : '#F1F5F9',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme === 'dark' ? '#475569' : '#CBD5E1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme === 'dark' ? '#64748B' : '#94A3B8',
    },
  }),

  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '4px',
    backgroundColor: state.isSelected
      ? theme === 'dark'
        ? '#3B82F6'
        : '#EFF6FF'
      : state.isFocused
      ? theme === 'dark'
        ? '#334155'
        : '#F8FAFC'
      : 'transparent',
    color: state.isSelected
      ? theme === 'dark'
        ? '#FFFFFF'
        : '#1E40AF'
      : theme === 'dark'
      ? '#F8FAFC'
      : '#0F172A',
    fontWeight: state.isSelected ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: theme === 'dark' ? '#475569' : '#F1F5F9',
    },
    '&:last-of-type': {
      marginBottom: 0,
    },
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: theme === 'dark' ? '#475569' : '#CBD5E1',
    marginTop: '12px',
    marginBottom: '12px',
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    padding: '0 12px',
    transition: 'transform 0.2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': {
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
    },
  }),

  clearIndicator: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    padding: '0 12px',
    '&:hover': {
      color: theme === 'dark' ? '#F87171' : '#DC2626',
    },
  }),

  loadingIndicator: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#3B82F6' : '#3B82F6',
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    fontSize: '14px',
    padding: '16px',
    textAlign: 'center',
  }),

  loadingMessage: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#94A3B8' : '#64748B',
    fontSize: '14px',
    padding: '16px',
    textAlign: 'center',
  }),
});
