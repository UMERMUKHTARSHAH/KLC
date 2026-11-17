// src/routes/PrivateRoute.js
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { signoutSuccess } from '../redux/Slice/UserSlice';
import ModeSelectionModal from '../components/Modal/ModeSelectionModel';

// A missing, malformed, or expired token all count as "not valid"
const isTokenInvalid = (token) => {

  console.log(token,"1212121");
  
  if (!token || typeof token !== 'string') return true;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.persisted.user);
  const appMode = useSelector((state) => state.persisted.appMode?.mode);
  const dispatch = useDispatch();
  const location = useLocation();

  const token = currentUser?.token;
  const invalid = !currentUser || isTokenInvalid(token);

  const checkAndLogout = useCallback(() => {
    if (currentUser && isTokenInvalid(currentUser.token)) {
      dispatch(signoutSuccess());
    }
  }, [currentUser, dispatch]);

  // Runs on mount, on every page change, and every 5 seconds
  useEffect(() => {
    checkAndLogout();
    const interval = setInterval(checkAndLogout, 5000);
    return () => clearInterval(interval);
  }, [checkAndLogout, location.pathname]);

  if (invalid) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  if (!appMode) {
    return <ModeSelectionModal />;
  }

  return <Outlet />;
};

export default PrivateRoute;