import { API_URL } from '@/configs';
import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

import fetchApi from '../fetch';

const EditModal = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApi({
        url: `${API_URL}/api/v1/admin/group-link/${props?.groupId}`,
        method: 'GET',
        isToken: true,
      });
      form.setFieldsValue({
        name: data?.groupName,
      });
    };
    if (props?.groupId) {
      fetchData();
    }
  }, [props?.groupId]);

  const submitForm = async (body) => {
    const data = await fetchApi({
      url: `${API_URL}/api/v1/admin/group-link/update`,
      method: 'PUT',
      body: body,
      isToken: true,
      setLoading: (loading: boolean) => {
        props?.setIsOpenModal(loading);
        props?.setNeedLoadData(true);
        props?.setGroupId(null);
      },
    });
  };

  const onFinish = (value) => {
    const body = {
      id: props?.groupId,
      groupName: value.name,
    };

    submitForm(body);
  };
  return (
    <Modal
      open={props?.isOpenModal}
      onCancel={() => {
        props?.setIsOpenModal(false);
        form.resetFields();
        props?.setGroupId(null);
      }}
      onOk={() => form.submit()}
      okText="Confirm"
      title="Update group"
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Name is require' }]}>
          <Input placeholder="Enter group name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
