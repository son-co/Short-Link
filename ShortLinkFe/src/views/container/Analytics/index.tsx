import { JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import { Card, Col, DatePicker, Row } from 'antd';
import ChartStatistic from './components/Chart';
import moment from 'moment';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const AnalyticsPage = () => {
  const token = getCookie(JWT);
  const navigate = useNavigate();
  const [listData, setListData] = useState<any>([]);
  const [filterDate, setFilterDate] = useState({
    fromDate: dayjs(moment().startOf('month').toDate()), // Chuyển sang Day.js
    toDate: dayjs(moment().toDate()), // Chuyển sang Day.js
  });

  const [count, setCount] = useState(0);

  // http://8.222.220.102:8103/api/v1/admin/click-count/get-list?id=null&domain=null&shortUrl=null&ipAddress=null&originUrl=null&createdDateFrom=null&createDateTo=null
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

  // fromDate: moment(filterDate.fromDate).format('YYYY-MM-DD'),
  //       toDate: moment(filterDate.toDate).format('YYYY-MM-DD'),

  useEffect(() => {
    callApi(
      'https://apiDev.shrsms.com/api/v1/admin/click-count/get-statistic',
      {
        fromDate: filterDate.fromDate.format('YYYY-MM-DD'),
        toDate: filterDate.toDate.format('YYYY-MM-DD'),
      },
      'GET',
      setListData
    );
  }, [filterDate]);

  useEffect(() => {
    if (listData?.length > 0) {
      const dem = listData?.reduce((total, item) => total + item.totalClick, 0);
      setCount(dem);
    }
  }, [listData]);

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates[0] && dates[1]) {
      setFilterDate({
        fromDate: dates[0],
        toDate: dates[1],
      });
    }
  };

  return (
    <Box className="py-6 px-2 sm:px-5 xl:px-20 w-full h-full">
      <Box className="mb-5">
        <Typography
          sx={{
            fontFamily: 'Archivo Black',
            fontSize: 24,
            fontWeight: 400,
          }}
        >
          Analytics
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Nunito',
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          This is an example of our new Analytics dashboard using sample data. Update to display
          your data in real-time and make this report actionable.
        </Typography>
      </Box>

      <Box className="my-5 flex justify-between gap-5 w-full">
        <RangePicker
          format={'DD/MM/YYYY'}
          onChange={handleRangeChange}
          value={[filterDate?.fromDate, filterDate?.toDate]}
        />
      </Box>
      <Box
        className="w-full"
        sx={{
          '.ant-card-body': {
            padding: 0,
            height: '100%',
          },
        }}
      >
        <Box className=" w-full flex flex-col lg:flex-row items-stretch gap-5">
          <Col xs={24} lg={8} className="w-full">
            <Card className="h-full w-full p-3">
              <Box className="h-full flex flex-col">
                <Typography
                  sx={{
                    fontFamily: 'Archivo Black',
                    fontSize: 15,
                  }}
                >
                  Top performing date
                </Typography>
                <Box className="flex-1 flex flex-col justify-center items-center py-5">
                  <Typography
                    sx={{
                      fontFamily: 'Archivo Black',
                      fontSize: 16,
                    }}
                  >
                    {moment().format('MMMM D, YYYY')}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Lateef',
                      fontSize: 18,
                    }}
                  >
                    {count} Clicks + scans
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Col>
          <Col xs={24} lg={16} className="h-full w-full">
            <Card className="w-full  p-3">
              <ChartStatistic data={listData} filterDate={filterDate} />
            </Card>
          </Col>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
