import { API_URL } from '@/configs';
import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

import fetchApi from '../fetch';

const ConfirmModal = (props) => {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApi({
        url: `${API_URL}/api/v1/admin/group-link/${props?.groupId}`,
        method: 'GET',
        isToken: true,
      });
      setData(data);
    };
    if (props?.groupId) {
      fetchData();
    }
  }, [props?.groupId]);

  const submitForm = async () => {
    const data = await fetchApi({
      url: `${API_URL}/api/v1/admin/group-link/${props?.groupId}`,
      method: 'DELETE',
      isToken: true,
      setLoading: (loading: boolean) => {
        props?.setIsOpenModal(loading);
        props?.setNeedLoadData(true);
        props?.setGroupId(null);
      },
    });
  };

  return (
    <Modal
      open={props?.isOpenModal}
      onCancel={() => {
        props?.setIsOpenModal(false);
        props?.setGroupId(null);
      }}
      onOk={() => submitForm()}
      okText="Delete"
      okType="danger"
      title="Confirm delete group"
    >
      Are you sure you want to delete <strong>{data?.groupName}</strong> ?
    </Modal>
  );
};

export default ConfirmModal;
