import { getCookie } from '@/state/utils/session';
import { JWT } from '@/configs';
import { message } from 'antd';

import store from '@/state/store';
import { authActions } from '@/state/ducks/authUser';

export const handleApiWithToken = (apiUrl, method = 'GET', body?, params?, noti?, t?) => {
  const token = getCookie(JWT);

  const queryParams = new URLSearchParams(params || {});
  let endApi = `${apiUrl}?${queryParams.toString()}`;
  endApi = endApi.replace(/\?+$/, '');

  return fetch(Boolean(params) ? endApi : apiUrl, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
  })
    .then((response) => {
      if (response.status === 401) {
        store.dispatch(authActions.logout());
        window.location.href = '/login';
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // return response.json();
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return null; // Hoặc xử lý tùy theo yêu cầu
      }
    })
    .then((data) => {
      noti && message.success(noti);
      return data; // Trả về dữ liệu từ API
    })
    .catch((error) => {
      t && message.error(t('Something went wrong! Please try again.'));
      throw error; // Ném lỗi ra ngoài nếu cần
    });
};

export const handleApiWithOutToken = (apiUrl, method = 'GET', body?, params?, noti?, t?) => {
  const queryParams = new URLSearchParams(params || {});
  let endApi = `${apiUrl}?${queryParams.toString()}`;
  endApi = endApi.replace(/\?+$/, '');

  return fetch(endApi, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
  })
    .then((response) => {
      if (response.status === 401) {
        store.dispatch(authActions.logout());
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // return response.json();
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return null; // Hoặc xử lý tùy theo yêu cầu
      }
    })
    .then((data) => {
      noti && message.success(noti);
      return data; // Trả về dữ liệu từ API
    })
    .catch((error) => {
      t && message.error(t('Something went wrong! Please try again.'));
      throw error; // Ném lỗi ra ngoài nếu cần
    });
};
