import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CardDataStats from '../components/CardDataStats';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Count, DOWNLOADCUSTOMER_REPORT } from '../Constants/utils';

// Import Icons
import { LuScale, LuPanelLeftClose, LuGroup } from "react-icons/lu";
import { SiHomeassistantcommunitystore, SiShutterstock } from "react-icons/si";
import { AiOutlinePartition, AiOutlineClose } from "react-icons/ai";
import { RiProgress1Line, RiProgress8Fill, RiUserReceived2Fill, RiAlignItemBottomFill } from "react-icons/ri";
import { FcApproval, FcCancel } from "react-icons/fc";
import { GrCompliance, GrGroup, GrUpdate } from "react-icons/gr";
import { MdRepartition, MdOutlinePendingActions, MdOutlinePending, MdRecommend, MdEditSquare, MdReport } from "react-icons/md";
import { PiGearFineFill } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { VscDiffModified } from "react-icons/vsc";
import { toast } from 'react-toastify';
import { TbReorder, TbReport, TbReportAnalytics } from 'react-icons/tb';
import { GiProfit, GiWool } from "react-icons/gi";
import { GiRolledCloth } from "react-icons/gi";
import { GiCottonFlower } from "react-icons/gi";
import { GiBandageRoll } from "react-icons/gi";
import { GiScrollUnfurled } from "react-icons/gi";
import { FaDropbox } from "react-icons/fa";
import { FaPersonWalking, FaSalesforce } from 'react-icons/fa6';
import { BiMoney, BiRupee } from 'react-icons/bi';


