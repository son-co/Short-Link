import { Box, Typography } from '@mui/material';
import { Button, Form, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { PlusSquareOutlined } from '@ant-design/icons';
import { RiDeleteBinLine } from '@remixicon/react';
import TableHome from './components/TableHome';
import AInput from '@/views/presentations/AInput';
import { handleApiWithToken } from '@/api';
import moment from 'moment';
import { Input } from 'antd';
import { getCookie } from '@/state/utils/session';
import { JWT } from '@/configs';

const { TextArea } = Input;
const HomePage = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [shortLink, setShortLink] = React.useState('');
  const [spin, setSpin] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const token = getCookie(JWT);

  const callApi = (url = '', data) => {
    fetch(url, {
      method: 'POST', // Phương thức HTTP là POST
      headers: {
        'Content-Type': 'application/json', // Định dạng nội dung là JSON

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Chuyển đổi dữ liệu thành chuỗi JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        setShortLink(res?.data?.fullShortUrl);
        setIsClose(true);
        if (res) {
          form.setFieldsValue({
            shortlink: res?.data?.fullShortUrl,
            originUrl: res?.data?.originUrl,
          });
        }
        message.success('短链接创建成功');
      })
      .catch((error) => {
        console.error('Error:', error); // Xử lý lỗi
      })
      .finally(() => {
        setSpin(false);
      });
  };

  const onFinish = (value) => {
    setSpin(true);
    const body = {
      domain: getDomain(value.originUrl),
      originUrl: value.originUrl,
      gid: 'group1',
      createdType: 0,
      validDateType: 1,
      validDate: moment().local().format('YYYY-MM-DD HH:mm:ss'),
      describe: value.describe || `Short link for ${getDomain(value.originUrl)} readme page`,
    };
    callApi('https://apiDev.shrsms.com/api/v1/admin/short-link/create', body);
  };

  function getDomain(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname; // Returns only the domain (e.g., ant.design)
    } catch (error) {
      console.error('Invalid URL', error);
      return null;
    }
  }

  const handleOk = () => {
    if (isClose) {
      setIsModalOpen(false);
    } else {
      form.submit();
    }
  };

  return (
    <Box className="w-full flex">
      <Box className="w-[190px] min-w-[190px]  bg-white flex flex-col justify-between divide-y-[1px]">
        <Box
          className="p-2 flex justify-between items-center"
          sx={{
            svg: {
              width: '18px',
              height: '18px',
            },
          }}
        >
          <Typography className="text-black" fontWeight={600}>
            短链分组 <span style={{ fontWeight: 400 }}>共0组</span>
          </Typography>{' '}
          <Button type="text">
            <PlusSquareOutlined style={{ color: '#0e87de' }} />
          </Button>
        </Box>
        <Box className="flex-1"></Box>
        <Box
          className="p-2 flex justify-center items-center"
          sx={{
            svg: {
              width: '18px',
              height: '18px',
            },
          }}
        >
          <Button type="link">
            <Typography className="text-black">回收站</Typography>{' '}
            <RiDeleteBinLine
              size={36} // set custom `width` and `height`
              color="#0e87de" // set `fill` color
              className="my-icon" // add custom class name
            />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 'calc(100% - 190px)',
        }}
      >
        <Box className="p-4" sx={{ width: 'calc(100%)', height: '100%' }}>
          <Box className="bg-white w-full" sx={{ height: '100%' }}>
            <Box className="p-4 w-full flex justify-start items-center gap-8">
              <Button
                type="primary"
                color="primary"
                className="px-8"
                onClick={() => setIsModalOpen(true)}
              >
                创建短链
              </Button>
              <Button color="primary" className="px-8">
                批量创建
              </Button>
            </Box>
            <Box>
              <TableHome />
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title="创建短链"
        width={400}
        onOk={handleOk}
        maskClosable={false}
        footer={[
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>,
          <Button
            onClick={() => {
              setIsModalOpen(false);
              form.resetFields();
              setIsClose(false);
            }}
          >
            取消
          </Button>,
          <Button type="primary" onClick={handleOk}>
            确认
          </Button>,
        ]}
      >
        <Form form={form} className="mt-5" onFinish={onFinish}>
          <Spin spinning={spin}>
            <AInput
              name="originUrl"
              require={true}
              sx={{ width: '100%' }}
              label="普通跳转:"
              placeholder="分组名称"
              allowClear
            />
            {/* <Box className="">
            <Typography sx={{ whiteSpace: 'nowrap ' }}>描述:</Typography>
            <TextArea name="describe" autoSize placeholder="输入描述" />
          </Box> */}
            {shortLink && isClose && (
              <AInput
                name="shortlink"
                require={false}
                sx={{ width: '100%' }}
                label="短链接: "
                placeholder="短链接"
                allowClear
              />
            )}
          </Spin>
        </Form>
      </Modal>
    </Box>
  );
};

export default HomePage;
