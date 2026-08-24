import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader/index.js';
import PageTitle from './components/PageTitle.js';
import SignIn from './pages/Authentication/SignIn.jsx';
import SignUp from './pages/Authentication/SignUp.jsx';
import ViewUsers from './pages/Authentication/ViewUsers.jsx';
import Calendar from './pages/Calendar.js';
import Chart from './pages/Chart.jsx';

import AccReports from './pages/AccReports.jsx';
import Home from './pages/Home.jsx';
import FinancialReportDashboard from './pages/FinancialReportDashboard.jsx';
import GeneralFinancialReportDashboard from './pages/GeneralFinancialReportDashboard.jsx';
import Groups from './components/Accounts/Config/Groups.jsx';

import Daybook from './components/Accounts/Config/Daybook.jsx';

import OrderVoucherView from './components/Accounts/Config/OrderVoucherView.jsx';

import AddLut from './components/Accounts/Config/AddLut.jsx';
import PaymentSummary from './components/Accounts/Config/PaymentSummary.jsx';

import Voucher from './components/Accounts/Vouchers/Voucher.jsx';
import CreateVoucher from './components/Accounts/Vouchers/CreateVoucher.jsx';
import EditVoucher from './components/Accounts/Vouchers/EditVoucher.jsx';
import CreateVoucherShopify from './components/Accounts/Vouchers/CreateVoucherShopify.jsx';
import UpdateVoucher from './components/Accounts/Vouchers/UpdateVoucher.jsx';
import CreateDebitNote from './components/Accounts/Vouchers/CreateDebitNote.jsx';
import CreateCreditNote from './components/Accounts/Vouchers/CreateCreditNote.jsx';
import CreateContra from './components/Accounts/Vouchers/CreateContra.jsx';
import CreateJournal from './components/Accounts/Vouchers/CreateJournal.jsx';
import CreateReceipt from './components/Accounts/Vouchers/CreateReceipt.jsx';

import CreateVoucherPurchase from './components/Accounts/Vouchers/CreateVoucherPurchase.jsx';
import VoucherEntriesView from './components/Accounts/Vouchers/VoucherEntriesView.jsx';

import StockJournalView from './components/Accounts/Vouchers/StockJournalView.jsx';

import PrintStockJournal from './components/Accounts/Vouchers/PrintStockJournal.jsx';

import VoucherEntriesDebitView from './components/Accounts/Vouchers/VoucherEntriesDebitView.jsx';
import PrintCreditDebit from './components/Accounts/Vouchers/PrintCreditDebit.jsx';

import VoucherEntriesViewPayment from './components/Accounts/Vouchers/VoucherEntriesViewPayment.jsx';

import PrintEntryPayment from './components/Accounts/Vouchers/PrintEntryPayment.jsx';

import PrintPaymentVoucher from './components/Accounts/Vouchers/PrintPaymentVoucher.jsx';
import PrintPosEntryPayment from './components/Accounts/Vouchers/PrintPosEntryPayment.jsx';
import ViewVoucher from './components/Accounts/Vouchers/ViewVoucher.jsx';

import KaniProducts from './components/Kani/KaniProducts.jsx';
import KaniOrders from './components/Kani/KaniOrders.jsx';
import FilterSupplier from './components/Kani/FilterSupplier.jsx';
import SupplierOrder from './components/Kani/SupplierOrder.jsx';
import KaniClientOrders from './components/Kani/KaniClientOrders.jsx';
import RetailClientOrders from './components/Kani/RetailClientOrders.jsx';
import WholesaleClientOrders from './components/Kani/WholesaleClientOrders.jsx';
import KlcOrders from './components/Kani/KlcOrders.jsx';
import ProductGroupDetails from './components/Kani/ProductGroupDetails.jsx';

import CreateLedger from './components/Ledger/CreateLedger.jsx';
import UpdateCustomerLedger from './components/Ledger/UpdateCustomerLedger.jsx';

