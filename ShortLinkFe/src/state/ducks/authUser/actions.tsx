import apiAction, { defaultAction } from '@/state/ducks/utils/createAction';
import * as types from './types';
import parseObjToQuery from '../utils/parseObjToQuery';

export const getCapcha = () => apiAction('get')(types.GET_CAPCHA, `/api/v1/auth/captcha`);
// export const logout = () => apiAction('delete')(types.LOGOUT, `/api/v1/auth/logout`, {});
export const logout = () => defaultAction(types.LOGOUT);
export const login = (params) =>
  apiAction('post')(types.LOGIN, `/api/v1/auth/login${parseObjToQuery(params)}`, {});
export const register = (params, body) =>
  apiAction('post')(types.LOGIN, `/api/v1/tenants/registration${parseObjToQuery(params)}`, body);

export const logoutWithApi = () => apiAction('delete')(types.LOGOUT, `/api/v1/auth/logout`, {});
