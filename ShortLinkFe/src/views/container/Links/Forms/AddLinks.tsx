import { API_URL, JWT } from '@/configs';
import { getCookie } from '@/state/utils/session';
import { Box, Typography } from '@mui/material';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import { useDispatch } from 'react-redux';
import { SET_DATA_URL_DETAIL } from '@/state/ducks/appData/types';

const AddLinks = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [shortLink, setShortLink] = React.useState('');
  const [spin, setSpin] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const token = getCookie(JWT);
  const dispatch = useDispatch();

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
        dispatch({ type: SET_DATA_URL_DETAIL, payload: res });

        setShortLink(res?.data?.fullShortUrl);
        setIsClose(true);
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
    callApi(`${API_URL}/api/v1/admin/short-link/create`, body);
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
    <Box className="py-6 px-2 md:px-20 w-full h-full flex flex-col justify-between">
      <Box>
        <Box className="mb-5">
          <Typography
            sx={{
              fontFamily: 'Archivo Black',
              fontSize: 24,
              fontWeight: 400,
            }}
          >
            Create a link
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Archivo Black',
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            You can create <span style={{ color: '#89DE2B' }}>5</span> more links this month.{' '}
            <Link to="" style={{ color: '#89DE2B' }}>
               Upgrade for more.
            </Link>
          </Typography>
        </Box>
        <Card>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={8}>
              <Col xs={24} sm={14}>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  sx={{
                    fontFamily: 'Nunito',
                    color: '#000',
                  }}
                >
                  Destination
                </Typography>
                <Form.Item
                  name="originUrl"
                  rules={[
                    {
                      required: true,
                      message: "We'll need a valid URL, like 'super-long-link.com/shorten-it'",
                    },
                  ]}
                >
                  <Input
                    className="rounded-md border-2 py-2"
                    placeholder="http://example.com/your-long-url"
                  />
                </Form.Item>
              </Col>
              <Col xs={0} sm={1}></Col>
              <Col xs={24} sm={9}>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  sx={{
                    fontFamily: 'Nunito',
                    color: '#000',
                  }}
                >
                  Title
                </Typography>
                <Form.Item name="title">
                  <Input className="rounded-md border-2 py-2" />
                </Form.Item>
              </Col>
            </Row>
            <Box className="mb-5">
              <Typography
                sx={{
                  fontFamily: 'Archivo Black',
                  fontSize: 24,
                  fontWeight: 400,
                }}
              >
                Short Link
              </Typography>
            </Box>
            <Row gutter={8} className="items-center">
              <Col xs={24} sm={14}>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  sx={{
                    fontFamily: 'Nunito',
                    color: '#000',
                  }}
                >
                  Domain
                </Typography>
                <Form.Item name="domain">
                  <Input
                    className="rounded-md border-2 py-2"
                    disabled={true}
                    value={API_URL}
                    // defaultValue={API_URL}
                  />
                </Form.Item>
              </Col>
              <Col xs={0} sm={1}>
                /
              </Col>
              <Col xs={24} sm={9}>
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  sx={{
                    fontFamily: 'Nunito',
                    color: '#000',
                  }}
                >
                  Custom back-half (optional)
                </Typography>
                <Form.Item name="custom">
                  <Input className="rounded-md border-2 py-2" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Box>

      <Card className="px-10">
        <Box className="flex justify-between">
          <Button type="text" onClick={() => navigate(PATH.LINKS_PAGE)}>
            <Typography
              sx={{
                fontFamily: 'Archivo Black',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Cancel
            </Typography>
          </Button>
          <Button
            onClick={() => form.submit()}
            loading={spin}
            type="primary"
            style={{
              background: '#050D10',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Archivo Black',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Create your link
            </Typography>
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default AddLinks;
