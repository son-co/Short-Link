import { createSelector } from 'reselect';
const path = 'appData';

export const getDataUrl = createSelector(
  (state) => state[path].dataUrl,
  (dataUrl) => dataUrl
);

export const getShortLinkDetail = createSelector(
  (state) => state[path].shortLinkDetail,
  (shortLinkDetail) => shortLinkDetail
);

export const getIsShowModal = createSelector(
  (state) => state[path].isShowModal,
  (isShowModal) => isShowModal
);
