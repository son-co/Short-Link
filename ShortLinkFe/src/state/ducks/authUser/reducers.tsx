import { produce } from 'immer';
import { SUCCESS_SUFFIX } from '@/configs';
import { addAuthorizedUser, addRefreshToken, removeAuthorizedUser } from '@/state/utils/session';
import { getString } from '@/views/utilities/helpers/utilObject';
import * as types from './types';
const initialState = {
  user: {},
  isAuthenticated: false,
  roleBase: {},
};

const reducer = produce((draft, { type, payload }) => {
  switch (type) {
    case types.LOGIN + SUCCESS_SUFFIX:
      if (payload) {
        addAuthorizedUser(payload?.token);

        draft.isAuthenticated = true;
      }
      return;
    case types.LOGIN:
      if (payload) {
        addAuthorizedUser(payload?.token);

        draft.isAuthenticated = true;
      }
      return;
    case types.GET_TENANT_INFO + SUCCESS_SUFFIX:
      if (payload) {
        draft.user = payload?.content?.data;
      }
      return;
    case types.LOGOUT:
      removeAuthorizedUser();
      draft.isAuthenticated = false;
      draft.user = {};
      return;
    default:
      return draft;
  }
}, initialState);

export default reducer;