import UpdateLedger from './components/Ledger/UpdateLedger.jsx';
import UpdateLedgerr from './components/Ledger/UpdateLedgerr.jsx';
import Material from './components/Material/Material.jsx';
import AddProduct from './components/Products/AddProduct.jsx';
import ViewNotifications from './components/Notification/ViewNotifications.jsx';
import ViewProduct from './components/Products/ViewProduct.jsx';

import ExcelUploadProduct from './components/Products/ExcelUploadProduct.jsx';
import ExcelUploadBulkInventory from './components/Products/ExcelUploadBulkInventory.jsx';

import UpdateKani from './components/Kani/UpdateKani.jsx';
import KaniSection from './components/Kani/KaniSection.jsx';
import PashminaEmbroidery from './components/Kani/PashminaEmbroidery.jsx';
import EmbroideryOrders from './components/Kani/EmbroideryOrders.jsx';
import PashminaSuppliers from './components/Kani/PashminaSuppliers.jsx';
import PashminaInProgress from './components/Kani/PashminaInProgress.jsx';
import RetailEmbroidery from './components/Kani/RetailEmbroidery.jsx';
import WholesaleEmbroidery from './components/Kani/WholesaleEmbroidery.jsx';
import KlcEmbroidery from './components/Kani/KlcEmbroidery.jsx';
import PashminaSupplier from './components/Kani/PashminaSupplier.jsx';
import ContemporaryPashmina from './components/Kani/ContemporaryPashmina.jsx';
import ContemporaryOrders from './components/Kani/ContemporaryOrders.jsx';
import ContemporarySuppliers from './components/Kani/ContemporarySuppliers.jsx';
import ContemporarySuppOrder from './components/Kani/ContemporarySuppOrder.jsx';
import ContemporaryInProgress from './components/Kani/ContemporaryInProgress.jsx';
import RetailContemporary from './components/Kani/RetailContemporary.jsx';
import WholesaleContemporary from './components/Kani/WholesaleContemporary.jsx';
import KlcContemporary from './components/Kani/KlcContemporary.jsx';
import PapierMache from './components/Kani/PapierMache.jsx';
import PapierMacheOrders from './components/Kani/PapierMacheOrders.jsx';
import RetailPapierMache from './components/Kani/RetailPapierMache.jsx';
import WholeSalePapierMache from './components/Kani/WholeSalePapierMache.jsx';
import KlcPapierMache from './components/Kani/KlcPapierMache.jsx';
import PapierMacheSuppliers from './components/Kani/PapierMacheSuppliers.jsx';
import PapierMacheInProgress from './components/Kani/PapierMacheInProgress.jsx';
import WoolEmbroidery from './components/Kani/WoolEmbroidery.jsx';
import WoolEmbroideryOrders from './components/Kani/WoolEmbroideryOrders.jsx';
import WoolSuppliers from './components/Kani/WoolSuppliers.jsx';
import WoolSupplierOrders from './components/Kani/WoolSupplierOrders.jsx';
import WoolInProgress from './components/Kani/WoolInProgress.jsx';
import WoolWholesaleOrders from './components/Kani/WoolWholesaleOrders.jsx';
import WoolKlcOrders from './components/Kani/WoolKlcOrders.jsx';
import WoolRetailOrders from './components/Kani/WoolRetailOrders.jsx';
import ContemporaryWool from './components/Kani/ContemporaryWool.jsx';
import ContemporaryWoolOrders from './components/Kani/ContemporaryWoolOrders.jsx';
import RetailContWool from './components/Kani/RetailContWool.jsx';
import ContWoolWholesale from './components/Kani/ContWoolWholesale.jsx';
import ContWoolKlc from './components/Kani/ContWoolKlc.jsx';
import ContWoolSuppliers from './components/Kani/ContWoolSuppliers.jsx';
import ContWoolInProgress from './components/Kani/ContWoolInProgress.jsx';
import ContWoolSuppOrders from './components/Kani/ContWoolSuppOrders.jsx';
import Cotton from './components/Kani/Cotton.jsx';
import CottonOrders from './components/Kani/CottonOrders.jsx';
import CottonSuppliers from './components/Kani/CottonSuppliers.jsx';
import CottonSuppOrder from './components/Kani/CottonSuppOrder.jsx';
import CottonInProgress from './components/Kani/CottonInProgress.jsx';
import CottonRetail from './components/Kani/CottonRetail.jsx';
import CottonWholesale from './components/Kani/CottonWholesale.jsx';
import CottonKlc from './components/Kani/CottonKlc.jsx';
import ContemporarySaree from './components/Kani/ContemporarySaree.jsx';
import ContemporarySareeOrders from './components/Kani/ContemporarySareeOrders.jsx';
import SareeSuppliers from './components/Kani/SareeSuppliers.jsx';
import SareeInProgress from './components/Kani/SareeInProgress.jsx';
import SareeSuppOrder from './components/Kani/SareeSuppOrder.jsx';
import SareeRetail from './components/Kani/SareeRetail.jsx';
import SareeWholesale from './components/Kani/SareeWholesale.jsx';
import SareeKlc from './components/Kani/SareeKlc.jsx';
import PapierMachieSuppOrders from './components/Kani/PapierMachieSuppOrders.jsx';

