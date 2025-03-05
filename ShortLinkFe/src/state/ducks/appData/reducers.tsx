import * as types from './types';
import { produce } from 'immer';

const initialState: {
  initData: string | null;
  dataUrl: any;
  shortLinkDetail: any;
  isShowModal: boolean;
} = {
  initData: null,
  dataUrl: {},
  shortLinkDetail: {},
  isShowModal: false,
};

const reducer = produce((draft, { payload, type }) => {
  switch (type) {
    case types.INIT_APP_DATA:
      draft.initData = 'success';
      return;
    case types.SET_DATA_URL:
      draft.dataUrl = payload;
      break;
    case types.RESET_DATA_URL:
      draft.dataUrl = {};
      break;
    case types.SET_DATA_URL_DETAIL:
      draft.shortLinkDetail = payload;
      draft.isShowModal = true;
      break;
    case 'HIDE_MODAL':
      draft.isShowModal = true;
      break;
    case types.RESET_DATA_URL_DETAIL:
      draft.shortLinkDetail = {};
      draft.isShowModal = false;
      break;
    default:
      return draft;
  }
}, initialState);

export default reducer;
