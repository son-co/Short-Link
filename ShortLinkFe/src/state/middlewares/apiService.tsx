import { API_CODE, API_URL, JWT, SUCCESS_SUFFIX } from '@/configs';
import { LOGOUT } from '@/state/ducks/authUser/types';
import { fetch } from '@/state/utils';
import { getCookie, setCookie } from '@/state/utils/session';

const REFRESH_TOKEN_PATH = '/api/v1/auth/refresh-token';

const apiService = (store: any) => (next: any) => async (action: any) => {
  const result = next(action);
  if (!action.meta || !action.meta.async) {
    return Promise.resolve(result);
  }

  const { path, method = 'get', body, withToken = false } = action.meta;
  if (!path) {
    throw new Error(`'path' not specified for async action ${action.type}`);
  }

  let url = path;

  if (path.startsWith('/')) {
    url = `${API_URL}${path}`;
  }

  try {
    // Initial API request
    const response = await fetch(url, method, body, withToken, undefined);
    return handleResponse(response, action, next);
  } catch (err: any) {
    if (err.code === API_CODE.AUTHENTICATION_INVALID) {
      // When 401 error: Perform token refresh
      try {
        await refreshToken();
        // Retry original request after token refresh
        const retryResponse = await fetch(url, method, body, true, undefined);
        return handleResponse(retryResponse, action, next);
      } catch (refreshError) {
        // Handle refresh token failure
        return handleErrors(refreshError, action, next);
      }
    }

    // Handle other errors
    return handleErrors(err, action, next);
  }
};

const refreshToken = async (): Promise<string> => {
  const refreshToken = getCookie('refreshToken', '');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response:any = await fetch(
    `${API_URL}${REFRESH_TOKEN_PATH}`, 
    'post', 
    { refreshToken }, 
    false, 
    undefined
  );

  const { accessToken, expiresIn, refreshToken: newRefreshToken } = response.data;

  // Save new tokens to cookies
  setCookie(JWT, accessToken);
  setCookie('refreshToken', newRefreshToken);
  setCookie('expiresAt', Date.now() + expiresIn * 1000);

  return accessToken;
};

const handleErrors = (err: any, action: any, next: any) => {
  let type = `${action.type}_FAILED`;
  let code = err.code;
  if (code === API_CODE.AUTHENTICATION_INVALID) {
    type = LOGOUT;
  }
  next({
    type,
    payload: err.data,
    meta: action.meta
  });
  return Promise.reject(err);
};

const handleResponse = (res: any, action: any, next: any) => {
  next({
    type: `${action.type}${SUCCESS_SUFFIX}`,
    payload: res,
    meta: action.meta
  });
  return res;
};

export default apiService;