import AddBom from './components/Products/AddBom.jsx';
import AddLocationInventory from './components/Products/AddLoctionInventory.jsx';

import UpdateBom from './components/Products/UpdateBom.jsx';
import UpdateProduct from './components/Products/UpdateProduct.jsx';
import UpdateLocationInventory from './components/Products/UpdateLocationInventory.jsx';



import FormLayout from './pages/Form/FormLayout.js';
import Profile from './pages/Profile.js';
import Settings from './pages/Settings.js';
import Tables from './pages/Tables.js';
import Alerts from './pages/UiElements/Alerts.js';
import PageNotFOund from './pages/PageNotFOund.jsx';

import Buttons from './pages/UiElements/Buttons.js';
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';
import RoleBasedRoute from './PrivateRoute/RoleBasedRoute.jsx';
import Budget from './components/Budget/Budget.jsx';


import ViewBudget from './components/Budget/ViewBudget.jsx';
import BudgetReport from './components/Budget/BudgetReport.jsx';

import BudgetReportView from './components/Budget/BudgetReportView.jsx';

import UpdateBudget from './components/Budget/UpdateBudget.jsx';

import AddWeave from './components/Configurator/AddWeave.jsx';
import Size from './components/Configurator/Size.jsx';
import Design from './components/Configurator/Design.jsx';
import Style from './components/Configurator/Style.jsx';
import Currency from './components/Configurator/Currency.jsx';
import Unit from './components/Configurator/Unit.jsx';
import ProductGroup from './components/Configurator/ProductGroup.jsx';

import ProductSubGroup from './components/Configurator/ProductSubGroup.jsx';
import AddColorGroup from './components/Configurator/AddColorGroup.jsx';
import AddProductCategory from './components/Configurator/AddProductCategory.jsx';
import CustomerGroup from './components/Configurator/CustomerGroup.jsx';
import OrderType from './components/Configurator/OrderType.jsx';
import HsnCode from './components/Configurator/HsnCode.jsx';
import Location from './components/Configurator/Location.jsx';
import Supplier from './components/Configurator/Supplier.jsx';

import AddSupplier from './components/Supplier/AddSupplier.jsx';
import ViewLedger from './components/Supplier/SupplierLedger/ViewLedger.jsx';
// import LedgerPrintPage from './components/Supplier/SupplierLedger/LedgerPrintPage.jsx';

// import ViewSuppLedger from './components/Supplier/SupplierLedger/ViewSuppLedger.jsx';

import AddBulkSupplier from './components/Supplier/AddBulkSupplier.jsx';

import ViewSupplier from './components/Supplier/ViewSupplier.jsx';
import UpdateSupplier from './components/Supplier/UpdateSupplier.jsx';

import MaterialPo from './components/PuchaseOrder/MaterialPo';
import ViewMaterialPo from './components/PuchaseOrder/ViewMaterialPo';
import UpdateMaterialPo from './components/PuchaseOrder/UpdateMaterialPo.jsx';

import AddOrder from './components/Order/AddOrder';
import Fiber from './components/Order/Fiber.jsx';

