import { API_URL } from '@/configs';
import React, { useEffect, useState } from 'react';
import fetchApi from './fetch';
import { Button, Card, Form, Input, Modal, Table } from 'antd';
import { Box } from '@mui/material';
import moment from 'moment';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import EditModal from './Components/EditModal';
import ConfirmModal from './Components/ConfirmModal';

const GroupsPage = () => {
  const [listData, setListData] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [needLoadData, setNeedLoadData] = useState(true);
  const [groupId, setGroupId] = useState(null);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApi({
        url: `${API_URL}/api/v1/admin/group-link/get-list`,
        method: 'GET',
        isToken: true,
        setLoading: (loading: boolean) => setLoading(loading),
      });
      setListData(data);
      setNeedLoadData(false);
    };

    needLoadData && fetchData();
  }, [needLoadData]);

  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'groupName',
      key: 'id',
    },
    {
      title: 'Created date',
      dataIndex: 'createdDate',
      key: 'id',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: '150px',
      align: 'center',
      key: 'id',
      render: (text) => {
        return (
          <Box
            className="flex gap-2 w-full justify-center"
            sx={{
              '.ant-btn': {
                padding: '0px',
              },
            }}
          >
            {/* <Button type="text" className="text-green-600 !p-0">
              <EyeFilled />
            </Button> */}
            <Button
              type="text"
              className="text-yellow-600"
              onClick={() => {
                setGroupId(text);
                setIsShowEditModal(true);
              }}
            >
              <EditFilled />
            </Button>
            <Button
              type="text"
              className="text-red-500"
              onClick={() => {
                setGroupId(text);
                setIsShowConfirmModal(true);
              }}
            >
              <DeleteFilled />
            </Button>
          </Box>
        );
      },
    },
  ];

  const submitForm = async (body) => {
    const data = await fetchApi({
      url: `${API_URL}/api/v1/admin/group-link/create`,
      method: 'POST',
      body: body,
      isToken: true,
      setLoading: (loading: boolean) => {
        setIsOpenModal(loading);
        setNeedLoadData(true);
      },
    });
  };

  const onFinish = (value) => {
    const body = {
      groupName: value.name,
    };

    submitForm(body);
  };
  return (
    <Box className="py-6 px-2 sm:px-5 xl:px-20 w-full h-full">
      <Card>
        <Table
          scroll={{ x: 700 }}
          columns={columns}
          loading={loading}
          bordered
          dataSource={listData}
          title={() => (
            <>
              <Button
                className="bg-cyan-500 text-white"
                variant="solid"
                onClick={() => setIsOpenModal(true)}
              >
                Create new groups
              </Button>
            </>
          )}
          // pagination={true}
        />
      </Card>

      <EditModal
        groupId={groupId}
        isOpenModal={isShowEditModal}
        setIsOpenModal={setIsShowEditModal}
        setGroupId={setGroupId}
        setNeedLoadData={setNeedLoadData}
      />

      <ConfirmModal
        groupId={groupId}
        isOpenModal={isShowConfirmModal}
        setIsOpenModal={setIsShowConfirmModal}
        setGroupId={setGroupId}
        setNeedLoadData={setNeedLoadData}
      />

      <Modal
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title="Create group"
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Name is require' }]}>
            <Input placeholder="Enter group name" />
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default GroupsPage;
