import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Count } from '../Constants/utils';

// Import Icons
import { LuScale, LuPanelLeftClose } from "react-icons/lu";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlinePartition, AiOutlineClose } from "react-icons/ai";
import { RiProgress1Line, RiProgress8Fill, RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { FcApproval, FcCancel } from "react-icons/fc";
import { GrCompliance, GrUpdate } from "react-icons/gr";
import { MdRepartition, MdOutlinePendingActions, MdOutlinePending, MdRecommend, MdEditSquare, MdReport, MdTimer } from "react-icons/md";
import { PiGearFineFill } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { VscDiffModified } from "react-icons/vsc";
import { FaBook } from "react-icons/fa6";
import { TbReorder } from "react-icons/tb";
import { GiWool } from "react-icons/gi";
import { GiRolledCloth } from "react-icons/gi";
import { GiCottonFlower } from "react-icons/gi";
import { GiBandageRoll } from "react-icons/gi";
import { GiScrollUnfurled } from "react-icons/gi";
import { FaDropbox } from "react-icons/fa";
import { BiBookOpen } from 'react-icons/bi';

const Chart = () => {
  const [unitCount, setUnitCount] = useState([]);
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const { user, token } = currentUser;
  const role = user?.authorities?.map(auth => auth.authority) || [];
  const appMode = useSelector((state) => state?.persisted?.appMode);

  const { mode } = appMode
  console.log(mode, "kk");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(Count, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUnitCount(data || []);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [token]);

  // Convert unitCount array to an object for quick lookup
  const countMapping = unitCount.reduce((acc, item) => {
    acc[item.tableName] = item.count;
    return acc;
  }, {});

  // Kani-based card mapping
  const kaniModeCards = [
    {
      title: "Kani Section",
      link: "/kaniSection",
      countKey: "kaniOrders",
      icon: <SiHomeassistantcommunitystore className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
    },

    {
      title: "Pashmina Embroidery",
      link: "/pashminaEmbroidery",
      countKey: "pashminaEmbroidery",
      icon: <GiScrollUnfurled className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-purple-500 to-purple-600",
    },
    {
      title: "Contemporary Pashmina",
      link: "/contemporaryPashmina",
      countKey: "contemporaryPashmina",
      icon: <GiBandageRoll className="w-10 h-11" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-green-500 to-green-600",
    },
    {
      title: "Papier Mache",
      link: "/papierMache",
      countKey: "papierMache",
      icon: <TbReorder className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-red-500 to-red-600",
    },
    {
      title: "Wool Embroidery",
      link: "/woolEmbroidery",
      countKey: "woolEmbroidery",
      icon: <GiWool className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-amber-700 to-amber-800",
    },
    {
      title: "Contemporary Wool",
      link: "/contemporaryWool",
      countKey: "contemporaryWool",
      icon: <GiRolledCloth className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-orange-600 to-orange-700",
    },
    {
      title: "Cotton",
      link: "/cotton",
      countKey: "cotton",
      icon: <GiCottonFlower className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-yellow-600 to-yellow-700",
    },
    {
      title: "Contemporary Saree",
      link: "/contemporarySaree",
      countKey: "contemporarySaree",
      icon: <FaDropbox className="w-10 h-10" />,
      levelUp: true,
      isGradient: true,
      gradientColor: "from-teal-500 to-teal-600",
    },
  ];

  // Role-based card mapping
  const accountsModeCards = [
    { title: "Ledger Summary Balances", link: "/configurator/ledgersummary", countKey: "invoices", icon: <FaBook className="w-10 h-10" />, levelUp: true },
    { title: "Orders With Vouchers", link: "/configurator/OrderVoucher", countKey: "invoices", icon: <TbReorder className="w-10 h-10" />, levelUp: true },
    { title: "Reports", link: "/configurator/accreports", countKey: "accReports", icon: <BiBookOpen className="w-10 h-10" />, levelUp: true },
  ];
  
  const roleBasedCards = {
    ROLE_ADMIN: [
      { title: "Fibers Allocated", link: "/order/Fiber", countKey: "fiberCount", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Proforma", link: "/order/searchproforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
      { title: "Pending For Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Approved Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
       { title: "Completed", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
      { title: "Partially Closed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Update Challan", link: "/orderlist/UpdateChallan", countKey: "ordersWithApprovedChallan", icon: <PiGearFineFill className="w-10 h-10" />, levelUp: true },
      { title: "Pending Orders", link: "/orderlist/Pending", countKey: "ordersWithOnlyPending", icon: <MdOutlinePendingActions className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Forced Closed Orders", link: "/orderlist/ForcedClosure", countKey: "ordersWithForcedClosure", icon: <LuPanelLeftClose className="w-10 h-10" />, levelUp: true },
      { title: "Rejected Orders", link: "/orderlist/RejectedOrders", countKey: "ordersWithRejected", icon: <AiOutlineClose className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Date Updation", link: "/order/supplierExpectdateUpdate", countKey: "approvedSupplierOrdersCount", icon: <CiCalendarDate className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },
      { title: "Need Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Cancelled Orders", link: "/order/Cancelled", countKey: "ordersCancelled", icon: <FcCancel className="w-10 h-10" />, levelUp: true },
      { title: "Edit Received Quantity", link: "/order/recievedQuantity", countKey: "ordersWithPendingProducts", icon: <MdEditSquare className="w-10 h-10" />, levelUp: true },
      { title: "Update Shipping Date", link: "/order/updateShippingDate", countKey: "ordersWithShippingDate", icon: <GrUpdate className="w-10 h-10" />, levelUp: true },
      { title: "Monthly Orders", link: "/Order/monthlyorders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
      { title: "Delayed Orders", link: "/delayedOrders", countKey: "ordersWithDelayed", icon: <MdTimer className="w-10 h-10" />, levelDown: true }
    ],
    ROLE_QUALITYCONTROL: [
      { title: "Completed Orders", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
    ],
    ROLE_EXECUTOR: [
      { title: "Pending For Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Approved Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Rejected Orders", link: "/orderlist/RejectedOrders", countKey: "ordersWithRejected", icon: <AiOutlineClose className="w-10 h-10" />, levelUp: true },
      { title: "Need Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Cancelled Orders", link: "/order/Cancelled", countKey: "ordersCancelled", icon: <FcCancel className="w-10 h-10" />, levelUp: true },
    ],
    ROLE_ADMIN_DLI: [
      { title: "Proforma", link: "/order/searchproforma", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
      { title: "Pending For Approval", link: "/order/created", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },
      { title: "Need Modification Orders", link: "/order/needModification", countKey: "ordersNeedModification", icon: <VscDiffModified className="w-10 h-10" />, levelUp: true },
      { title: "Update Shipping Date", link: "/order/updateShippingDate", countKey: "ordersWithShippingDate", icon: <GrUpdate className="w-10 h-10" />, levelUp: true },
    ],
    ROLE_ADMIN_SXR: [
      { title: "Approved Orders", link: "/orderlist/Executed", countKey: "ordersWithOnlyAccepted", icon: <FcApproval className="w-10 h-10" />, levelUp: true },
      { title: "Partially Approved", link: "/order/partiallyexecuted", countKey: "ordersWithCreatedAccepted", icon: <RiProgress1Line className="w-10 h-10" />, levelUp: true },
      { title: "Update Challan", link: "/orderlist/UpdateChallan", countKey: "ordersWithApprovedChallan", icon: <PiGearFineFill className="w-10 h-10" />, levelUp: true },
      { title: "In Progress Orders", link: "/order/Approved", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
      { title: "Partially In Progress", link: "/order/partiallyApproved", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
      { title: "Completed Orders", link: "/orderlist/Closed", countKey: "ordersWithOnlyClosed", icon: <MdRecommend className="w-10 h-10" />, levelUp: true },
      { title: "Partially Completed Orders", link: "/orderlist/PartiallyClosed", countKey: "ordersWithOnlyPartiallyClosed", icon: <MdRepartition className="w-10 h-10" />, levelUp: true },
      { title: "Pending Orders", link: "/orderlist/Pending", countKey: "ordersWithOnlyPending", icon: <MdOutlinePendingActions className="w-10 h-10" />, levelUp: true },
      { title: "Partially Pending Orders", link: "/orderlist/PartiallyPending", countKey: "ordersWithAtLeastOnePending", icon: <MdOutlinePending className="w-10 h-10" />, levelUp: true },
      { title: "Forced Closed Orders", link: "/orderlist/ForcedClosure", countKey: "ordersWithForcedClosure", icon: <LuPanelLeftClose className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Date Updation", link: "/order/supplierExpectdateUpdate", countKey: "approvedSupplierOrdersCount", icon: <CiCalendarDate className="w-10 h-10" />, levelUp: true },
      { title: "Supplier Receiving Orders", link: "/order/supplierRecievingOrders", countKey: "ordersWithSupplierReceiving", icon: <RiUserReceived2Fill className="w-10 h-10" />, levelUp: true },
    ],
  };

  // Get all cards user should see based on roles
  const cardsToShow = (() => {
    if (mode === "production") {
      return role.flatMap(roleName => roleBasedCards[roleName] || []);
    }
    if (mode === "accounts" && role.includes("ROLE_ADMIN")) {
      return accountsModeCards;
    }
    if (mode === "kani") {
      return kaniModeCards;
    }
    return [];
  })();

  // Calculate summary stats for production mode
  const totalOrders = countMapping['orders'] || 0;
  const completedOrders = countMapping['ordersWithOnlyClosed'] || 0;
  const delayedOrders = countMapping['ordersWithDelayed'] || 0;
  const cancelledOrders = countMapping['ordersCancelled'] || 0;

  // Calculate max value for progress bar (use total or 1 to avoid division by zero)
  const maxValue = Math.max(totalOrders, 1);

  // Summary cards with their respective links
  const summaryCards = [
    {
      title: "Total orders",
      count: totalOrders,
      icon: <SiHomeassistantcommunitystore className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-100",
      barColor: "bg-blue-500",
      textColor: "text-gray-500",
      link: "/Order/ViewOrder"
    },
    {
      title: "Completed orders",
      count: completedOrders,
      icon: <FcApproval className="w-5 h-5" />,
      bgColor: "bg-green-100",
      barColor: "bg-green-500",
      textColor: "text-green-600",
      link: "/orderlist/Closed"
    },
    {
      title: "Delayed orders",
      count: delayedOrders,
      icon: <MdTimer className="w-5 h-5 text-orange-600" />,
      bgColor: "bg-orange-100",
      barColor: "bg-orange-500",
      textColor: "text-orange-600",
      link: "/delayedOrders"
    },
    {
      title: "Cancelled orders",
      count: cancelledOrders,
      icon: <FcCancel className="w-5 h-5" />,
      bgColor: "bg-red-100",
      barColor: "bg-red-500",
      textColor: "text-red-600",
      link: "/order/Cancelled"
    }
  ];

  // Group cards by categories
  const getGroupedCards = () => {
    const needsAttention = [];
    const fiberProformaSuppliers = [];
    const thisMonth = [];
    const otherCards = [];

    const filteredCards = cardsToShow.filter(card => {
      const summaryTitles = ['Total Orders', 'Completed Orders', 'Delayed Orders', 'Cancelled Orders'];
      return !summaryTitles.includes(card.title);
    });

    filteredCards.forEach(card => {
      // Needs Attention category
      if (['Update Shipping Date', 'Delayed Orders', 'Pending Orders', 'Supplier Date Updation', 
           'Edit Received Quantity', 'Update Challan', 'Supplier Receiving Orders', 
           'Need Modification Orders', 'Cancelled Orders', ].includes(card.title)) {
        needsAttention.push(card);
      }
      // Fiber, Proforma & Suppliers category
      else if (['Fibers Allocated', 'Proforma', 'Supplier Receiving Orders'].includes(card.title)) {
        fiberProformaSuppliers.push(card);
      }
      // This Month category
      else if (['Monthly Orders'].includes(card.title)) {
        thisMonth.push(card);
      }
      // Other cards that don't fit in any category
      else {
        otherCards.push(card);
      }
    });

    return { needsAttention, fiberProformaSuppliers, thisMonth, otherCards };
  };

  const { needsAttention, fiberProformaSuppliers, thisMonth, otherCards } = getGroupedCards();

  // Render a group of cards with heading
  const renderCardGroup = (cards, heading) => {
    if (cards.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{heading}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-3 xl:grid-cols-5 2xl:gap-4">
          {cards.map((card, index) => (
            <Link to={card.link} key={index}>
              {card.isGradient ? (
                <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradientColor || 'from-blue-500 to-blue-600'} p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-44 flex flex-col`}>
                  <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                  {card.levelUp && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Level Up
                    </span>
                  )}
                  <div className="mb-2 text-white/80 h-2 w-2">{card.icon}</div>
                  <h3 className="text-xs font-semibold text-white min-h-[40px] leading-tight">
                    {card.title}
                  </h3>
                  {card.countKey && countMapping[card.countKey] !== undefined && (
                    <p className="text-xs text-white/70 mt-1">{countMapping[card.countKey]} items</p>
                  )}
                  <div className="mt-auto flex items-center text-xs font-medium text-white/80 pt-3">
                    View
                    <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <CardDataStats
                  title={card.title}
                  total={countMapping[card.countKey]}
                  levelUp={card.levelUp}
                  levelDown={card.levelDown}
                >
                  {card.icon}
                </CardDataStats>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Render the "Orders Process" group as a horizontal pipeline (same cards, same order, same counts)
  // Wraps to new rows instead of scrolling, and shows clear dashed connectors between every step.
  const renderOrderPipeline = (cards, heading) => {
    if (!cards || cards.length === 0) return null;

    const steps = cards.map((card) => ({
      title: card.title,
      link: card.link,
      count: card.countKey ? (countMapping[card.countKey] || 0) : 0,
    }));

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-nowrap items-start w-full">
            {steps.map((step, index) => {
              const isCompleted = step.title.toLowerCase().includes('complet');
              const isRejected = step.title.toLowerCase().includes('reject');
              const isActive = step.count > 0;

              let circleClasses = 'border-gray-300 text-gray-400 bg-white';
              if (isActive && isCompleted) {
                circleClasses = 'border-green-500 text-green-700 bg-green-50';
              } else if (isActive && isRejected) {
                circleClasses = 'border-red-500 text-red-700 bg-red-50';
              } else if (isActive) {
                circleClasses = 'border-amber-500 text-amber-700 bg-amber-50';
              }

              return (
                <div key={index} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center text-center flex-1 min-w-0 px-0.5">
                    <Link to={step.link} className="flex flex-col items-center group w-full">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-transform duration-300 group-hover:scale-110 ${circleClasses}`}
                      >
                        {step.count}
                      </div>
                      <p className="mt-3 text-[12px] font-medium text-gray-600 leading-tight break-words w-full">
                        {step.title}
                      </p>
                    </Link>
                  </div>

                  {index < steps.length -1 && (
                    <div className=" mt-2 flex-shrink-0 flex items-center justify-center w-12 h-9">
                      <div className="w-full border-t-2 border-dashed border-gray-400"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard" />
      
      {/* Summary Stats Cards - Always shown for production mode */}
      {mode === "production" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {summaryCards.map((card, idx) => (
            <Link to={card.link} key={idx}>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] hover:-translate-y-1">
  <div className="flex items-center justify-between">
    <div>
      <p className={`text-6px font-sm ${card.textColor} uppercase tracking-wider`}>
        {card.title}
      </p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.count}</h3>
    </div>
    <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
      {card.icon}
    </div>
  </div>
  <div className="mt-3">
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${card.barColor} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${(card.count / maxValue) * 100}%` }}
      />
    </div>
  </div>
</div>
            </Link>
          ))}
        </div>
      )}

      {/* Grouped Cards for Production Mode */}
      {mode === "production" && (
        <>
          {renderOrderPipeline(otherCards, "Orders Pipeline")}
          {renderCardGroup(needsAttention, "Needs your attention")}
          {renderCardGroup(fiberProformaSuppliers, "Fiber, proforma & suppliers")}
          {renderCardGroup(thisMonth, "This month")}
        </>
      )}

      {/* For other modes (accounts, kani) - show cards without grouping */}
      {mode !== "production" && (
        <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-5 2xl:gap-4 rounded-lg">
          {cardsToShow.map((card, index) => (
            <Link to={card.link} key={index}>
              {card.isGradient ? (
                <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradientColor || 'from-blue-500 to-blue-600'} p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-44 flex flex-col`}>
                  <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                  {card.levelUp && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Level Up
                    </span>
                  )}
                  <div className="mb-2 text-white/80">{card.icon}</div>
                  <h3 className="text-sm font-semibold text-white min-h-[40px] leading-tight">
                    {card.title}
                  </h3>
                  {card.countKey && countMapping[card.countKey] !== undefined && (
                    <p className="text-xs text-white/70 mt-1">{countMapping[card.countKey]} items</p>
                  )}
                  <div className="mt-auto flex items-center text-xs font-medium text-white/80 pt-3">
                    View
                    <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <CardDataStats
                  title={card.title}
                  total={countMapping[card.countKey]}
                  levelUp={card.levelUp}
                  levelDown={card.levelDown}
                >
                  {card.icon}
                </CardDataStats>
              )}
            </Link>
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Chart;
