import { Routes, Route, useLocation, Navigate, matchPath } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import AuthPage from '@/views/container/AuthPage';
import HomePage from '@/views/container/HomePage';
import LinksPage from '@/views/container/Links';
import AddLinks from '@/views/container/Links/Forms/AddLinks';
import ViewLinks from '@/views/container/Links/Forms/ViewLinks';
import AnalyticsPage from '@/views/container/Analytics';
import DashboardPage from '@/views/container/Dashboard';

const AppRoutes = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const currentPath = location.pathname;

  // Nếu path không tồn tại trong danh sách hợp lệ, chuyển hướng về Dashboard
  const isValidPath = PATH.DATA_PATH.some((path) => matchPath(path, currentPath));
  if (!isValidPath) {
    return <Navigate to={PATH.DASHBOARD_PATH} replace />;
  }

  return (
    <Routes>
      <Route path={PATH.LOGIN_PATH} element={<AuthPage />} />

      <Route path={PATH.DASHBOARD_PATH} element={<HomePage />} />
      <Route path={PATH.LINKS_PAGE} element={<LinksPage />} />
      <Route path={PATH.ADD_LINKS_PAGE} element={<AddLinks />} />
      <Route path={PATH.VIEW_LINKS_PAGE} element={<ViewLinks />} />
      <Route path={PATH.ANALYTICS_PAGE} element={<AnalyticsPage />} />
      <Route path={PATH.HOME_PATH} element={<DashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
