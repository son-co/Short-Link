import { createSelector } from 'reselect';
const path = 'authUser';

const userDataSelector = (state) => state[path].user;
export const getAuthUser = createSelector(userDataSelector, (user) => user);

const userDataRoleBase = (state) => state[path].roleBase;
export const getRoleBase = createSelector(userDataRoleBase, (roleBase) => roleBase);

export const getAuthentication = createSelector(
  (state) => state[path].isAuthenticated,
  (isAuthenticated) => isAuthenticated
);

