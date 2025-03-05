import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import * as PATH from '@/routes/routesConfig';
import DashboardLayoutNew from './DashboardLayoutNew';
import MainLayout from './MainLayout';

const LayoutContainer = ({ children }) => {
  const location = useLocation();
  const validPaths = [PATH.LOGIN_PATH, PATH.REGISTER_PATH];
  const dbPaths = [PATH.DASHBOARD_PATH];

  const isValidPath = validPaths.includes(location.pathname);
  const isDbPath = dbPaths.includes(location.pathname);
  return (
    <>
      {isValidPath ? (
        <>
          <AuthLayout>{children}</AuthLayout>
        </>
      ) : (
        <>
          {isDbPath ? (
            <DashboardLayoutNew>{children}</DashboardLayoutNew>
          ) : (
            <MainLayout>{children}</MainLayout>
          )}
          {/* <DashboardLayoutNew>{children}</DashboardLayoutNew> */}
          {/* <MainLayout>{children}</MainLayout> */}
        </>
      )}
    </>
  );
};

export default LayoutContainer;
