import { Link, useNavigate } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import { FaHome } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setAppMode } from '../../redux/Slice/AppModeSlice';
import { TbSwitch } from 'react-icons/tb';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineDisconnect, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaKaggle } from 'react-icons/fa6';
import { Button } from 'react-bootstrap';

const Header = (props) => {
  const appMode = useSelector((state) => state?.persisted?.appMode);
  const dispatch = useDispatch();
  const { mode } = appMode;
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const navigate = useNavigate();

  const handleModeChange = (newMode) => {
    dispatch(setAppMode(newMode));
    toast.success(
      `Welcome To ${newMode.charAt(0).toUpperCase() + newMode.slice(1)}`,
    );

    setShowModeDropdown(false);
    // You might want to navigate to a specific route or refresh data here
    // navigate('/home');
  };

  const handleModeeChange = (newMode) => {
    dispatch(setAppMode(newMode));
    toast.success(`Welcome To ${newMode.toUpperCase()} Mode`);
    setShowModeDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* Hamburger Toggle BTN */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            {/* <img src={LogoIcon} alt="Logo" /> */}
          </Link>
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="flex items-center justify-between">
              <h3 className="uppercase font-bold text-md leading-tight tracking-[10px]">
                CRAFT-FLOW ERP
              </h3>
              <Button
                variant="primary"
                className="text-sm flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-200 to-blue-400 hover:from-blue-400 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => navigate('/connectToShopify')}
              >
                <AiOutlineDisconnect size={16} className="inline-block" />
                <span className='text-xs'>Check Connection</span>
              </Button>
            </div>
            <div>{/* Your form content here */}</div>
          </form>
        </div>

        <div className="flex items-center gap-1 2xsm:gap-5">
          
          <ul className="flex items-center gap-1 2xsm:gap-3">
            <DarkModeSwitcher />
          </ul>
          <ul>
            <FaHome
              className="cursor-pointer p-2 bg-slate-500 text-white rounded-full"
              size={35}
              onClick={() => navigate('/')}
            />
          </ul>

          {/* Mode Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className={`capitalize rounded-3xl p-2 ${
                mode === 'production'
                  ? 'bg-slate-500 hover:bg-red-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white`}
            >
              <TbSwitch />
            </button>

            {showModeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-boxdark rounded-md shadow-lg z-50">
                <div
                  className="py-1"
                  onMouseLeave={() => setShowModeDropdown(false)}
                >
                  <button
                    onClick={() => handleModeChange('production')}
                    className={`block w-full text-left px-4 py-2 ${
                      mode === 'production'
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Production Mode
                  </button>
                  <button
                    onClick={() => handleModeChange('accounts')}
                    className={`block w-full text-left px-4 py-2 ${
                      mode === 'accounts'
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Accounts Mode
                  </button>
                </div>
              </div>
            )}
          </div>

       
          <ul>
            <DropdownNotification />
            {/* <FaKaggle
  className="cursor-pointer p-2 bg-slate-500 text-white rounded-full"
  size={31}
  onClick={() => handleModeeChange('kani')}
/> */}
          </ul>

          {/* User Area */}
          <DropdownUser />
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default Header;
