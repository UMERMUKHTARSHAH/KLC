import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import { FaCircleUser, FaChevronDown } from 'react-icons/fa';

import UserOne from '../../images/user/user-01.png';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../../redux/Slice/UserSlice';

import { clearAppMode } from '../../redux/Slice/AppModeSlice';
import { FaCircleUser } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa';

const DropdownUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state?.persisted?.user);

  

  //console.log(currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });
  const handleLogout = () => {
    try {
      dispatch(signoutSuccess());
      dispatch(clearAppMode());
      navigate('/auth/signin');
    } catch (error) {}
  };

  return (
  <div className="relative">
  <button
    ref={trigger}
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl px-3 py-2 transition-all duration-200 group"
  >
    {/* User Info - Hidden on mobile */}
    {/* <div className="hidden lg:block text-right">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
          {currentUser?.user?.username || 'User'}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {currentUser?.user?.authorities?.[0]?.authority?.split('_').pop() || 'User'}
        </span>
      </div>
    </div> */}

    {/* Avatar with gradient ring */}
    <div className="relative flex h-11 w-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20 flex-shrink-0 group-hover:shadow-blue-500/30 transition-all duration-300">
      <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
        {currentUser?.user?.username ? (
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {currentUser.user.username.charAt(0).toUpperCase()}
          </span>
        ) : (
          <FaCircleUser size={32} className="text-gray-500 dark:text-gray-400" />
        )}
      </div>
      {/* Online status dot */}
      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 shadow-sm shadow-green-500/30">
        <span className="sr-only">Online</span>
      </div>
    </div>

    {/* Dropdown arrow */}
    <FaChevronDown 
      className={`text-gray-400 dark:text-gray-500 text-xs transition-transform duration-200 ${
        dropdownOpen ? 'rotate-180' : ''
      }`}
    />
  </button>

  {/* Dropdown Menu */}
  <div
    ref={dropdown}
    className={`absolute right-0 mt-3 w-56 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-boxdark/95 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden transition-all duration-200 ${
      dropdownOpen 
        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
    }`}
  >
    {/* User Info Header */}
    <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] flex-shrink-0">
          <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            {currentUser?.user?.username ? (
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {currentUser.user.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaCircleUser size={28} className="text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800 dark:text-white ">
            {currentUser?.user?.username || 'User'}
          </span>
           <span className="text-xs text-red-600 font-semibold text-gray-500 dark:text-gray-400 animate-blink">
            {(currentUser?.user.authorities[0].authority).split("_")[1] || 'No Email'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentUser?.user?.email || 'No Email'}
          </span>

        </div>
      </div>
    </div>

    {/* Menu Items */}
    <ul className="py-2">
      {/* <li>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </Link>
      </li>
      <li>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Account Settings
        </Link>
      </li> */}
    </ul>

    {/* Divider */}
    <div className="border-t border-gray-200/50 dark:border-gray-700/50"></div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50/50 hover:to-red-50/50 dark:hover:from-red-900/20 dark:hover:to-red-900/20 transition-all duration-200 group"
    >
      <svg className="w-4 h-4 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Log Out
    </button>
  </div>
</div>
  );
};

export default DropdownUser;
