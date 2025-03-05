import { Box, Card, Typography } from '@mui/material';
import { Col, Form, message, Row, Image, Tabs, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input } from 'antd';
import { getCookie } from '@/state/utils/session';
import { Link, useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import { SET_DATA_URL } from '@/state/ducks/appData/types';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import { API_URL, JWT } from '@/configs';

const HomePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [tabActive, setTabActive] = useState('1');
  const token = getCookie(JWT);
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    callApi(`${API_URL}/api/v1/admin/short-link/get-list`);
  }, []);

  const callApi = (url = '', data?, method = 'GET') => {
    fetch(url, {
      method: method, // Phương thức HTTP là POST
      headers: {
        'Content-Type': 'application/json', // Định dạng nội dung là JSON

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Chuyển đổi dữ liệu thành chuỗi JSON
    })
      .then((response) => {
        if (response.status === 401) {
          // Xử lý lỗi 401 Unauthorized
          if (data) {
            dispatch({ type: SET_DATA_URL, payload: data });
            navigate(PATH.LOGIN_PATH);
          }
          throw new Error('Unauthorized: Please check your token or login again.');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        navigate(PATH.LINKS_PAGE);
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
    const domain = getDomain(value.originUrl);
    const body = {
      domain: domain,
      originUrl: value.originUrl,
      gid: 'group1',
      createdType: 0,
      validDateType: 1,
      validDate: moment().local().format('YYYY-MM-DD HH:mm:ss'),
      describe: value.describe || `Short link for ${domain} readme page`,
    };
    callApi(`${API_URL}/api/v1/admin/short-link/create`, body, 'POST');
  };

  function getDomain(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname; // Returns only the domain (e.g., ant.design)
    } catch (error) {
      console.error('Invalid URL', error);
      message.error('Incorrect link format');
      return null;
    }
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={onFinish}>
        <Typography
          fontWeight={400}
          sx={{
            fontFamily: 'Archivo Black',
            color: '#000',
            fontSize: { xs: 20, sm: 24, md: 28 },
          }}
        >
          {tabActive == '1' ? 'Shorten a long link' : 'Create a QR Code'}
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={800}
          sx={{
            fontFamily: 'Nunito',
            color: '#000',
          }}
        >
          No credit card required.
        </Typography>
        <Box className="mt-5"></Box>

        <Typography
          fontWeight={400}
          sx={{
            fontSize: { xs: 18, sm: 18, md: 20 },
            fontFamily: 'Archivo Black',
            color: '#000',
          }}
        >
          Paste your long link here
        </Typography>
        <Form.Item
          name="originUrl"
          rules={[
            {
              required: true,
              message: 'Link is required',
            },
            {
              type: 'url',
              message: "We'll need a valid URL, like 'super-long-link.com/shorten-it'",
            },
          ]}
        >
          <Input
            className="rounded-md border-2 py-3"
            placeholder="http://example.com/your-long-url"
          />
        </Form.Item>
        <Box
          className="p-3 cursor-pointer border rounded-md bg-[#000] inline-flex gap-2 items-center"
          onClick={() => form.submit()}
        >
          <Typography
            fontWeight={400}
            className="text-white"
            sx={{
              fontFamily: 'Archivo Black',
              fontSize: { xs: 13, md: 15 },
            }}
          >
            {tabActive == '1' ? 'Get your link for free' : 'Get your QR Code for free'}
          </Typography>
          <Image src="/right.svg" preview={false} width={15} height={15} alt="" />
        </Box>
      </Form>
    );
  };

  const dataTabs = [
    {
      label: (
        <Box className="flex justify-center items-center gap-2">
          <Image src={'/shortLink.svg'} width={20} height={20} alt="" preview={false} />
          <Typography>Short Link</Typography>
        </Box>
      ),
      key: '1',
      children: (
        <Box className="bg-white w-full p-5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
          {renderForm()}
        </Box>
      ),
    },
    // {
    //   label: (
    //     <Box className="flex justify-center items-center gap-2">
    //       <Image src={'/qrcode.svg'} width={20} height={20} alt="" preview={false} />
    //       <Typography
    //         sx={{
    //           color: 'currentColor',
    //         }}
    //       >
    //         QR Code
    //       </Typography>
    //     </Box>
    //   ),
    //   key: '2',
    //   children: (
    //     <Box className="bg-white w-full p-5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
    //       {renderForm()}
    //     </Box>
    //   ),
    // },
  ];

  return (
    <Box className="bg-[#050d10] w-full flex flex-col h-screen">
      <Header />

      <Box className="flex-grow">
        <Box
          className="h-full xl:flex Xl:flex-col"
          sx={{
            '.border-col-2': {
              borderTopLeftRadius: { xs: 0, xl: 100 },
            },
          }}
        >
          <Col xs={24} xl={14} className="xl:bg-[#28413e] h-auto xl:h-full">
            <Box
              className="flex-col bg-[#050d10] pl-0 sm:pl-5 md:pl-16 xl:pl-20 xxl:pl-32 items-center justify-center self-end h-full"
              sx={{
                borderBottomLeftRadius: { xs: 0, xl: 50 },
                borderBottomRightRadius: { xs: 0, xl: 80 },
              }}
            >
              <Box className="mr-5 md:mr-16 xl:mr-32  flex flex-col items-center justify-center h-full self-end">
                <Box className="mb-20">
                  <Typography
                    sx={{
                      fontFamily: 'Archivo Black',
                      fontSize: { xs: 18, sm: 24, md: 36 },
                      textAlign: 'center',
                      fontWeight: 400,
                    }}
                  >
                    Create links, optimize sharing
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: 'Nunito',
                      fontSize: { xs: 14, sm: 18, md: 22 },

                      fontWeight: 400,
                      textAlign: 'center',
                      color: '#22A595',
                      padding: '0px 20px',
                    }}
                  >
                    Shorten the clutter and maximize your impact. By turning long URLs into simple,
                    shareable links, you’ll not only make your content cleaner but also increase
                    your audience reach. Reach more people with less effort and see the difference a
                    small link can make.
                  </Typography>
                </Box>
                <Box className="pb-5 hidden xl:block">
                  <Typography
                    sx={{
                      fontFamily: 'Archivo Black',
                      fontSize: 28,
                      fontWeight: 400,
                      textAlign: 'center',
                      marginBottom: 3,
                    }}
                  >
                    Sign up for free. Your free plan includes:
                  </Typography>
                  <Box className="flex items-center justify-center gap-2 mb-3 ">
                    <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />

                    <Typography>Unlimited link clicks</Typography>
                  </Box>
                  <Box className="flex items-center justify-between gap-2">
                    <Box className="flex items-center justify-center gap-2">
                      <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />
                      <Typography>5 short links/month</Typography>
                    </Box>
                    <Box className="flex items-center justify-center gap-2">
                      <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />
                      <Typography>3 custom back-halves/month</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Col>
          <Col
            xs={24}
            xl={10}
            className="bg-[#050d10] xl:bg-[#28413e] min-h-full border-col-2"
            style={{}}
          >
            <Box className="h-full flex justify-start items-center ">
              <Box
                className="ml-5 md:ml-20 mr-5 md:mr-16 xl:mr-32 w-full bg-transparent"
                sx={{
                  '.ant-tabs-nav': {
                    margin: '0px !important',
                  },
                  '.ant-tabs-nav::before': {
                    borderBottom: 'none !important',
                  },
                  '.ant-tabs-tab': {
                    background: '#050d10 !important',
                    color: '#fff !important',
                    fontFamily: 'Archivo Black',
                  },
                  '.ant-tabs-tab.ant-tabs-tab-active': {
                    background: '#fff !important',
                    color: '#000 !important',
                    fontFamily: 'Archivo Black',
                  },
                  '.ant-tabs-tab.ant-tabs-tab-active p': {
                    color: '#000 !important',
                    fontFamily: 'Archivo Black',
                    fontSize: '15px',
                    fontWeight: 400,
                  },
                  '.ant-tabs-tab p': {
                    color: '#fff !important',
                    fontFamily: 'Archivo Black',
                    fontSize: '15px',
                    fontWeight: 400,
                  },
                }}
              >
                <Tabs
                  className="w-full"
                  defaultActiveKey={tabActive}
                  type="card"
                  style={{ marginBottom: 32 }}
                  items={dataTabs}
                  onChange={(e) => setTabActive(e)}
                />
              </Box>
            </Box>
            <Box className="pb-5 block xl:hidden mx-5 md:mx-16  xl:mx-20 xxl:mx-32">
              <Typography
                sx={{
                  fontFamily: 'Archivo Black',
                  fontSize: { xs: 14, sm: 18, md: 28 },

                  fontWeight: 400,
                  textAlign: 'center',
                  marginBottom: 3,
                }}
              >
                Sign up for free. Your free plan includes:
              </Typography>
              <Box className="flex items-center justify-center gap-2 mb-3">
                <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />
                <Typography
                  sx={{
                    fontSize: { xs: 13, sm: 16, md: 20 },
                  }}
                >
                  Unlimited link clicks
                </Typography>
              </Box>
              <Box className="flex items-center flex-col md:flex-row justify-between gap-2">
                <Box className="flex items-center justify-center gap-2">
                  <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />
                  <Typography
                    sx={{
                      fontSize: { xs: 13, sm: 16, md: 20 },
                    }}
                  >
                    5 short links/month
                  </Typography>
                </Box>
                <Box className="flex items-center justify-center gap-2">
                  <Image src={'/check.svg'} width={20} height={20} alt="" preview={false} />
                  <Typography
                    sx={{
                      fontSize: { xs: 13, sm: 16, md: 20 },
                    }}
                  >
                    3 custom back-halves/month
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Col>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
