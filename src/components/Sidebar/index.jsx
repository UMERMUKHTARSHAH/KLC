import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '/img/logo.png';
import { AiOutlineProduct } from 'react-icons/ai';
import { LiaTruckLoadingSolid } from 'react-icons/lia';
import { MdOutlineInventory2 } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { FcDataConfiguration } from 'react-icons/fc';
import { FaUser } from 'react-icons/fa';
import { PiRecycleBold } from 'react-icons/pi';
import { FaBook } from 'react-icons/fa6';
import { MdAddHome } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { FaJediOrder } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import { MdInventory2 } from 'react-icons/md';
import { CgShutterstock } from 'react-icons/cg';
import { MdGroups } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { FcSearch } from 'react-icons/fc';
import { TbViewportWide } from 'react-icons/tb';
import { RiPagesLine } from 'react-icons/ri';
import { MdBook } from 'react-icons/md';
import { LuTornado } from 'react-icons/lu';
import { FaShopify } from "react-icons/fa";
import { toast } from 'react-toastify';
import { GET_Vouchersearch_URL } from '../../Constants/utils';
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [role, setrole] = useState('');
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const appMode = useSelector((state) => state?.persisted?.appMode);
   const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
   const [salesVouchers, setSalesVouchers] = useState([]);
  const [purchaseVouchers, setPurchaseVouchers] = useState([]);

  const { mode } = appMode;
    const { token } = currentUser;

  const { user } = currentUser || {};
  const roles = user?.authorities.map((auth) => auth.authority) || []; // Ensure it's always an array

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

   const getVouchersByType = async (type) => {
    try {
      const response = await fetch(`${GET_Vouchersearch_URL}?page=1&size=1000`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ typeOfVoucher: type })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      return data.content || [];
    } catch (error) {
      console.error("Error in getVouchersByType:", error);
      toast.error(error.message || "Failed to fetch vouchers");
      return [];
    }
  };

   const handleSalesClick = async (e) => {
    e.preventDefault();
    if (!isSalesOpen) {
      const data = await getVouchersByType("Sales");
      setSalesVouchers(data);
    }
    setIsSalesOpen(!isSalesOpen);
    setIsPurchaseOpen(false);
  };

  const handlePurchaseClick = async (e) => {
    e.preventDefault();
    if (!isPurchaseOpen) {
      const data = await getVouchersByType("Purchase");
      setPurchaseVouchers(data);
    }
    setIsPurchaseOpen(!isPurchaseOpen);
    setIsSalesOpen(false);
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between  px-4  lg:py-7 bg-slate-900">
        <div className="mt-[-30px]">
          <NavLink
            to="/"
            className="flex justify-center mx-auto md:h-[80px] h-[80px] "
          >
            <img
              src={Logo}
              className="w-full h-40 justify-center rounded-full  "
              alt="Logo"
            />
            {/* <h2 className='mt-7 ml-4 text-3xl text-slate-300 font-bold stroke-form-input'>KANI</h2> */}
          </NavLink>
        </div>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="12"
            height="12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <span className="capitalize bg-slate-600 text-white  p-2 text-center">
          {mode}
        </span>
        <nav className=" px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <NavLink
                to="/chart"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes('chart') && 'bg-graydark dark:bg-meta-4'
                }`}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_130_9801)">
                    <path
                      d="M10.8563 0.55835C10.5188 0.55835 10.2095 0.8396 10.2095 1.20522V6.83022C10.2095 7.16773 10.4907 7.4771 10.8563 7.4771H16.8751C17.0438 7.4771 17.2126 7.39272 17.3251 7.28022C17.4376 7.1396 17.4938 6.97085 17.4938 6.8021C17.2688 3.28647 14.3438 0.55835 10.8563 0.55835ZM11.4751 6.15522V1.8521C13.8095 2.13335 15.6938 3.8771 16.1438 6.18335H11.4751V6.15522Z"
                      fill=""
                    />
                    <path
                      d="M15.3845 8.7427H9.1126V2.69582C9.1126 2.35832 8.83135 2.07707 8.49385 2.07707C8.40947 2.07707 8.3251 2.07707 8.24072 2.07707C3.96572 2.04895 0.506348 5.53645 0.506348 9.81145C0.506348 14.0864 3.99385 17.5739 8.26885 17.5739C12.5438 17.5739 16.0313 14.0864 16.0313 9.81145C16.0313 9.6427 16.0313 9.47395 16.0032 9.33332C16.0032 8.99582 15.722 8.7427 15.3845 8.7427ZM8.26885 16.3083C4.66885 16.3083 1.77197 13.4114 1.77197 9.81145C1.77197 6.3802 4.47197 3.53957 7.8751 3.3427V9.36145C7.8751 9.69895 8.15635 10.0083 8.52197 10.0083H14.7938C14.6813 13.4958 11.7845 16.3083 8.26885 16.3083Z"
                      fill=""
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_130_9801">
                      <rect
                        width="18"
                        height="18"
                        fill="white"
                        transform="translate(0 0.052124)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Dashboard
              </NavLink>
              {/*Accounts*/}

              <SidebarLinkGroup
              // activeCondition={
              //   pathname === '/configurator' || pathname.includes('configurator')
              // }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'accounts' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FcDataConfiguration size={24} />
                          Configurator
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/configurator/groups"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <LiaTruckLoadingSolid />
                              Groups
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/vouchers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <TbReportAnalytics />
                              Vouchers
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to="/configurator/dayBook"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <MdBook/>
                              Day Book
                            </NavLink>
                          </li> */}

                          <li>
                            <NavLink
                              to="/configurator/AddLut"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              <LuTornado />
                              LUT
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Kani */}

              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <>
                      {mode === 'kani' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Kani Section
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/kaniOrders"
                              className={({ isActive }) =>
                                'group flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Kani Orders
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'accounts' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaBook size={24} />
                          Ledger
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {/* <li>
                            <NavLink
                              to="/inventory/addProductInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Inventory
                            </NavLink>
                          </li> */}
                          <li>
                            <NavLink
                              to="/Ledger/CreateLedger"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Ledger
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/ledger/view"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Ledger
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/ledger/AddBulk"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Bulk Add Ledger
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

           <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'accounts' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/configurator' || pathname.includes('configurator')) && 'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <RiPagesLine size={24} />
                            Vouchers
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && 'rotate-180'
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </NavLink>

                          <div
                            className={`translate transform overflow-hidden ${
                              !open && 'hidden'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/configurator/vouchers"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Add New Voucher
                                </NavLink>
                              </li>
                              
                              {/* Sales Dropdown */}
                              <li>
                                <div
                                  onClick={handleSalesClick}
                                  className="group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white cursor-pointer"
                                >
                                  <span>Sales</span>
                                  <svg
                                    className={`ml-auto transition-transform duration-200 ${
                                      isSalesOpen ? 'rotate-180' : ''
                                    }`}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                    />
                                  </svg>
                                </div>
                                {isSalesOpen && (
                                  <ul className="mt-2 ml-4 flex flex-col gap-2">
                                    {salesVouchers.map((voucher) => (
                                      <li key={voucher.id}>
                                        <NavLink
                                          to={`/voucher/create/${voucher.id}`}
                                          className={({ isActive }) =>
                                            'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                            (isActive && '!text-white')
                                          }
                                        >
                                          {voucher.name || `Voucher ${voucher.id}`}
                                        </NavLink>
                                      </li>
                                    ))}
                                    {salesVouchers.length === 0 && (
                                      <li className="px-4 text-sm text-bodydark2">No sales vouchers found</li>
                                    )}
                                  </ul>
                                )}
                              </li>

                              {/* Purchase Dropdown */}
                              <li>
                                <div
                                  onClick={handlePurchaseClick}
                                  className="group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white cursor-pointer"
                                >
                                  <span>Purchase</span>
                                  <svg
                                    className={`ml-auto transition-transform duration-200 ${
                                      isPurchaseOpen ? 'rotate-180' : ''
                                    }`}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                    />
                                  </svg>
                                </div>
                                {isPurchaseOpen && (
                                  <ul className="mt-2 ml-4 flex flex-col gap-2">
                                    {purchaseVouchers.map((voucher) => (
                                      <li key={voucher.id}>
                                        <NavLink
                                          to={`/voucher/create/${voucher.id}`}
                                          className={({ isActive }) =>
                                            'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                            (isActive && '!text-white')
                                          }
                                        >
                                          {voucher.name || `Voucher ${voucher.id}`}
                                        </NavLink>
                                      </li>
                                    ))}
                                    {purchaseVouchers.length === 0 && (
                                      <li className="px-4 text-sm text-bodydark2">No purchase vouchers found</li>
                                    )}
                                  </ul>
                                )}
                              </li>

                              <li>
                                <NavLink
                                  to="/Vouchers/view"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  View Voucher
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </>
                      ) : null}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* Role Admin_dli */}

              {mode === 'production' &&
              roles.some((role) => ['ROLE_ADMIN_DLI'].includes(role)) ? (
                <NavLink
                  to="/configurator/addcustomergroup"
                  className={({ isActive }) =>
                    'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                    (isActive && '!text-white')
                  }
                >
                  <MdGroups size={24} />
                  Customer Group
                </NavLink>
              ) : null}

              <SidebarLinkGroup
                className={`${
                  roles.some((role) =>
                    ['supervsior', 'executor', 'director'].includes(role),
                  )
                    ? 'hidden'
                    : 'hidden'
                }`}
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_SXR'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <AiOutlineProduct size={24} />
                          Products
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {mode === 'production' &&
                          roles.some((role) =>
                            ['ROLE_ADMIN'].includes(role),
                          ) ? (
                            <li>
                              <NavLink
                                to="/product/addProduct"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Add Products
                              </NavLink>
                            </li>
                          ) : null}
                          <li>
                            <NavLink
                              to="/product/viewProducts"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Products
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/product/addExcelProduct"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Excel Upload
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/product/addBulkInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Bulk Inventory Upload
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === "production" && roles.some(role => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/forms' ||
                            pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <MdAddHome size={24} />
                          Godown
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >

                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/inventory/addProductInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Inventory
                            </NavLink>
                          </li>


                          <li>
                            <NavLink
                              to="/godown/viewGodown"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Godown
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}

              {/* Suppplier Ledger */}
              {/* <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === "production" && roles.some(role => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/forms' ||
                            pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaBook size={24} />
                          Ledger
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >

                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/inventory/addProductInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Inventory
                            </NavLink>
                          </li>


                          <li>
                            <NavLink
                              to="/ledger/view"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Ledger
                            </NavLink>
                          </li>

                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}

              <SidebarLinkGroup
                className={`${
                  roles.some((role) =>
                    ['supervsior', 'executor', 'director'].includes(role),
                  )
                    ? 'hidden'
                    : 'hidden'
                }`}
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'accounts' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_SXR'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <CgShutterstock size={24} />
                          Budget
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {mode === 'accounts' &&
                          roles.some((role) =>
                            ['ROLE_ADMIN'].includes(role),
                          ) ? (
                            <li>
                              <NavLink
                                to="/configurator/addbudget"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Add Budget
                              </NavLink>
                            </li>
                          ) : null}
                          <li>
                            <NavLink
                              to="/budget/viewBudget"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Budget
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                className={`${
                  roles.some((role) =>
                    ['supervsior', 'executor', 'director'].includes(role),
                  )
                    ? 'hidden'
                    : 'hidden'
                }`}
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'accounts' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_SXR'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaShopify size={24} />
                          Shopify
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {mode === 'accounts' &&
                          roles.some((role) =>
                            ['ROLE_ADMIN'].includes(role),
                          ) ? (
                            <li>
                              <NavLink
                                to="/shopify/orders"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Fetch Shopify Orders
                              </NavLink>
                            </li>
                          ) : null}
                          <li>
                            <NavLink
                              to="/shopify/Inventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Fetch Inventory
                              
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {mode === 'production' &&
              roles.some((role) =>
                [
                  'ROLE_ADMIN',
                  'ROLE_ADMIN_DLI',
                  'ROLE_EXECUTOR',
                  'ROLE_ADMIN_SXR',
                  'ROLE_USER',
                ].includes(role),
              ) ? (
                <NavLink
                  to="/Reports"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                  }`}
                >
                  <TbReport size={24} />
                  Reports
                </NavLink>
              ) : null}

              {mode === 'production' &&
              roles.some((role) =>
                ['ROLE_ADMIN', 'ROLE_EXECUTOR', 'ROLE_ADMIN_SXR'].includes(
                  role,
                ),
              ) ? (
                <NavLink
                  to="/Order/ViewOrder"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                  }`}
                >
                  <FcSearch size={24} />
                  Search Order
                </NavLink>
              ) : null}

              {/* inventory */}

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <MdInventory2 size={24} />
                          Inventory
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/inventory/viewProductInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Inventory
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/inventory/recentTransacTions"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Recent Transactions
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/inventory/ExcelUpdateInventory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Upload Excel Update
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_DLI'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <MdInventory2 size={24} />
                          Orders
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/Order/addOrder"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Order
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/Order/ViewOrder"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Order
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/Order/ViewOrderCreated"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Edit Order
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* stock journal */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_DLI'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <BiTransfer size={24} />
                          Stock Transfer
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/stock/stockTransfer"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Stock Transfer
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/stock/ViewStockTransfer"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Stock Transfer
                            </NavLink>
                          </li>

                          {/* <li>
                            <NavLink
                              to="/Order/ViewOrderCreated"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Edit Order
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
              // activeCondition={
              //   pathname === '/configurator' || pathname.includes('configurator')
              // }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FcDataConfiguration size={24} />
                          Configurator
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/configurator/addunit"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Unit
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/location"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Location
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/addcurrency"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Currency
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addSize"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Size
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/adddesign"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Design
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addstyle"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Style
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addproductgroup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Product Group
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/addproductSubgroup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Product Sub-Group
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/addDesigngroup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Design Group
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addproductstatus"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Product Status
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addcustomergroup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Customer Group
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addordertype"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Order Type
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="/configurator/weave"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Weave Add/View
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/configurator/addgstclassification"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Gst Classification
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* <!-- Menu Item Tables --> */}

              {/* customer */}

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) =>
                        ['ROLE_ADMIN', 'ROLE_ADMIN_DLI'].includes(role),
                      ) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaUser size={22} />
                          Customer
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/customer/addCustomer"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Customer
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/customer/addCustomerBulk"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Customer Bulk
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/customer/viewCustomer"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Customer
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              {/* weaver embroider  */}

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/forms' ||
                              pathname.includes('forms')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <PiRecycleBold size={24} />
                          Supplier
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/supplier/add"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add Supplier
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/supplier/addBulkSupplier"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Bulk Add Supplier
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/supplier/view"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Supplier
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li></li>
              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            {mode === 'production' &&
            roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                Auth
              </h3>
            ) : null}

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Auth  --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/auth' || pathname.includes('auth')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {mode === 'production' &&
                      roles.some((role) => ['ROLE_ADMIN'].includes(role)) ? (
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-small text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/auth' ||
                              pathname.includes('auth')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_130_9814)">
                              <path
                                d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                                fill=""
                              />
                              <path
                                d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                                fill=""
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_130_9814">
                                <rect
                                  width="18"
                                  height="18"
                                  fill="white"
                                  transform="translate(0 0.052124)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          Authentication
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                      ) : null}

                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/auth/signup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Add User
                            </NavLink>
                          </li>
                           <li>
                            <NavLink
                              to="/auth/viewUsers"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-small text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              View Users
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