import Reports from './components/Reports/Reports.jsx';
import ProductReport from './components/Reports/ProductReport.jsx';

import RetailWholeSaleReport from './components/Reports/RetailWholesaleReport.jsx';

import CreditorsReports from './components/AccReports/CreditorsReports.jsx';

import ClientReports from './components/AccReports/ClientReports.jsx';
import ProfitLossReports from './components/AccReports/ProfitLossReports.jsx';
import StockReports from './components/AccReports/StockReports.jsx';
import DebitorsReports from './components/AccReports/DebitorsReports.jsx';
import SalesReports from './components/AccReports/SalesReports.jsx';

import PurchaseReports from './components/AccReports/PurchaseReports.jsx';

import FinanceReportByDate from './components/Reports/FinanceReportByDate.jsx';


import ViewPerforma from './components/Order/ViewPerforma';

import DownloadPerformaws from './components/Order/DownloadPerformaws';

import DownloadPerformare from './components/Order/DownloadPerformare';

import ViewOrder from './components/Order/ViewOrder.jsx';

import EditOrderCreated from './components/Order/EditOrderCreated.jsx';

import UpdateOrderStatus from './components/Order/UpdateOrderStatus.jsx';
import OrderProforma from './components/Order/Proforma/OrderProforma.jsx';
import UpdateOrderProforma from './components/Order/Proforma/UpdateOrderProforma.jsx';
import UpdateRetailProforma from './components/Order/Proforma/UpdateRetailProforma.jsx';
import RetailOrderProforma from './components/Order/Proforma/RetailOrderProforma.jsx';



import UpdatePartiallyOrderStatus from './components/Order/UpdatePartiallyOrderStatus.jsx';
import UpdatePartiallyApprovedOrder from './components/Order/UpdatePartiallyApprovedOrder.jsx';
import UpdatePartiallyPending from './components/Order/UpdatePartiallyPending.jsx';
import UpdateOrderCancelled from './components/Order/UpdateOrderCancelled.jsx';

import UpdatePartiallyClosed from './components/Order/UpdatePartiallyClosed.jsx';

import UpdateOrderRecieving from './components/Order/UpdateOrderRecieving.jsx';
import UpdateForcedClosure from './components/Order/UpdateForcedClosure.jsx';
import UpdateChallan from './components/Order/UpdateChallan.jsx';
import UpdateExpectedSupplierDate from './components/Order/UpdateExpectedSupplierDate.jsx';

// import UpdateSupplierRecievingOrders from './components/Order/UpdateSupplierRecievingOrders.jsx';

import ViewExpectedDateOrder from './components/Order/ViewExpectedDateOrder.jsx';

import ViewSupplierRecievingOrders from './components/Order/ViewSupplierRecievingOrders.jsx';
import ViewOrderShippingDate from './components/Order/ViewOrderShippingDate.jsx';

import ViewNeedModification from './components/Order/ViewNeedModification.jsx';

import ViewOrderCancelled from './components/Order/ViewOrderCancelled.jsx';



import IssueChalaan from './components/Order/IssueChalaan.jsx';




import UpdateOrderProduct from './components/Order/UpdateOrderProduct.jsx';
import ViewProductByOrderId from './components/Order/ViewProductByOrderId.jsx';

import ViewOrderForcedClosure from './components/Order/ViewOrderForcedClosure.jsx';
import ViewRecievedQuantity from './components/Order/ViewRecievedQuantity.jsx';


import MonthlyOrders from './components/MonthlyOrders/MonthlyOrders.jsx'


import ViewOrderCreated from './components/Order/ViewOrderCreated.jsx';
import ViewOrderApproved from './components/Order/ViewOrderApproved.jsx';

import PendingForBill from './components/Order/PendingForBill.jsx';
import UpdatePendingForBill from './components/Order/UpdatePendingForBill.jsx';



import ViewChallan from './components/Order/ViewChallan.jsx';

import ViewOrderRejected from './components/Order/ViewOrderRejected.jsx';



import ViewOrderPartiallyCreated from './components/Order/ViewOrderPartiallyCreated.jsx';

