import { useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader/index.js';
import PageTitle from './components/PageTitle.js';
const SignIn = lazy(() => import('./pages/Authentication/SignIn.jsx'));
const SignUp = lazy(() => import('./pages/Authentication/SignUp.jsx'));
const ViewUsers = lazy(() => import('./pages/Authentication/ViewUsers.jsx'));
const EditUser = lazy(() => import('./pages/Authentication/EditUser.jsx'));
const Calendar = lazy(() => import('./pages/Calendar.js'));
const Chart = lazy(() => import('./pages/Chart.jsx'));

const AccReports = lazy(() => import('./pages/AccReports.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const FinancialReportDashboard = lazy(() => import('./pages/FinancialReportDashboard.jsx'));
const GeneralFinancialReportDashboard = lazy(() => import('./pages/GeneralFinancialReportDashboard.jsx'));
const Groups = lazy(() => import('./components/Accounts/Config/Groups.jsx'));

const Daybook = lazy(() => import('./components/Accounts/Config/Daybook.jsx'));

const OrderVoucherView = lazy(() => import('./components/Accounts/Config/OrderVoucherView.jsx'));

const AddLut = lazy(() => import('./components/Accounts/Config/AddLut.jsx'));
const PaymentSummary = lazy(() => import('./components/Accounts/Config/PaymentSummary.jsx'));

const Voucher = lazy(() => import('./components/Accounts/Vouchers/Voucher.jsx'));
const CreateVoucher = lazy(() => import('./components/Accounts/Vouchers/CreateVoucher.jsx'));
const EditVoucher = lazy(() => import('./components/Accounts/Vouchers/EditVoucher.jsx'));
const CreateVoucherShopify = lazy(() => import('./components/Accounts/Vouchers/CreateVoucherShopify.jsx'));
const UpdateVoucher = lazy(() => import('./components/Accounts/Vouchers/UpdateVoucher.jsx'));
const CreateDebitNote = lazy(() => import('./components/Accounts/Vouchers/CreateDebitNote.jsx'));
const CreateCreditNote = lazy(() => import('./components/Accounts/Vouchers/CreateCreditNote.jsx'));
const CreateContra = lazy(() => import('./components/Accounts/Vouchers/CreateContra.jsx'));
const CreateJournal = lazy(() => import('./components/Accounts/Vouchers/CreateJournal.jsx'));
const CreateReceipt = lazy(() => import('./components/Accounts/Vouchers/CreateReceipt.jsx'));

const CreateVoucherPurchase = lazy(() => import('./components/Accounts/Vouchers/CreateVoucherPurchase.jsx'));
const VoucherEntriesView = lazy(() => import('./components/Accounts/Vouchers/VoucherEntriesView.jsx'));

const StockJournalView = lazy(() => import('./components/Accounts/Vouchers/StockJournalView.jsx'));

const PrintStockJournal = lazy(() => import('./components/Accounts/Vouchers/PrintStockJournal.jsx'));

const VoucherEntriesDebitView = lazy(() => import('./components/Accounts/Vouchers/VoucherEntriesDebitView.jsx'));
const PrintCreditDebit = lazy(() => import('./components/Accounts/Vouchers/PrintCreditDebit.jsx'));

const VoucherEntriesViewPayment = lazy(() => import('./components/Accounts/Vouchers/VoucherEntriesViewPayment.jsx'));

const PrintEntryPayment = lazy(() => import('./components/Accounts/Vouchers/PrintEntryPayment.jsx'));

const PrintPaymentVoucher = lazy(() => import('./components/Accounts/Vouchers/PrintPaymentVoucher.jsx'));
const PrintPosEntryPayment = lazy(() => import('./components/Accounts/Vouchers/PrintPosEntryPayment.jsx'));
const ViewVoucher = lazy(() => import('./components/Accounts/Vouchers/ViewVoucher.jsx'));

const KaniProducts = lazy(() => import('./components/Kani/KaniProducts.jsx'));
const KaniOrders = lazy(() => import('./components/Kani/KaniOrders.jsx'));
const FilterSupplier = lazy(() => import('./components/Kani/FilterSupplier.jsx'));
const SupplierOrder = lazy(() => import('./components/Kani/SupplierOrder.jsx'));
const KaniClientOrders = lazy(() => import('./components/Kani/KaniClientOrders.jsx'));
const RetailClientOrders = lazy(() => import('./components/Kani/RetailClientOrders.jsx'));
const WholesaleClientOrders = lazy(() => import('./components/Kani/WholesaleClientOrders.jsx'));
const KlcOrders = lazy(() => import('./components/Kani/KlcOrders.jsx'));
const ProductGroupDetails = lazy(() => import('./components/Kani/ProductGroupDetails.jsx'));

const CreateLedger = lazy(() => import('./components/Ledger/CreateLedger.jsx'));
const UpdateCustomerLedger = lazy(() => import('./components/Ledger/UpdateCustomerLedger.jsx'));

const UpdateLedger = lazy(() => import('./components/Ledger/UpdateLedger.jsx'));
const UpdateLedgerr = lazy(() => import('./components/Ledger/UpdateLedgerr.jsx'));
const Material = lazy(() => import('./components/Material/Material.jsx'));
const AddProduct = lazy(() => import('./components/Products/AddProduct.jsx'));
const ViewNotifications = lazy(() => import('./components/Notification/ViewNotifications.jsx'));
const ViewProduct = lazy(() => import('./components/Products/ViewProduct.jsx'));

const ExcelUploadProduct = lazy(() => import('./components/Products/ExcelUploadProduct.jsx'));
const ExcelUploadBulkInventory = lazy(() => import('./components/Products/ExcelUploadBulkInventory.jsx'));

const UpdateKani = lazy(() => import('./components/Kani/UpdateKani.jsx'));
const KaniSection = lazy(() => import('./components/Kani/KaniSection.jsx'));
const PashminaEmbroidery = lazy(() => import('./components/Kani/PashminaEmbroidery.jsx'));
const EmbroideryOrders = lazy(() => import('./components/Kani/EmbroideryOrders.jsx'));
const PashminaSuppliers = lazy(() => import('./components/Kani/PashminaSuppliers.jsx'));
const PashminaInProgress = lazy(() => import('./components/Kani/PashminaInProgress.jsx'));
const RetailEmbroidery = lazy(() => import('./components/Kani/RetailEmbroidery.jsx'));
const WholesaleEmbroidery = lazy(() => import('./components/Kani/WholesaleEmbroidery.jsx'));
const KlcEmbroidery = lazy(() => import('./components/Kani/KlcEmbroidery.jsx'));
const PashminaSupplier = lazy(() => import('./components/Kani/PashminaSupplier.jsx'));
const ContemporaryPashmina = lazy(() => import('./components/Kani/ContemporaryPashmina.jsx'));
const ContemporaryOrders = lazy(() => import('./components/Kani/ContemporaryOrders.jsx'));
const ContemporarySuppliers = lazy(() => import('./components/Kani/ContemporarySuppliers.jsx'));
const ContemporarySuppOrder = lazy(() => import('./components/Kani/ContemporarySuppOrder.jsx'));
const ContemporaryInProgress = lazy(() => import('./components/Kani/ContemporaryInProgress.jsx'));
const RetailContemporary = lazy(() => import('./components/Kani/RetailContemporary.jsx'));
const WholesaleContemporary = lazy(() => import('./components/Kani/WholesaleContemporary.jsx'));
const KlcContemporary = lazy(() => import('./components/Kani/KlcContemporary.jsx'));
const PapierMache = lazy(() => import('./components/Kani/PapierMache.jsx'));
const PapierMacheOrders = lazy(() => import('./components/Kani/PapierMacheOrders.jsx'));
const RetailPapierMache = lazy(() => import('./components/Kani/RetailPapierMache.jsx'));
const WholeSalePapierMache = lazy(() => import('./components/Kani/WholeSalePapierMache.jsx'));
const KlcPapierMache = lazy(() => import('./components/Kani/KlcPapierMache.jsx'));
const PapierMacheSuppliers = lazy(() => import('./components/Kani/PapierMacheSuppliers.jsx'));
const PapierMacheInProgress = lazy(() => import('./components/Kani/PapierMacheInProgress.jsx'));
const WoolEmbroidery = lazy(() => import('./components/Kani/WoolEmbroidery.jsx'));
const WoolEmbroideryOrders = lazy(() => import('./components/Kani/WoolEmbroideryOrders.jsx'));
const WoolSuppliers = lazy(() => import('./components/Kani/WoolSuppliers.jsx'));
const WoolSupplierOrders = lazy(() => import('./components/Kani/WoolSupplierOrders.jsx'));
const WoolInProgress = lazy(() => import('./components/Kani/WoolInProgress.jsx'));
const WoolWholesaleOrders = lazy(() => import('./components/Kani/WoolWholesaleOrders.jsx'));
const WoolKlcOrders = lazy(() => import('./components/Kani/WoolKlcOrders.jsx'));
const WoolRetailOrders = lazy(() => import('./components/Kani/WoolRetailOrders.jsx'));
const ContemporaryWool = lazy(() => import('./components/Kani/ContemporaryWool.jsx'));
const ContemporaryWoolOrders = lazy(() => import('./components/Kani/ContemporaryWoolOrders.jsx'));
const RetailContWool = lazy(() => import('./components/Kani/RetailContWool.jsx'));
const ContWoolWholesale = lazy(() => import('./components/Kani/ContWoolWholesale.jsx'));
const ContWoolKlc = lazy(() => import('./components/Kani/ContWoolKlc.jsx'));
const ContWoolSuppliers = lazy(() => import('./components/Kani/ContWoolSuppliers.jsx'));
const ContWoolInProgress = lazy(() => import('./components/Kani/ContWoolInProgress.jsx'));
const ContWoolSuppOrders = lazy(() => import('./components/Kani/ContWoolSuppOrders.jsx'));
const Cotton = lazy(() => import('./components/Kani/Cotton.jsx'));
const CottonOrders = lazy(() => import('./components/Kani/CottonOrders.jsx'));
const CottonSuppliers = lazy(() => import('./components/Kani/CottonSuppliers.jsx'));
const CottonSuppOrder = lazy(() => import('./components/Kani/CottonSuppOrder.jsx'));
const CottonInProgress = lazy(() => import('./components/Kani/CottonInProgress.jsx'));
const CottonRetail = lazy(() => import('./components/Kani/CottonRetail.jsx'));
const CottonWholesale = lazy(() => import('./components/Kani/CottonWholesale.jsx'));
const CottonKlc = lazy(() => import('./components/Kani/CottonKlc.jsx'));
const ContemporarySaree = lazy(() => import('./components/Kani/ContemporarySaree.jsx'));
const ContemporarySareeOrders = lazy(() => import('./components/Kani/ContemporarySareeOrders.jsx'));
const SareeSuppliers = lazy(() => import('./components/Kani/SareeSuppliers.jsx'));
const SareeInProgress = lazy(() => import('./components/Kani/SareeInProgress.jsx'));
const SareeSuppOrder = lazy(() => import('./components/Kani/SareeSuppOrder.jsx'));
const SareeRetail = lazy(() => import('./components/Kani/SareeRetail.jsx'));
const SareeWholesale = lazy(() => import('./components/Kani/SareeWholesale.jsx'));
const SareeKlc = lazy(() => import('./components/Kani/SareeKlc.jsx'));
const PapierMachieSuppOrders = lazy(() => import('./components/Kani/PapierMachieSuppOrders.jsx'));

const AddBom = lazy(() => import('./components/Products/AddBom.jsx'));
const AddLocationInventory = lazy(() => import('./components/Products/AddLoctionInventory.jsx'));

const UpdateBom = lazy(() => import('./components/Products/UpdateBom.jsx'));
const UpdateProduct = lazy(() => import('./components/Products/UpdateProduct.jsx'));
const UpdateLocationInventory = lazy(() => import('./components/Products/UpdateLocationInventory.jsx'));



const FormLayout = lazy(() => import('./pages/Form/FormLayout.js'));
const Profile = lazy(() => import('./pages/Profile.js'));
const Settings = lazy(() => import('./pages/Settings.js'));
const Tables = lazy(() => import('./pages/Tables.js'));
const Alerts = lazy(() => import('./pages/UiElements/Alerts.js'));
const PageNotFOund = lazy(() => import('./pages/PageNotFOund.jsx'));

const Buttons = lazy(() => import('./pages/UiElements/Buttons.js'));
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';
import RoleBasedRoute from './PrivateRoute/RoleBasedRoute.jsx';
const Budget = lazy(() => import('./components/Budget/Budget.jsx'));


const ViewBudget = lazy(() => import('./components/Budget/ViewBudget.jsx'));
const BudgetReport = lazy(() => import('./components/Budget/BudgetReport.jsx'));

const BudgetReportView = lazy(() => import('./components/Budget/BudgetReportView.jsx'));

const UpdateBudget = lazy(() => import('./components/Budget/UpdateBudget.jsx'));

const AddWeave = lazy(() => import('./components/Configurator/AddWeave.jsx'));
const Size = lazy(() => import('./components/Configurator/Size.jsx'));
const Design = lazy(() => import('./components/Configurator/Design.jsx'));
const Style = lazy(() => import('./components/Configurator/Style.jsx'));
const Currency = lazy(() => import('./components/Configurator/Currency.jsx'));
const Unit = lazy(() => import('./components/Configurator/Unit.jsx'));
const ProductGroup = lazy(() => import('./components/Configurator/ProductGroup.jsx'));

const ProductSubGroup = lazy(() => import('./components/Configurator/ProductSubGroup.jsx'));
const AddColorGroup = lazy(() => import('./components/Configurator/AddColorGroup.jsx'));
const AddProductCategory = lazy(() => import('./components/Configurator/AddProductCategory.jsx'));
const CustomerGroup = lazy(() => import('./components/Configurator/CustomerGroup.jsx'));
const OrderType = lazy(() => import('./components/Configurator/OrderType.jsx'));
const HsnCode = lazy(() => import('./components/Configurator/HsnCode.jsx'));
const Location = lazy(() => import('./components/Configurator/Location.jsx'));
const Supplier = lazy(() => import('./components/Configurator/Supplier.jsx'));

const AddSupplier = lazy(() => import('./components/Supplier/AddSupplier.jsx'));
const ViewLedger = lazy(() => import('./components/Supplier/SupplierLedger/ViewLedger.jsx'));
// import LedgerPrintPage from './components/Supplier/SupplierLedger/LedgerPrintPage.jsx';

// import ViewSuppLedger from './components/Supplier/SupplierLedger/ViewSuppLedger.jsx';

const AddBulkSupplier = lazy(() => import('./components/Supplier/AddBulkSupplier.jsx'));

const ViewSupplier = lazy(() => import('./components/Supplier/ViewSupplier.jsx'));
const UpdateSupplier = lazy(() => import('./components/Supplier/UpdateSupplier.jsx'));

const MaterialPo = lazy(() => import('./components/PuchaseOrder/MaterialPo'));
const ViewMaterialPo = lazy(() => import('./components/PuchaseOrder/ViewMaterialPo'));
const UpdateMaterialPo = lazy(() => import('./components/PuchaseOrder/UpdateMaterialPo.jsx'));

const AddOrder = lazy(() => import('./components/Order/AddOrder'));
const Fiber = lazy(() => import('./components/Order/Fiber.jsx'));

const Reports = lazy(() => import('./components/Reports/Reports.jsx'));
const ProductReport = lazy(() => import('./components/Reports/ProductReport.jsx'));




const RetailWholeSaleReport = lazy(() => import('./components/Reports/RetailWholesaleReport.jsx'));

const CreditorsReports = lazy(() => import('./components/AccReports/CreditorsReports.jsx'));

const ClientReports = lazy(() => import('./components/AccReports/ClientReports.jsx'));
const ProfitLossReports = lazy(() => import('./components/AccReports/ProfitLossReports.jsx'));
const LoyaltyPointsSystemReport = lazy(() => import('./components/AccReports/LoyaltyPointsSystemReport.jsx'));
const StockReports = lazy(() => import('./components/AccReports/StockReports.jsx'));
const DebitorsReports = lazy(() => import('./components/AccReports/DebitorsReports.jsx'));
const SalesReports = lazy(() => import('./components/AccReports/SalesReports.jsx'));

const PurchaseReports = lazy(() => import('./components/AccReports/PurchaseReports.jsx'));

const FinanceReportByDate = lazy(() => import('./components/Reports/FinanceReportByDate.jsx'));


const ViewPerforma = lazy(() => import('./components/Order/ViewPerforma'));

const DownloadPerformaws = lazy(() => import('./components/Order/DownloadPerformaws'));

const DownloadPerformare = lazy(() => import('./components/Order/DownloadPerformare'));

const ViewOrder = lazy(() => import('./components/Order/ViewOrder.jsx'));

const EditOrderCreated = lazy(() => import('./components/Order/EditOrderCreated.jsx'));

const UpdateOrderStatus = lazy(() => import('./components/Order/UpdateOrderStatus.jsx'));
const OrderProforma = lazy(() => import('./components/Order/Proforma/OrderProforma.jsx'));
const UpdateOrderProforma = lazy(() => import('./components/Order/Proforma/UpdateOrderProforma.jsx'));
const UpdateRetailProforma = lazy(() => import('./components/Order/Proforma/UpdateRetailProforma.jsx'));
const RetailOrderProforma = lazy(() => import('./components/Order/Proforma/RetailOrderProforma.jsx'));



const UpdatePartiallyOrderStatus = lazy(() => import('./components/Order/UpdatePartiallyOrderStatus.jsx'));
const UpdatePartiallyApprovedOrder = lazy(() => import('./components/Order/UpdatePartiallyApprovedOrder.jsx'));
const UpdatePartiallyPending = lazy(() => import('./components/Order/UpdatePartiallyPending.jsx'));
const UpdateOrderCancelled = lazy(() => import('./components/Order/UpdateOrderCancelled.jsx'));

const UpdatePartiallyClosed = lazy(() => import('./components/Order/UpdatePartiallyClosed.jsx'));

const UpdateOrderRecieving = lazy(() => import('./components/Order/UpdateOrderRecieving.jsx'));
const UpdateForcedClosure = lazy(() => import('./components/Order/UpdateForcedClosure.jsx'));
const UpdateChallan = lazy(() => import('./components/Order/UpdateChallan.jsx'));
const UpdateExpectedSupplierDate = lazy(() => import('./components/Order/UpdateExpectedSupplierDate.jsx'));

// import UpdateSupplierRecievingOrders from './components/Order/UpdateSupplierRecievingOrders.jsx';

const ViewExpectedDateOrder = lazy(() => import('./components/Order/ViewExpectedDateOrder.jsx'));

const ViewSupplierRecievingOrders = lazy(() => import('./components/Order/ViewSupplierRecievingOrders.jsx'));
const ViewOrderShippingDate = lazy(() => import('./components/Order/ViewOrderShippingDate.jsx'));

const ViewNeedModification = lazy(() => import('./components/Order/ViewNeedModification.jsx'));

const ViewOrderCancelled = lazy(() => import('./components/Order/ViewOrderCancelled.jsx'));



const IssueChalaan = lazy(() => import('./components/Order/IssueChalaan.jsx'));




const UpdateOrderProduct = lazy(() => import('./components/Order/UpdateOrderProduct.jsx'));
const ViewProductByOrderId = lazy(() => import('./components/Order/ViewProductByOrderId.jsx'));

const ViewOrderForcedClosure = lazy(() => import('./components/Order/ViewOrderForcedClosure.jsx'));
const ViewRecievedQuantity = lazy(() => import('./components/Order/ViewRecievedQuantity.jsx'));


const MonthlyOrders = lazy(() => import('./components/MonthlyOrders/MonthlyOrders.jsx'));


const ViewOrderCreated = lazy(() => import('./components/Order/ViewOrderCreated.jsx'));
const ViewOrderApproved = lazy(() => import('./components/Order/ViewOrderApproved.jsx'));

const PendingForBill = lazy(() => import('./components/Order/PendingForBill.jsx'));
const UpdatePendingForBill = lazy(() => import('./components/Order/UpdatePendingForBill.jsx'));



const ViewChallan = lazy(() => import('./components/Order/ViewChallan.jsx'));

const ViewOrderRejected = lazy(() => import('./components/Order/ViewOrderRejected.jsx'));



const ViewOrderPartiallyCreated = lazy(() => import('./components/Order/ViewOrderPartiallyCreated.jsx'));

const ViewOrderPartiallyApproved = lazy(() => import('./components/Order/ViewOrderPartiallyApproved.jsx'));

const ViewOrderExecuted = lazy(() => import('./components/Order/ViewOrderExecuted.jsx'));
const UpdateOrderAccepted = lazy(() => import('./components/Order/UpdateOrderAccepted.jsx'));
const UpdateOrderPending = lazy(() => import('./components/Order/UpdateOrderPending.jsx'));

const UpdateClosedOrder = lazy(() => import('./components/Order/UpdateClosedOrder.jsx'));

const ViewOrderPartiallyPending = lazy(() => import('./components/Order/ViewOrderPartiallyPending.jsx'));
const ViewOrderPending = lazy(() => import('./components/Order/ViewOrderPending.jsx'));

const ViewOrderClosed = lazy(() => import('./components/Order/ViewOrderClosed.jsx'));

const ViewOrderPartiallyClosed = lazy(() => import('./components/Order/ViewOrderPartiallyClosed.jsx'));









const UpdateOrder = lazy(() => import('./components/Order/UpdateOrder.jsx'));
const ViewOrderr = lazy(() => import('./components/Order/ViewOrderr.jsx'));
const UpdateOrderShippingDate = lazy(() => import('./components/Order/UpdateOrderShippingDate.jsx'));

const AddCustomer = lazy(() => import('./components/Customer/AddCustomer'));
const ViewZohoContact = lazy(() => import('./components/Customer/ViewZohoContact.jsx'));
const ExcelUploadCustomer = lazy(() => import('./components/Customer/AddCustomerBulk.jsx'));
const ExcelUploadLedger = lazy(() => import('./components/Ledger/BulkLedgerUpload.jsx'));

const ViewCustomer = lazy(() => import('./components/Customer/ViewCustomer'));
const UpdateCustomer = lazy(() => import('./components/Customer/UpdateCustomer'));
const CreateMaterialInventory = lazy(() => import('./components/Inventory/CreateMaterialInventory.jsx'));
const ViewMaterialInventory = lazy(() => import('./components/Inventory/ViewMaterialInventory.jsx'));
const UpdateInventoryMaterial = lazy(() => import('./components/Inventory/UpdateInventoryMaterial.jsx'));



//productInventory




const AddProductInventory = lazy(() => import('./components/ProductsInventory/AddProductInventory.jsx'));
const UpdateExcelInventory = lazy(() => import('./components/ProductsInventory/UpdateExcelInventory.jsx'));
const ViewRecentTransactions = lazy(() => import('./components/ProductsInventory/ViewRecentTransactions.jsx'));

const ViewProductsInventory = lazy(() => import('./components/ProductsInventory/ViewProductsInventory.jsx'));
const UpdateInventory = lazy(() => import('./components/ProductsInventory/UpdateInventory.jsx'));



const AddStockJournels = lazy(() => import('./components/StockJournell/AddStockJournels.jsx'));

const ShopifyPage = lazy(() => import('./components/shopifyPage/ShopifyPage.jsx'));
const ShopifyOrders = lazy(() => import('./components/shopifyPage/ShopifyOrders.jsx'));
const ShopifyInventory = lazy(() => import('./components/shopifyPage/ShopifyInventory.jsx'));
const AddStockJournell = lazy(() => import('./components/StockJournel/AddStockJournell.jsx'));
// import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';
const ViewStockJournels = lazy(() => import('./components/StockJournel/ViewStockJournels.jsx'));

const VerifyStockJournal = lazy(() => import('./components/StockJournel/VerifyStockJournal.jsx'));
const VerifyStockJournals = lazy(() => import('./components/StockJournel/VerifyStockJournals.jsx'));


const PrintStockJournals = lazy(() => import('./components/StockJournel/PrintStockJournals.jsx'));
const Godown = lazy(() => import('./components/Godown/Godown.jsx'));

const ViewStockJournalCreated = lazy(() => import('./components/StockJournel/ViewStockJournalCreated.jsx'));
const EditStockJournals = lazy(() => import('./components/StockJournel/EditStockJournals.jsx'));
// import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';

// import UpdateProduct from './components/Products/UpdateProduct';

const UpdateStockJournal = lazy(() => import('./components/StockJournel/UpdateStockJournal.jsx'));
// import { signoutSuccess } from './redux/Slice/UserSlice';

// import useInactivity from './hooks/useInactivity';

const ViewKaniProducts = lazy(() => import('./components/Kani/ViewKaniProducts.jsx'));
const ViewSupplierProduct = lazy(() => import('./components/Kani/ViewSupplierProduct.jsx'));
const KaniInProgress = lazy(() => import('./components/Kani/KaniInProgress.jsx'));
const UpdateKaniProducts = lazy(() => import('./components/Kani/UpdateKaniProducts.jsx'));
const UpdatePashminaProducts = lazy(() => import('./components/Kani/UpdatePashminaProducts.jsx'));

// import 'react-toastify/dist/ReactToastify.css';

// import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';

function App() {
  const { pathname } = useLocation();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // Logout function
  // const handleLogout = () => {
  //   dispatch(signoutSuccess());
  //   navigate('/auth/signin');
  //   toast.success('Logout:Session Expired ');
  // };

  // useInactivity(5 * 60 * 1000, handleLogout);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin " />
              <SignIn />
            </>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="AddUser " />
                <SignUp />
              </>
            }
          />

              <Route
            path="/auth/viewusers"
            element={
              <>
                <PageTitle title="AddUser " />
                <ViewUsers />
              </>
            }
          />
                <Route
            path="/auth/edit/:id"
            element={
              <>
                <PageTitle title="AddUser " />
                <EditUser />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="CRAFT-FLOW ERP" />
                <Chart />
              </>
            }
          />

             <Route
            path="/connectToShopify"
            element={
              <>
                <PageTitle title="CRAFT-FLOW ERP" />
                <ShopifyPage />
              </>
            }
          />

            <Route
            path="/configurator/accreports"
            element={
              <>
                <PageTitle title="CRAFT-FLOW ERP" />
                <AccReports />
              </>
            }
          />


          <Route
            path="/"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_VERIFIER", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR", "ROLE_USER", "ROLE_QUALITYCONTROL", "ROLE_FINANCE"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Home />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_FINANCE", 'ROLE_VERIFIER', "ROLE_USER", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR", "ROLE_QUALITYCONTROL"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Home />
              </>
            }
          />
          <Route
            path="/configurator/groups"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <Groups />
              </>
            }
          />
          {/* voucherss */}
           <Route
            path="/shopify/orders"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="shopify" />
                <ShopifyOrders />
              </>
            }
          />
            <Route
            path="/shopify/Inventory"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="shopify" />
                <ShopifyInventory />
              </>
            }
          />


          <Route
            path="/configurator/vouchers"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <Voucher />
              </>
            }
          />

          <Route
            path="/configurator/vouchers/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <Voucher />
              </>
            }
          />

          <Route
            path="/Voucher/update/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Edit Voucher" />
                <Voucher />
              </>
            }
          />


          <Route
            path="/configurator/dayBook"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Day Book" />
                <Daybook />
              </>
            }
          />

          <Route
            path="/configurator/ledgersummary"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Day Book" />
                <PaymentSummary />
              </>
            }
          />

          <Route
            path="/configurator/OrderVoucher"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Order Voucher" />
                <OrderVoucherView />
              </>
            }
          />

          <Route
            path="/configurator/AddLut"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Add Lut" />
                <AddLut />
              </>
            }
          />

          <Route
            path="/voucher/create/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <CreateVoucher />
              </>
            }
          />
            <Route
            path="/entrypayment/edit/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Edit Voucher" />
                <EditVoucher />
              </>
            }
          />

              <Route
            path="/create-voucher-from-order/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <CreateVoucherShopify />
              </>
            }
          />

             <Route
            path="/Voucher/updateVoucher/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Update" />
                <UpdateVoucher />
              </>
            }
          />

          {/* debit note */}

           <Route
            path="/voucher/createdebitNote/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="debit note" />
                <CreateDebitNote />
              </>
            }
          />
             <Route
            path="/voucher/createcreditNote/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="credit note" />
                <CreateCreditNote />
              </>
            }
          />
             <Route
            path="/voucher/createcontra/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="contra" />
                <CreateContra />
              </>
            }
          />
             <Route
            path="/voucher/createjournal/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Journal" />
                <CreateJournal />
              </>
            }
          />
             <Route
            path="/voucher/createreceipt/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="receipt" />
                <CreateReceipt />
              </>
            }
          />

          <Route
            path="/Purchasevoucher/create/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <CreateVoucherPurchase />
              </>
            }
          />

          <Route
            path="/voucherEntries/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <VoucherEntriesView />
              </>
            }
          />

           <Route
            path="/voucherEntriesStockJournal/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Stock Journal Entries" />
                <StockJournalView />
              </>
            }
          />


             <Route
            path="/printstockjournal/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Print Journal Entries" />
                <PrintStockJournal />
              </>
            }
          />

           <Route
            path="/voucherEntriesView/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Stock Journal Entries" />
                <VoucherEntriesDebitView />
              </>
            }
          />

           <Route
            path="/printentries/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Print ENtries" />
                <PrintCreditDebit />
              </>
            }
          />

          <Route
            path="/voucherEntriesPayment/:id"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries Payment" />
                <VoucherEntriesViewPayment />
              </>
            }
          />


          <Route
            path="/printentrypayment/:id/:gstRegistration?"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintEntryPayment />
              </>
            }
          />
          <Route
            path="/printentrypayments/:id/:gstRegistration"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintPaymentVoucher />
              </>
            }
          />

          <Route
            path="/printentrypaymentPos/:id/:gstRegistration"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher Entries" />
                <PrintPosEntryPayment />
              </>
            }
          />


          <Route
            path="/Vouchers/view"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}></RoleBasedRoute>
                <PageTitle title="Voucher" />
                <ViewVoucher />
              </>
            }
          />


          <Route
            path="/report/freports"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <FinancialReportDashboard />
              </>
            }
          />


          <Route
            path="/report/financial"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="Dashboard" />
                <GeneralFinancialReportDashboard />
              </>
            }
          />


             <Route
            path="/report/loyalityPointsReport"
            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="loyaltypoints" />
                <LoyaltyPointsSystemReport />
              </>
            }
          />



          <Route
            path="/calendar"

            element={
              <>
                <RoleBasedRoute allowedRoles={["ROLE_ADMIN", "ROLE_APPROVER", "ROLE_EXECUTOR", "ROLE_ADMIN_DLI", "ROLE_ADMIN_SXR"]}></RoleBasedRoute>
                <PageTitle title="Calendar " />
                <Calendar />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile " />
                <Profile />
              </>
            }
          />

          {/* Calenders */}
          <Route
            path="/Order/monthlyorders"
            element={
              <>
                <PageTitle title="Monthly Orders" />
                <MonthlyOrders />
              </>
            }
          />
          {/* Order */}

          <Route
            path="/Order/addOrder"
            element={
              <>
                <PageTitle title="Add Order" />
                <AddOrder />
              </>
            }
          />
            <Route
            path="/Order/Fiber"
            element={
              <>
                <PageTitle title="Fiber Allocated Details" />
                <Fiber />
              </>
            }
          />
          <Route
            path="/Reports"
            element={
              <>
                <PageTitle title="Add Order" />
                <Reports />
              </>
            }
          />

          <Route
            path="/report/product"
            element={
              <>
                <PageTitle title="Add Order" />
                <ProductReport />
              </>
            }
          />

          <Route
            path="/report/wsRetailReport"
            element={
              <>
                <PageTitle title="Retail WholeSale Report" />
                <RetailWholeSaleReport />
              </>
            }
          />

           <Route
            path="/accReport/Creditors"
            element={
              <>
                <PageTitle title="Creditors Report" />
                <CreditorsReports />
              </>
            }
          />

           <Route
            path="/accReport/Client"
            element={
              <>
                <PageTitle title="Client Report" />
                <ClientReports />
              </>
            }
          />

             <Route
            path="/accReport/ProfitLoss"
            element={
              <>
                <PageTitle title="Profit & Loss Report" />
                <ProfitLossReports />
              </>
            }
          />

             <Route
            path="/accReport/Stock"
            element={
              <>
                <PageTitle title="Stock Report" />
                <StockReports />
              </>
            }
          />

           <Route
            path="/accReport/Deditors"
            element={
              <>
                <PageTitle title="Debitors Report" />
                <DebitorsReports />
              </>
            }
          />

           <Route
            path="/accReport/Sales"
            element={
              <>
                <PageTitle title="Sales Report" />
                <SalesReports />
              </>
            }
          />

           <Route
            path="/accReport/Purchase"
            element={
              <>
                <PageTitle title="Purchase Report" />
                <PurchaseReports />
              </>
            }
          />

          <Route
            path="/report/freportdate"
            element={
              <>
                <PageTitle title="Retail WholeSale Report" />
                <FinanceReportByDate />
              </>
            }
          />

          <Route
            path="/order/searchproforma"
            element={
              <>
                <PageTitle title="View Proforma" />
                <ViewPerforma />
              </>
            }
          />
          <Route
            path="/Order/orderPerformaws/:id"
            element={
              <>
                <PageTitle title="View Proforma" />
                <DownloadPerformaws />
              </>
            }
          />
          <Route
            path="/Order/orderPerformare/:id"
            element={
              <>
                <PageTitle title="View Proforma" />
                <DownloadPerformare />
              </>
            }
          />
          <Route
            path="/Order/viewOrder"
            element={
              <>
                <PageTitle title="View Order " />
                <ViewOrder />
              </>
            }
          />

          <Route
            path="/Order/ViewOrderCreated"
            element={
              <>
                <PageTitle title="Edit Order " />
                <EditOrderCreated />
              </>
            }
          />

          <Route
            path="/Order/updateorderCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateOrderStatus />
              </>
            }
          />

          <Route
            path="/Order/generateProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <OrderProforma />
              </>
            }
          />
          <Route
            path="/Order/generateRetailProforma/:id"
            element={
              <>
                <PageTitle title="Create Retail Order Proforma" />
                <RetailOrderProforma />
              </>
            }
          />

          <Route
            path="/Order/updateOrderProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <UpdateOrderProforma />
              </>
            }
          />

          <Route
            path="/Order/updateRetailProforma/:id"
            element={
              <>
                <PageTitle title="Create Order Proforma" />
                <UpdateRetailProforma />
              </>
            }
          />




          <Route
            path="/Order/updateorderPartiallyCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyOrderStatus />
              </>
            }
          />





          <Route
            path="/Order/updateorderPartiallyCreated/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyOrderStatus />
              </>
            }
          />


          <Route
            path="/Order/updatepartiallyApproved/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyApprovedOrder />
              </>
            }
          />


          <Route
            path="/Order/updateorderPartiallyPending/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyPending />
              </>
            }
          />

          <Route
            path="/Order/updateCancelledOrders/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateOrderCancelled />
              </>
            }
          />



          <Route
            path="/Order/updatepartiallyClosed/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdatePartiallyClosed />
              </>
            }
          />

          <Route
            path="/order/updateorderproduct/:id"
            element={
              <>
                <PageTitle title="Update Order" />
                <UpdateOrderRecieving />
              </>
            }
          />








          <Route
            path="/order/modifyproductafterexecution/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <IssueChalaan />
              </>
            }
          />

          <Route
            path="/Order/updateorderForcedClosure/:id"
            element={
              <>
                <PageTitle title="Update Order Status" />
                <UpdateForcedClosure />
              </>
            }
          />

          <Route
            path="/Order/updateChallan/:id"
            element={
              <>
                <PageTitle title="Update Challan" />
                <UpdateChallan />
              </>
            }
          />

          <Route
            path="/Order/updateExpectedDate/:id"
            element={
              <>
                <PageTitle title="Update Challan" />
                <UpdateExpectedSupplierDate />
              </>
            }
          />

          <Route
            path="/order/supplierExpectdateUpdate"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewExpectedDateOrder />
              </>
            }
          />

          <Route
            path="/order/supplierRecievingOrders"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewSupplierRecievingOrders />
              </>
            }
          />

          <Route
            path="/order/updateShippingDate"
            element={
              <>
                <PageTitle title="Update Expected Date " />
                <ViewOrderShippingDate />
              </>
            }
          />

          <Route
            path="/delayedOrders"
            element={
              <>
                <PageTitle title="Delayed Orders" />
                <ViewNotifications />
              </>
            }
          />


          <Route
            path="/order/needModification"
            element={
              <>
                <PageTitle title="Need Modification " />
                <ViewNeedModification />
              </>
            }
          />

          <Route
            path="/order/Cancelled"
            element={
              <>
                <PageTitle title="Cancelled Orders " />
                <ViewOrderCancelled />
              </>
            }
          />

          <Route
            path="/godown/viewGodown"
            element={
              <>
                <PageTitle title="Cancelled Orders " />
                <Godown />
              </>
            }
          />



          <Route
            path="/order/modifyorderproduct/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <UpdateOrderProduct />
              </>
            }
          />

          <Route path="/UpdateKani/:id" element={<UpdateKani />} />

          {/* View Kani Products route */}

          <Route path="/kani-products/view/:id" element={<ViewKaniProducts />} />
          <Route path="/filter-suppliers" element={<FilterSupplier />} />
          <Route
            path="/supplier-product/view/:id"
            element={<ViewSupplierProduct />}
          />
           <Route path="/supplier-order/:id" element={<SupplierOrder />} />
           <Route path="/kani-in-progress" element={<KaniInProgress />} />
           <Route
              path="/UpdateKaniProducts/:id"
              element={<UpdateKaniProducts />}
            />
            <Route
              path="/UpdatePashminaProducts/:id"
              element={<UpdatePashminaProducts />}
            />
             <Route path="/ClientOrders" element={<KaniClientOrders />} />
             <Route path="/RetailClientOrders" element={<RetailClientOrders />} />
             <Route path="/WholesaleClientOrders" element={<WholesaleClientOrders />} />
             <Route path="/KlcOrders" element={<KlcOrders />} />
          <Route path="/supplier-order/:id" element={<SupplierOrder />} />
          <Route path="/kani-in-progress" element={<KaniInProgress />} />
          <Route
            path="/UpdateKaniProducts/:id"
            element={<UpdateKaniProducts />}
          />
          <Route path="/ClientOrders" element={<KaniClientOrders />} />
          <Route path="/RetailClientOrders" element={<RetailClientOrders />} />
           <Route path="/kaniSection" element={<KaniSection />} />
           <Route path="/pashminaEmbroidery" element={<PashminaEmbroidery />} />
           <Route path="/embroideryOrders" element={<EmbroideryOrders />} />
           <Route path="/pashminaSuppliers" element={<PashminaSuppliers />} />
           <Route path="/inProgress-pashminaEmbroidery" element={<PashminaInProgress />} />
            <Route path="/pashminaEmbroidery/retail-client-orders" element={<RetailEmbroidery />} />
             <Route path="/WholesaleEmbroidery" element={<WholesaleEmbroidery />} />
             <Route path="/KlcEmbroidery" element={<KlcEmbroidery />} />
              <Route path="/pashmina_supplier-order/:id" element={<PashminaSupplier />} />
              <Route path="/contemporaryPashmina" element={<ContemporaryPashmina />} />
               <Route path="/contemporaryOrders" element={<ContemporaryOrders />} />
               <Route path="/contemporarySuppliers" element={<ContemporarySuppliers />} />
                <Route path="/contemporarySuppOrd/:id" element={<ContemporarySuppOrder />} />
                <Route path="/contemporary-in-progress" element={<ContemporaryInProgress />} />
                <Route path="/contemporary/retail-client-orders" element={<RetailContemporary />} />
                 <Route path="/contemporary/wholesale-client-orders" element={<WholesaleContemporary />} />
                  <Route path="/klcContemporary" element={<KlcContemporary />} />
                  <Route path="/papierMache" element={<PapierMache />} />
                  <Route path="/papierMacheOrders" element={<PapierMacheOrders />} />
                  <Route path="/papierMache/retail-client-orders" element={<RetailPapierMache />} />
                  <Route path="/papierMache/wholesale-client-orders" element={<WholeSalePapierMache />} />
                  <Route path="/klcPapierMache" element={<KlcPapierMache />} />
                  <Route path="/paperMache_filter-suppliers" element={<PapierMacheSuppliers />} />
                  <Route path="/paper-mache-in-progress" element={<PapierMacheInProgress />} />
                  <Route path="/woolEmbroidery" element={<WoolEmbroidery />} />
                  <Route path="/woolEmbroideryOrders" element={<WoolEmbroideryOrders />} />
                  <Route path="/wool_filter-suppliers" element={<WoolSuppliers />} />
                  <Route path="/woolSuppOrd/:id" element={<WoolSupplierOrders />} />
                  <Route path="/wool-in-progress" element={<WoolInProgress />} />
                  <Route path="/wool-wholesale-orders" element={<WoolWholesaleOrders />} />
                  <Route path="/wool-klc-orders" element={<WoolKlcOrders />} />
                  <Route path="/wool-retail-orders" element={<WoolRetailOrders />} />
                  <Route path="/contemporaryWool" element={<ContemporaryWool />} />
                  <Route path="/contemporaryWoolOrders" element={<ContemporaryWoolOrders />} />
                  <Route path="/RetailContWoolOrders" element={<RetailContWool />} />
                  <Route path="/ContWoolWholesaleOrders" element={<ContWoolWholesale />} />
                  <Route path="/ContWoolKlcOrders" element={<ContWoolKlc />} />
                  <Route path="/contWoolSuppliers" element={<ContWoolSuppliers />} />
                  <Route path="/contWool-in-progress" element={<ContWoolInProgress />} />
                  <Route path="/Cont_supplier-order/:id" element={<ContWoolSuppOrders />} />
                  <Route path="/cotton" element={<Cotton />} />
                  <Route path="/cottonOrders" element={<CottonOrders />} />
                  <Route path="/Cotton_filter-suppliers" element={<CottonSuppliers />} />
                  <Route path="/cottonSuppOrd/:id" element={<CottonSuppOrder />} />
                  <Route path="/cotton-in-progress" element={<CottonInProgress />} />
                  <Route path="/cotton/retail-client-orders" element={<CottonRetail />} />
                  <Route path="/cotton/wholesale-client-orders" element={<CottonWholesale />} />
                  <Route path="/cotton-klc-orders" element={<CottonKlc />} />
                  <Route path="/contemporarySaree" element={<ContemporarySaree />} />
                  <Route path="/contemporarySareeOrders" element={<ContemporarySareeOrders />} />
                  <Route path="/saree-suppliers" element={<SareeSuppliers />} />
                  <Route path="/Saree-in-progress" element={<SareeInProgress />} />
                  <Route path="/supplierSaree-order/:id" element={<SareeSuppOrder />} />
                  <Route path="/sareeRetail" element={<SareeRetail />} />
                  <Route path="/sareeWholesale" element={<SareeWholesale />} />
                  <Route path="/sareeKlc" element={<SareeKlc />} />
                   <Route path="/papierMacheSuppliers/:id" element={<PapierMachieSuppOrders />} />
            
            







          <Route
            path="/Order/updateorderExecuted/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <UpdateOrderAccepted />
              </>
            }
          />

          <Route
            path="/Order/updateorderPending/:id"
            element={
              <>
                <PageTitle title="Update Order Pending " />
                <UpdateOrderPending />
              </>
            }
          />

          <Route
            path="/Order/updateorderClosed/:id"
            element={
              <>
                <PageTitle title="Update Order Pending " />
                <UpdateClosedOrder />
              </>
            }
          />




          <Route
            path="/order/viewProduct/:id"
            element={
              <>
                <PageTitle title="Update Order Product " />
                <ViewProductByOrderId />
              </>
            }
          />

          <Route
            path="/Order/created"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderCreated />
              </>
            }
          />

          <Route
            path="/order/Approved"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderApproved />
              </>
            }
          />
          {/* Pending for bill */}
          <Route
            path="/Recieved/pendingForBill"
            element={
              <>
                <PageTitle title="View Order Created " />
                <PendingForBill />
              </>
            }
          />


          <Route
  path="/kaniProducts"
  element={
    <>
      <PageTitle title="Production Dashboard" />
      <KaniProducts />
    </>
  }