const AccReports = () => {
    const [unitCount, setUnitCount] = useState([]);
    const { currentUser } = useSelector((state) => state?.persisted?.user);
    const { user, token } = currentUser;
    const role = user?.authorities?.map(auth => auth.authority) || [];
    const appMode = useSelector((state) => state?.persisted?.appMode);

    const { mode } = appMode
    console.log(mode, "kk");

    const handleDownloadReport = async () => {


        try {
            const response = await fetch(`${DOWNLOADCUSTOMER_REPORT}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // body: JSON.stringify(filters), // Convert body to JSON string
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get error response as text
                throw new Error(errorText || "Failed to download report");
            }

            const blob = await response.blob(); // Get the binary PDF file

            const disposition = response.headers.get("Content-Disposition");
            let filename = "Customer.csv"; // Default filename
            if (disposition && disposition.includes("attachment")) {
                const match = disposition.match(/filename="(.+)"/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); // Use the filename from the header

            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while downloading the report");
        }
    };



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



    // Role-based card mapping
    const roleBasedCards = {
        ROLE_ADMIN: [
            { title: "Reports", link: "/Reports", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },

            { title: "Upload Excel", link: "/product/addExcelProduct", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
            { title: "Financial Reports", link: "/report/freports", countKey: "inventory", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },



            {
                title: "Customer Report",
                countKey: "ordersWithCreatedAccepted",
                icon: <RiProgress1Line className="w-10 h-10" />,
                levelUp: true,
                isDownload: true // Added a flag to indicate it's a download button
            },
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Product Report", link: "/report/product", countKey: "approvedOrders", icon: <GrCompliance className="w-10 h-10" />, levelUp: true },
            // { title: "Verify Product Transfer", link: "/stockJournal/verify", countKey: "verifyStockJournals", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Pending for Bill", link: "/Recieved/pendingForBill", countKey: "orderBillStatusAllowed", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            // { title: "Stock Journal Accept", link: "/StockJournal/get", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
            { title: "Production Dashboard", link: "/kaniProducts", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelUp: true },
        ],
        ROLE_EXECUTOR: [
            { title: "Reports", link: "/Reports", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },

            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },



        ],

        ROLE_ADMIN_DLI: [
            { title: "Reports", link: "/Reports", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },
            { title: "Upload Excel", link: "/product/addExcelProduct", countKey: "ordersWithCreated", icon: <AiOutlinePartition className="w-10 h-10" />, levelUp: true },
            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        ROLE_QUALITYCONTROL: [

            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],
        // ROLE_VERIFIER: [

        //     { title: "Verify Product Transfer", link: "/stockJournal/verify", countKey: "verifyStockJournals", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        // ],
        ROLE_FINANCE: [

            { title: "Pending for Bill", link: "/Recieved/pendingForBill", countKey: "orderBillStatusAllowed", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },

        ],


        ROLE_ADMIN_SXR: [
            { title: "Reports", link: "/Reports", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Orders", link: "/chart", countKey: "orders", icon: <SiHomeassistantcommunitystore className="w-10 h-10" />, levelDown: true },

            { title: "Monthly Order Calender", link: "/Order/monthlyorders", countKey: "ordersWithApprovedOrForcedClosure", icon: <RiProgress8Fill className="w-10 h-10" />, levelUp: true },
        ],
        ROLE_USER: [
            { title: "Reports", link: "/Reports", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },
            { title: "Retail/WholeSale Reports", link: "/report/wsRetailReport", countKey: "proforma", icon: <RiAlignItemBottomFill className="w-10 h-10" />, levelUp: true },

        ],

    };





    //acounts
    const accountsModeCards = [
        { title: "Creditors Report", link: "/accReport/Creditors", countKey: "accountsData", icon: <TbReport className="w-10 h-10" />, levelUp: true },
        { title: "Deditors Report", link: "/accReport/Deditors", countKey: "accountsData", icon: <TbReportAnalytics className="w-10 h-10" />, levelUp: true },
        { title: "Sales Report", link: "/accReport/Sales", countKey: "accountsData", icon: <BiRupee className="w-10 h-10" />, levelUp: true },
        { title: "Purchase Report", link: "/accReport/Purchase", countKey: "accountsData", icon: <BiMoney className="w-10 h-10" />, levelUp: true },
        { title: "Client Report", link: "/accReport/Client", countKey: "accountsData", icon: <FaPersonWalking className="w-10 h-10" />, levelUp: true },
        { title: "Stock Report", link: "/accReport/Stock", countKey: "accountsData", icon: <SiShutterstock className="w-10 h-10" />, levelUp: true },
        // { title: "ProductGroup Report", link: "/accReport/ProductGroup", countKey: "accountsData", icon: <LuGroup className="w-10 h-10" />, levelUp: true },
         { title: "Profit & Loss Report", link: "/accReport/ProfitLoss", countKey: "accountsData", icon: <GiProfit className="w-10 h-10" />, levelUp: true },
    ];

    // Get all cards user should see based on roles
    // Get all cards user should see based on roles
    const cardsToShow = (() => {
        if (mode === "production") {
            return role.flatMap(roleName => roleBasedCards[roleName] || []);
        }

        if (mode === "accounts" && role.includes("ROLE_ADMIN")) {
            return accountsModeCards;
        }
        // 🔹 Kani Dashboard
        if (mode === "kani") {
            return kaniModeCards;
        }


        return [];
    })();

    return (
        // <DefaultLayout>
        //     <Breadcrumb pageName="Home" />
        //     <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5 ">
        //         {cardsToShow.map((card, index) => (
        //             <Link to={card.link} key={index}>
        //                 <div
        //                     key={index}
        //                     onClick={card.isDownload ? handleDownloadReport : null} // Apply download function only to "Customer Report"
        //                     className="cursor-pointer  flex-col mt-4 " // Make it clear it's clickable
        //                 >
        //                     <CardDataStats
        //                         title={card.title}

        //                         levelUp={card.levelUp}
        //                         levelDown={card.levelDown}
        //                     >
        //                         {card.icon}
        //                     </CardDataStats>
        //                 </div>
        //             </Link>
        //         ))}
        //     </div>
        // </DefaultLayout>
        <DefaultLayout>
            <Breadcrumb pageName="Home" />
            <div className="grid grid-cols-1 gap-3 my-1 md:grid-cols-4 md:gap-3 xl:grid-cols-4 2xl:gap-7.5">
                {cardsToShow.map((card, index) => (
                    card.isDownload ? (
                        <div
                            key={index}
                            onClick={handleDownloadReport}
                            className="cursor-pointer flex-col mt-4"
                        >
                            {card.isGradient ? (
                                // Gradient styled card with fixed height
                                <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradientColor || 'from-blue-500 to-blue-600'} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-48 flex flex-col`}>
                                    <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                                    {card.levelUp && (
                                        <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            Level Up
                                        </span>
                                    )}
                                    <div className="mb-4 text-white/90">{card.icon}</div>

                                    {/* Title with fixed height for 2 lines */}
                                    <h3 className="text-xl font-bold text-white min-h-[56px] leading-tight">
                                        {card.title}
                                    </h3>

                                    {/* Count with fixed margin */}
                                    {card.countKey && countMapping[card.countKey] !== undefined && (
                                        <p className="text-sm text-white/80 mt-2">{countMapping[card.countKey]} items</p>
                                    )}

                                    {/* View/Download link always at bottom */}
                                    <div className="mt-auto flex items-center text-sm font-medium text-white/90 pt-4">
                                        {card.isDownload ? 'Download' : 'View'}
                                        <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                // Regular CardDataStats for other cards
                                <CardDataStats
                                    title={card.title}
                                    total={card.countKey ? countMapping[card.countKey] : undefined}
                                    levelUp={card.levelUp}
                                    levelDown={card.levelDown}
                                >
                                    {card.icon}
                                </CardDataStats>
                            )}
                        </div>
                    ) : (
                        <Link to={card.link} key={index}>
                            <div className="cursor-pointer flex-col mt-4">
                                {card.isGradient ? (
                                    // Gradient styled card for Kani Section
                                    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradientColor || 'from-blue-500 to-blue-600'} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                                        <div className="absolute right-0 top-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/10 blur-2xl"></div>
                                        {card.levelUp && (
                                            <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                Level Up
                                            </span>
                                        )}
                                        <div className="mb-4 text-white/90">{card.icon}</div>
                                        <h3 className="mb-2 text-xl font-bold text-white">{card.title}</h3>
                                        {card.countKey && countMapping[card.countKey] !== undefined && (
                                            <p className="text-sm text-white/80">{countMapping[card.countKey]} items</p>
                                        )}
                                        <div className="mt-6 flex items-center text-sm font-medium text-white/90">
                                            View
                                            <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    // Regular CardDataStats for other cards
                                    <CardDataStats
                                        title={card.title}
                                        total={card.countKey ? countMapping[card.countKey] : undefined}
                                        levelUp={card.levelUp}
                                        levelDown={card.levelDown}
                                    >
                                        {card.icon}
                                    </CardDataStats>
                                )}
                            </div>
                        </Link>
                    )
                ))}
            </div>
        </DefaultLayout>
    );
};

export default AccReports;
