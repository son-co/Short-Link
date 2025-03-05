import isomorphicFetch from 'isomorphic-fetch';
import { API_CODE } from '@/configs';
import ServerErrors from '@/configs/ServerErrors';
// import authActions  from '@/state/ducks/authUser';
import { authActions } from '@/state/ducks/authUser';
import store from '../store';
import authHeader from './authHeader';

export const requestHeaders = (withToken,ctx) => {
  let header = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json'
  };
  if (withToken) {
    header = {
      ...header,
      ...authHeader()
    };
  }
  return header;
};

const fetch = (url: string, method: string, body: any, withToken: boolean, ctx: any) => {
  let options: RequestInit = {
    method: method ? method : 'get',
    headers: requestHeaders(withToken, ctx),
  };

  // Fix for Edge cannot have body in options
  if (method !== 'get') {
    options = {
      ...options,
      body: JSON.stringify(body),  // TypeScript sẽ hiểu body là một phần của RequestInit
    };
  }

  return isomorphicFetch(url, options).then((res) => {
    let httpStatus = res.status;
    let resHeaders: { [key: string]: string } = {};

    try {
      res.headers.forEach((value, name) => {
        resHeaders[name] = value;
      });
    } catch (error) {
      console.error('Error while processing headers', error);
    }

    return new Promise(async (resolve, reject) => {
      if (httpStatus === 204) {
        resolve({
          content: { message: API_CODE.SUCCESS },
          headers: resHeaders,
        });
      } else if (httpStatus >= 200 && httpStatus <= 299) {
        try {
          let json = await res.json();
          resolve({ content: json, headers: resHeaders });
        } catch (error) {
          resolve({
            content: { message: API_CODE.SERVER_MAINTENANCE },
            headers: resHeaders,
          });
          console.error('Error while parsing JSON', error);
        }
      } else if (httpStatus === 400) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
        } catch (error) {
          console.error('Error while parsing 400 response', error);
        }
      } else if (httpStatus === 401) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
          store.dispatch(authActions.logout());
        } catch (error) {
          console.error('Error while parsing 401 response', error);
        }
        reject(ServerErrors.getServerError({ message: API_CODE.AUTHENTICATION_INVALID }));
        store.dispatch(authActions.logout());
      } else if (httpStatus === 403) {
        try {
          let json = await res.json();
          reject(ServerErrors.getServerError(json));
          store.dispatch(authActions.logout());
        } catch (error) {
          console.error('Error while parsing 403 response', error);
        }
        reject(ServerErrors.getServerError({ message: API_CODE.FORBIDDEN }));
        store.dispatch(authActions.logout());
      } else if (httpStatus === 404) {
        try {
          reject(ServerErrors.getServerError({ message: API_CODE.NOT_FOUND }));
        } catch (error) {
          console.error('Error while handling 404 response', error);
        }
      } else {
        reject(ServerErrors.getServerError({ message: API_CODE.SERVER_MAINTENANCE }));
      }
    });
  });
};


export default fetch;