/>
<Route
  path="/ProductGroupDetails/:id"  // Add productGroupName parameter
  element={
    <>
      <PageTitle title="Production Dashboard" />
      <ProductGroupDetails />
    </>
  }
/>

          <Route
            path="/Order/updatependingforbill/:id"
            element={
              <>
                <PageTitle title="Update Pending For Bill " />
                <UpdatePendingForBill />
              </>
            }
          />


          <Route
            path="/orderlist/UpdateChallan"
            element={
              <>
                <PageTitle title="View Challan " />
                <ViewChallan />
              </>
            }
          />

          <Route
            path="/orderlist/RejectedOrders"
            element={
              <>
                <PageTitle title="View Challan " />
                <ViewOrderRejected />
              </>
            }
          />



          <Route
            path="/order/partiallyexecuted"
            element={
              <>
                <PageTitle title="View Order Created " />
                <ViewOrderPartiallyCreated />
              </>
            }
          />

          <Route
            path="/orderlist/ForcedClosure"
            element={
              <>
                <PageTitle title="View Order Forced Closure " />
                <ViewOrderForcedClosure />
              </>
            }
          />

          <Route
            path="/order/recievedQuantity"
            element={
              <>
                <PageTitle title="View Recieved Quantity " />
                <ViewRecievedQuantity />
              </>
            }
          />

          <Route
            path="/order/partiallyApproved"
            element={
              <>
                <PageTitle title="View Order Partially Approved " />
                <ViewOrderPartiallyApproved />
              </>
            }
          />



          <Route
            path="/orderlist/Executed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderExecuted />
              </>
            }
          />

          <Route
            path="/orderlist/PartiallyPending"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPartiallyPending />
              </>
            }
          />



          <Route
            path="/orderlist/Pending"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPending />
              </>
            }
          />

          <Route
            path="/orderlist/PartiallyClosed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderPartiallyClosed />
              </>
            }
          />

          <Route
            path="/orderlist/Closed"
            element={
              <>
                <PageTitle title="View Order Executed" />
                <ViewOrderClosed />
              </>
            }
          />





          {/*  Products realted routes  */}

          <Route
            path="/product/addProduct"
            element={
              <>
                <PageTitle title="Add Product" />
                <AddProduct />
              </>
            }
          />

          {/* Excel Upload */}
          <Route
            path="/product/addExcelProduct"
            element={
              <>
                <PageTitle title="Excel Upload Product" />
                <ExcelUploadProduct />
              </>
            }
          />

          <Route
            path="/product/addBulkInventory"
            element={
              <>
                <PageTitle title="Excel Upload Product" />
                <ExcelUploadBulkInventory />
              </>
            }
          />
          <Route
            path="/product/viewProducts"
            element={
              <>
                <PageTitle title="View Product" />
                <ViewProduct />
              </>
            }
          />
          <Route
            path="/product/updateProduct/:id"
            element={
              <>
                <PageTitle title="View Product" />
                <UpdateProduct />
              </>
            }
          />

          <Route
            path="/UpdateKani"
            element={
              <>
                <PageTitle title="Update Kani" />
                <UpdateKani />
              </>
            }
          />

          <Route
            path="/product/updateInventory/:id"
            element={
              <>
                <PageTitle title="View Product" />
                <UpdateLocationInventory />
              </>
            }
          />

          <Route
            path="/order/updateOrder/:id"
            element={
              <>
                <PageTitle title="View Order" />
                <UpdateOrder />
              </>
            }
          />
            <Route
            path="/order/viewOrder/:id"
            element={
              <>
                <PageTitle title="View Order" />
                <ViewOrderr />
              </>
            }
          />

          <Route
            path="/Order/updateorderShippingDate/:id"
            element={
              <>
                <PageTitle title="Update Order Shipping Date" />
                <UpdateOrderShippingDate />
              </>
            }
          />

          <Route
            path="/product/addBom/:id"
            element={
              <>
                <PageTitle title="View B.O.M" />
                <AddBom />
              </>
            }
          />
          <Route
            path="/product/addInventoryLocation/:id"
            element={
              <>
                <PageTitle title="Add Location Inventory" />
                <AddLocationInventory />
              </>
            }
          />
          <Route
            path="/product/updateBom/:id"
            element={
              <>
                <PageTitle title="View B.O.M" />
                <UpdateBom />
              </>
            }
          />
          <Route
            path="/product/updateProduct/:id"
            element={
              <>
                <PageTitle title="Update Product" />
                <UpdateProduct />
              </>
            }
          />

          <Route
            path="/material/addMaterial"
            element={
              <>
                <PageTitle title="Add Material" />
                <Material />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout " />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables " />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings " />
                <Settings />
              </>
            }
          />

          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons " />
                <Buttons />
              </>
            }
          />

          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup" />
                <SignUp />
              </>
            }
          />

          {/* configurator */}
          <Route
            path="/configurator/addbudget"
            element={
              <>
                <PageTitle title="Budget" />
                <Budget />
              </>
            }
          />

           <Route
            path="/configurator/weave"
            element={
              <>
                <PageTitle title="Weave" />
                <AddWeave />
              </>
            }
          />
          <Route
            path="/budget/viewBudget"
            element={
              <>
                <PageTitle title="View Budget" />
                <ViewBudget />
              </>
            }
          />

          <Route
            path="/report/budgetReport"
            element={
              <>
                <PageTitle title="View Budget Report By Date" />
                <BudgetReport />
              </>
            }
          />

          <Route
            path="/report/budgetReportbyDate"
            element={
              <>
                <PageTitle title="Budget Report By Date" />
                <BudgetReportView />
              </>
            }
          />
          <Route
            path="/Budget/updateBudget/:id"
            element={
              <>
                <PageTitle title="View Budget" />
                <UpdateBudget />
              </>
            }
          />



          <Route
            path="/configurator/addSize"
            element={
              <>
                <PageTitle title="Size" />
                <Size />
              </>
            }
          />
          <Route
            path="/configurator/adddesign"
            element={
              <>
                <PageTitle title="Size" />
                <Design />
              </>
            }
          />
          <Route
            path="/configurator/suplier"
            element={
              <>
                <PageTitle title="Size" />
                <Supplier />
              </>
            }
          />

          <Route
            path="/kaniOrders"
            element={
              <>
                <PageTitle title="Size" />
                <KaniOrders />
              </>
            }
          />

          {/* Supplier Ledger */}

          <Route
            path="/Ledger/CreateLedger"
            element={
              <>
                <PageTitle title="Size" />
                <CreateLedger />
              </>
            }
          />

          <Route
            path="/ledger/view"
            element={
              <>
                <PageTitle title="Size" />
                <ViewLedger />
              </>
            }
          />


        {/* <Route path="/print/ledger" element={<LedgerPrintPage />} />
          <Route
            path="/Supplier/Viewledger"
            element={
              <>
                <PageTitle title="Size" />
                <ViewSuppLedger />
              </>
            }
          /> */}

          <Route
            path="/ledger/AddBulk"
            element={
              <>
                <PageTitle title="Size" />
                <ExcelUploadLedger />
              </>
            }
          />
          <Route
            path="/supplier/updateLedger/:id"
            element={
              <>
                <PageTitle title="Size" />
                <UpdateLedger />
              </>
            }
          />
          <Route
            path="/Ledger/updateLedger/:id"
            element={
              <>
                <PageTitle title="Size" />
                <UpdateLedgerr />
              </>
            }
          />




          <Route
            path="/configurator/addStyle"
            element={
              <>
                <PageTitle title="Style" />
                <Style />
              </>
            }
          />
          <Route
            path="/configurator/addCurrency"
            element={
              <>
                <PageTitle title="Currency" />
                <Currency />
              </>
            }
          />
          <Route
            path="/configurator/addunit"
            element={
              <>
                <PageTitle title="Unit" />
                <Unit />
              </>
            }
          />
          <Route
            path="/configurator/addproductgroup"
            element={
              <>
                <PageTitle title="Add Product Group" />
                <ProductGroup />
              </>
            }
          />

          <Route
            path="/configurator/addproductSubgroup"
            element={
              <>
                <PageTitle title="Add Product Group" />
                <ProductSubGroup />
              </>
            }
          />

          <Route
            path="/configurator/addDesigngroup"
            element={
              <>
                <PageTitle title="Add Color Group" />
                <AddColorGroup />
              </>
            }
          />
          <Route
            path="/configurator/addproductstatus"
            element={
              <>
                <PageTitle title="Add Product Category" />
                <AddProductCategory />
              </>
            }
          />
          <Route
            path="/configurator/addcustomergroup"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <CustomerGroup />
              </>
            }
          />

          <Route
            path="/configurator/addordertype"
            element={
              <>
                <PageTitle title="Add Order Type" />
                <OrderType />
              </>
            }
          />
          <Route
            path="/configurator/addgstclassification"
            element={
              <>
                <PageTitle title="Add Gst Classification" />
                <HsnCode />
              </>
            }
          />

          {/* seperate routes */}

          <Route
            path="/supplier/add"
            element={
              <>
                <PageTitle title="Add Supplier" />
                <AddSupplier />
              </>
            }
          />

          <Route
            path="/supplier/addBulkSupplier"
            element={
              <>
                <PageTitle title="Add Bulk Supplier" />
                <AddBulkSupplier />
              </>
            }
          />

          <Route
            path="/supplier/view"
            element={
              <>
                <PageTitle title="View Supplier" />
                <ViewSupplier />
              </>
            }
          />

          <Route
            path="/customer/addCustomer"
            element={
              <>
                <PageTitle title="Add Customer" />
                <AddCustomer />
              </>
            }
          />

             <Route
            path="/customer/viewzoho"
            element={
              <>
                <PageTitle title="Zoho Contacts" />
                <ViewZohoContact />
              </>
            }
          />
          <Route
            path="/customer/updateLedger/:id"
            element={
              <>
                <PageTitle title="Update Customer Ledger" />
                <UpdateCustomerLedger />
              </>
            }
          />


          <Route
            path="/customer/addCustomerBulk"
            element={
              <>
                <PageTitle title="Add Customer" />
                <ExcelUploadCustomer />
              </>
            }
          />


          <Route
            path="/customer/viewCustomer"
            element={
              <>
                <PageTitle title="View Customer" />
                <ViewCustomer />
              </>
            }
          />
          <Route
            path="/customer/updateCustomer/:id"
            element={
              <>
                <PageTitle title="Update Customer" />
                <UpdateCustomer />
              </>
            }
          />
          <Route
            path="/configurator/location"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <Location />
              </>
            }
          />
          <Route
            path="/configurator/addunit"
            element={
              <>
                <PageTitle title="Add Customer Group" />
                <Unit />
              </>
            }
          />

          {/* purchase orders */}
          <Route
            path="/material/addPurchase"
            element={
              <>
                <PageTitle title="Add Purchase" />
                <MaterialPo />
              </>
            }
          />
          <Route
            path="/material/viewPurchase"
            element={
              <>
                <PageTitle title="View Purchase" />
                <ViewMaterialPo />
              </>
            }
          />
          <Route
            path="/material/updatematerialPo/:id"
            element={
              <>
                <PageTitle title="Update Material PO" />
                <UpdateMaterialPo />
              </>
            }
          />
          <Route
            path="/supplier/updateSupplier/:id"
            element={
              <>
                <PageTitle title="Update Supplier" />
                <UpdateSupplier />
              </>
            }
          />
          <Route
            path="/inventory/addMaterialInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <CreateMaterialInventory />
              </>
            }
          />

          <Route
            path="/inventory/viewMaterialInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <ViewMaterialInventory />
              </>
            }
          />





          <Route
            path="/inventory/addProductInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <AddProductInventory />
              </>
            }
          />

          <Route
            path="/inventory/ExcelUpdateInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <UpdateExcelInventory />
              </>
            }
          />

          <Route
            path="/inventory/recentTransacTions"
            element={
              <>
                <PageTitle title="Recent Transactions" />
                <ViewRecentTransactions />
              </>
            }
          />

          <Route
            path="/inventory/updateInventory/:id"
            element={
              <>
                <PageTitle title="Update Inventory" />
                <UpdateInventory />
              </>
            }
          />

          <Route
            path="/inventory/viewProductInventory"
            element={
              <>
                <PageTitle title="Inventory" />
                <ViewProductsInventory />
              </>
            }
          />
          {/* <Route
            path="/stockJournal/AddStockJournal"
            element={
              <>
                <PageTitle title="Add Stock Journal" />
                <AddStockJournel />
              </>
            }
          /> */}

          <Route
            path="/stock/stockTransfer"
            element={
              <>
                <PageTitle title="Stock Transfer" />
                <AddStockJournell />
              </>
            }
          />

          <Route
            path="/stock/ViewStockTransfer"
            element={
              <>
                <PageTitle title="View Stock Journal" />
                <ViewStockJournels />
              </>
            }
          />






          <Route
            path="/StockJournal/verifyStockJournalCreated/:id"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <VerifyStockJournal />
              </>
            }
          />
           <Route
            path="/stockjournel/acceptStockJournal/:id"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <VerifyStockJournals />
              </>
            }
          />

        

          

             <Route
            path="/stock/printStockJournal"
            element={
              <>
                <PageTitle title="Print Stock Journal" />
                <PrintStockJournals />
              </>
            }
          />


          {/* <Route
            path="/stockJournal/verify"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <ViewStockJournel />
              </>
            }
          /> */}

          <Route
            path="/stockJournal/verify"
            element={
              <>
                <PageTitle title="Verify Stock Journal" />
                <ViewStockJournalCreated />
              </>
            }
          />

           <Route
            path="/stockjournel/editStockJournal/:id"
            element={
              <>
                <PageTitle title="Edit Stock Journal" />
                <EditStockJournals/>
              </>
            }
          />

          <Route
            path="/inventory/updateInventoryMaterial/:id"
            element={
              <>
                <PageTitle title="Update Inventory " />
                <UpdateInventoryMaterial />
              </>
            }
          />

          <Route
            path="/stockjournel/updateStockJournal/:id"
            element={
              <>
                <PageTitle title="Update Stock Journal" />
                <UpdateStockJournal />
              </>
            }
          />


          {/* stock journel accounts one  */}

           <Route
            path="/voucher/createstockJournel/:id"
            element={
              <>
                <PageTitle title="Stock Journel" />
                <AddStockJournels />
              </>
            }
          />
          <Route path="*" element={<PageNotFOund />} />
        </Route>
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