import ViewOrderPartiallyApproved from './components/Order/ViewOrderPartiallyApproved.jsx';

import ViewOrderExecuted from './components/Order/ViewOrderExecuted.jsx';
import UpdateOrderAccepted from './components/Order/UpdateOrderAccepted.jsx';
import UpdateOrderPending from './components/Order/UpdateOrderPending.jsx';

import UpdateClosedOrder from './components/Order/UpdateClosedOrder.jsx';

import ViewOrderPartiallyPending from './components/Order/ViewOrderPartiallyPending.jsx';
import ViewOrderPending from './components/Order/ViewOrderPending.jsx';

import ViewOrderClosed from './components/Order/ViewOrderClosed.jsx';

import ViewOrderPartiallyClosed from './components/Order/ViewOrderPartiallyClosed.jsx';









import UpdateOrder from './components/Order/UpdateOrder.jsx';
import ViewOrderr from './components/Order/ViewOrderr.jsx';
import UpdateOrderShippingDate from './components/Order/UpdateOrderShippingDate.jsx';

import AddCustomer from './components/Customer/AddCustomer';
import ExcelUploadCustomer from './components/Customer/AddCustomerBulk.jsx';
import ExcelUploadLedger from './components/Ledger/BulkLedgerUpload.jsx'

import ViewCustomer from './components/Customer/ViewCustomer';
import UpdateCustomer from './components/Customer/UpdateCustomer';
import CreateMaterialInventory from './components/Inventory/CreateMaterialInventory.jsx';
import ViewMaterialInventory from './components/Inventory/ViewMaterialInventory.jsx';
import UpdateInventoryMaterial from './components/Inventory/UpdateInventoryMaterial.jsx';



//productInventory




import AddProductInventory from './components/ProductsInventory/AddProductInventory.jsx';
import UpdateExcelInventory from './components/ProductsInventory/UpdateExcelInventory.jsx';
import ViewRecentTransactions from './components/ProductsInventory/ViewRecentTransactions.jsx';

import ViewProductsInventory from './components/ProductsInventory/ViewProductsInventory.jsx';
import UpdateInventory from './components/ProductsInventory/UpdateInventory.jsx';



import AddStockJournels from './components/StockJournell/AddStockJournels.jsx';

import ShopifyPage from './components/shopifyPage/ShopifyPage.jsx';
import ShopifyOrders from './components/shopifyPage/ShopifyOrders.jsx';
import ShopifyInventory from './components/shopifyPage/ShopifyInventory.jsx';
import AddStockJournell from './components/StockJournel/AddStockJournell.jsx';
// import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';
import ViewStockJournels from './components/StockJournel/ViewStockJournels.jsx';

import VerifyStockJournal from './components/StockJournel/VerifyStockJournal.jsx';
import VerifyStockJournals from './components/StockJournel/VerifyStockJournals.jsx';


import PrintStockJournals from './components/StockJournel/PrintStockJournals.jsx';
import Godown from './components/Godown/Godown.jsx'

import ViewStockJournalCreated from './components/StockJournel/ViewStockJournalCreated.jsx';
import EditStockJournals from './components/StockJournel/EditStockJournals.jsx';
// import ViewStockJournel from './components/StockJournel/ViewStockJournel.jsx';

// import UpdateProduct from './components/Products/UpdateProduct';

import UpdateStockJournal from './components/StockJournel/UpdateStockJournal.jsx';
// import { signoutSuccess } from './redux/Slice/UserSlice';

// import useInactivity from './hooks/useInactivity';

import ViewKaniProducts from './components/Kani/ViewKaniProducts.jsx';
import ViewSupplierProduct from './components/Kani/ViewSupplierProduct.jsx';
import KaniInProgress from './components/Kani/KaniInProgress.jsx';
import UpdateKaniProducts from './components/Kani/UpdateKaniProducts.jsx';
import UpdatePashminaProducts from './components/Kani/UpdatePashminaProducts.jsx';

// import 'react-toastify/dist/ReactToastify.css';

// import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
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
    </>
  );
}

export default App;
