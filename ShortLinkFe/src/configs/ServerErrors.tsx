import { isObject, isString } from 'lodash-es';
import { PureComponent } from 'react';
import { API_CODE } from '@/configs';
import { getString } from '@/views/utilities/helpers/utilObject';
import { message } from 'antd';

export default class ServerError extends PureComponent {
  static getServerError(res) {
    if (`${res}` === 'TypeError: Failed to fetch') {
      return { message: API_CODE.SERVER_MAINTENANCE };
    }
    let errorCode = (getString(res, 'message') || '').replace(/\./g, '_');
    return { ...res, message: errorCode };
  }

  static getMessage(msg) {
    if (isString(msg)) {
      return msg;
    } else if (isObject(msg)) {
      return getString(msg, 'message');
    }
    return '';
  }
}

export function showToastError(msg, timePopUp = 3, onClose) {
  message.error(ServerError.getMessage(msg), timePopUp, onClose);
}
export const showToastSuccess = (msg, timePopUp = 3, onClose) => {
  message.success(ServerError.getMessage(msg), timePopUp, onClose);
};
