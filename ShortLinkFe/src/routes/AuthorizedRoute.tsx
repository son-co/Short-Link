import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { LOGIN_PATH, DASHBOARD_PATH, REGISTER_PATH } from '@/routes/routesConfig';
import { getAuthentication } from '@/state/ducks/authUser/selectors';

interface AuthorizedRouteProps {
  children: React.ReactNode;
  path: string;
  isAuthenticated: boolean;
}

const AuthorizedRoute: React.FC<AuthorizedRouteProps> = ({ children, path, isAuthenticated }) => {
  // Điều hướng dựa trên trạng thái xác thực
  if (isAuthenticated && path === LOGIN_PATH) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  if (!isAuthenticated && path !== LOGIN_PATH) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  return <>{children}</>;
};

export default connect((state: any) => ({
  isAuthenticated: getAuthentication(state),
}))(AuthorizedRoute);
