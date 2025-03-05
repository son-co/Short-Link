import { API_URL, JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { Box, Card, Typography } from '@mui/material';

import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import Chart from './components/Chart';
import { Button, Col, Form, Image, Input, message, Row } from 'antd';
import { SET_DATA_URL_DETAIL } from '@/state/ducks/appData/types';
import { useDispatch } from 'react-redux';

// fromDate: moment(filterDate.fromDate).format('YYYY-MM-DD'),
//       toDate: moment(filterDate.toDate).format('YYYY-MM-DD'),

const DashboardPage = () => {
  const [form] = Form.useForm();
  const token = getCookie(JWT);
  const navigate = useNavigate();
  const [listData, setListData] = useState<any>([]);
  const [listDataStatistic, setListDataStatistic] = useState<any>({
    allUrls: 0,
    linkAddedThisMonth: 0,
    linkIncrement: 0,
    totalClicks: 0,
  });
  const [filterDate, setFilterDate] = useState({
    fromDate: dayjs().subtract(7, 'day'), // 7 ngày trước
    toDate: dayjs(), // Ngày hiện tại
  });
  const dispatch = useDispatch();

  const callApi = (url = '', params = {}, method = 'GET', setData?) => {
    // Kiểm tra nếu có params và là phương thức GET
    if (params && method === 'GET') {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    fetch(url, {
      method, // Phương thức HTTP (GET, POST, PUT, DELETE, ...)
      headers: {
        'Content-Type': 'application/json', // Định dạng nội dung là JSON
        Authorization: `Bearer ${token}`,
      },
      body: method !== 'GET' && params ? JSON.stringify(params) : null, // Chỉ thêm body nếu không phải GET
    })
      .then((response) => {
        if (response.status === 401) {
          // Xử lý lỗi 401 Unauthorized
          navigate(PATH.DASHBOARD_PATH);
          throw new Error('Unauthorized: Please check your token or login again.');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        setData && setData(res);
      })
      .catch((error) => {
        console.error('Error:', error); // Xử lý lỗi
      })
      .finally(() => {
        // setSpin(false);
      });
  };
  //https://apiDev.shrsms.com/api/v1/admin/click-count/get-statistic
  useEffect(() => {
    callApi(
      `${API_URL}/api/v1/admin/click-count/get-statistic`,
      {
        fromDate: filterDate.fromDate.format('YYYY-MM-DD'),
        toDate: filterDate.toDate.format('YYYY-MM-DD'),
      },
      'GET',
      setListData
    );

    callApi(`${API_URL}/api/v1/admin/overview/statistic`, {}, 'GET', setListDataStatistic);
  }, [filterDate]);

  useEffect(() => {
    console.log('son', listDataStatistic);
  }, [listDataStatistic]);

  const callApi2 = (url = '', data) => {
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
        dispatch({ type: SET_DATA_URL_DETAIL, payload: res });

        if (res) {
          form.setFieldsValue({
            shortlink: res?.data?.fullShortUrl,
            originUrl: res?.data?.originUrl,
          });
        }
        message.success('短链接创建成功');
        navigate(PATH.VIEW_LINKS_PAGE);
      })
      .catch((error) => {
        console.error('Error:', error); // Xử lý lỗi
      })
      .finally(() => {});
  };

  const onFinish = (value) => {
    const body = {
      domain: getDomain(value.originUrl),
      originUrl: value.originUrl,
      gid: 'group1',
      createdType: 0,
      validDateType: 1,
      validDate: moment().local().format('YYYY-MM-DD HH:mm:ss'),
      describe: value.describe || `Short link for ${getDomain(value.originUrl)} readme page`,
    };
    callApi2(`${API_URL}/api/v1/admin/short-link/create`, body);
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
  return (
    <Box className="py-6 px-2 sm:px-5 xl:px-20 w-full h-full">
      <Row gutter={[8, 8]} className="mb-5 w-full">
        <Col xs={24} sm={12} lg={6}>
          <Box className="flex bg-white flex-col items-center gap-1 justify-start h-full min-h-[120px] px-3 py-5">
            <Image width={20} src="/icons/link.svg" preview={false} alt="Short Link" />
            <Typography className="text-center !font-medium !text-xs">ALL URLS</Typography>
            <Typography className="text-base !font-bold">
              {listDataStatistic?.allUrls || 0}
            </Typography>
          </Box>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Box className="bg-white flex gap-1 flex-col items-center justify-start h-full min-h-[120px] px-3 py-5">
            <Image width={20} src="/icons/click.svg" preview={false} alt="Short Link" />
            <Typography className="text-center !font-medium !text-xs">TOTAL CLICKS</Typography>
            <Typography className="text-base !font-bold">
              {listDataStatistic?.totalClicks || 0}
            </Typography>
          </Box>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Box className="bg-white gap-1 flex flex-col items-center justify-start h-full min-h-[120px] px-3 py-5">
            <Image width={30} src="/icons/linkAdd.svg" preview={false} alt="Short Link" />
            <Typography className="text-center !font-medium !text-xs">
              LINKS ADDED THIS MONTH
            </Typography>
            <Typography className="text-base !font-bold">
              {listDataStatistic?.linkAddedThisMonth || 0}
            </Typography>
          </Box>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Box className="bg-white gap-1 flex flex-col items-center justify-start h-full min-h-[120px] px-3 py-5">
            <Image width={20} src="/icons/chart.svg" preview={false} alt="Short Link" />
            <Typography className="text-center !font-medium !text-xs">
              LINK INCREMENT IN JAN 2025
            </Typography>
            <Typography className="text-base !font-bold">
              {listDataStatistic?.linkIncrement || 0}
            </Typography>
          </Box>
        </Col>
      </Row>
      <Card className="w-full p-3">
        <Chart data={listData} filterDate={filterDate} />
      </Card>

      <Form form={form} onFinish={onFinish}>
        <Box
          className="flex justify-center items-center bg-white mt-5 rounded-md pr-3 py-2"
          sx={{
            input: {
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              borderRadius: '10px',
            },

            'input:focus': {
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
              borderRadius: '10px',
            },
          }}
        >
          <Form.Item name={'originUrl'} className="w-full !my-0 mx-2">
            <Input placeholder="Paste your long link here" />
          </Form.Item>
          <Button onClick={() => form.submit()} className="bg-[#89de2b]" type="primary">
            Shorten
          </Button>
        </Box>
      </Form>
    </Box>
  );
};

export default DashboardPage;
function dispatch(arg0: { type: string; payload: any }) {
  throw new Error('Function not implemented.');
}
