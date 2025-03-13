import { JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { message } from 'antd';

import store from '@/state/store';
import { authActions } from '@/state/ducks/authUser';

const fetchApi = async ({
  url,
  method = 'GET',
  body = null,
  isToken = false,
  setLoading = (loading: boolean) => {},
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isToken?: boolean;
  setLoading?: (loading: boolean) => void;
}) => {
  const token = getCookie(JWT);
  setLoading(true); // Không còn lỗi TypeScript

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(isToken && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 401) {
      message.error('Please log in with your account!');
      store.dispatch(authActions.logout());
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.status !== 204 ? await response.json() : null;
  } catch (error: any) {
    message.error(`Error: ${error.message || 'An error occurred. Please try again!'}`);
    return null;
  } finally {
    setLoading(false);
  }
};

export default fetchApi;
