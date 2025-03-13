import { Box, Typography } from '@mui/material';
import { Button, Col, Divider, Form, Input, Row, Image, message } from 'antd';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import { getDataUrl } from '@/state/ducks/appData/selectors';
import { RESET_DATA_URL, RESET_DATA_URL_DETAIL } from '@/state/ducks/appData/types';
import { AuthService } from './AuthenticationService';

const AuthPage = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({ username: 'admin@gmail.com', password: 'telcosmsAdmin@123' });
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await AuthService.authenticate({
        username: values.username,
        password: values.password,
      });

      dispatch({ type: 'authUser/LOGIN', payload: response });

      if (Object?.keys(props.getDataUrl).length > 0) {
        await AuthService.createShortLink(props.getDataUrl);
        dispatch({ type: RESET_DATA_URL });
        dispatch({ type: RESET_DATA_URL_DETAIL });
      }

      message.success('Login Successfully');
      navigate(PATH.HOME_PATH);
    } catch (error: any) {
      console.log('son', error);

      message.error(error.message);
    }
  };

  return (
    <Box
      className="w-screen bg-[#28413e]"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: '20px',
        }}
      >
        <Col
          xs={24}
          lg={13}
          className="w-full"
          style={{
            display: 'flex',
            flexDirection: 'column',
            // height: '100%',
          }}
        >
          <Box
            className="w-full bg-[#fff] flex-col flex justify-center items-center"
            sx={{
              height: '100%',
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 80,
            }}
          >
            <Box className="w-full flex justify-center">
              {/* <Typography
                fontSize={80}
                sx={{
                  fontFamily: 'Lateef',
                  color: '#89DE2B',
                }}
              >
                LOGO
              </Typography> */}
              <Image src={'/logo.svg'} preview={false} />
            </Box>
            <Box className=" flex justify-center max-w-[370px] mx-4">
              <Form form={form} className="w-full" onFinish={onFinish}>
                <Box>
                  <Typography
                    fontSize={14}
                    sx={{
                      fontFamily: 'Archivo Black',
                    }}
                  >
                    Email
                  </Typography>
                  <Form.Item name="username" rules={[{ required: true, message: '密码' }]}>
                    <Input className="rounded" />
                  </Form.Item>
                </Box>

                <Box className="mt-5">
                  <Typography
                    fontSize={14}
                    sx={{
                      fontFamily: 'Archivo Black',
                    }}
                  >
                    Password
                  </Typography>
                  <Form.Item name="password" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input className="rounded" />
                  </Form.Item>
                  <Box className="flex justify-end items-center mt-2">
                    <Typography
                      className="cursor-pointer"
                      fontSize={12}
                      sx={{
                        fontFamily: 'Archivo Black',
                        color: '#EF4C27',
                      }}
                    >
                      Forgot your password?
                    </Typography>
                  </Box>
                </Box>
                <Button type="primary" htmlType="submit" className="bg-[#89DE2B] w-full mt-5">
                  Login
                </Button>
                <Box className="mt-2 mb-20">
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    sx={{
                      fontFamily: 'Archivo Black',
                    }}
                  >
                    By logging in with an account, you agree to Bitly's Terms of Service, Privacy
                    Policy and Acceptable Use Policy.
                  </Typography>
                </Box>
              </Form>
            </Box>
          </Box>
        </Col>
        <Col xs={24} lg={11} className="flex justify-center items-center px-3 lg:px-0 lg:pr-5">
          <Box className="flex flex-col items-center gap-5">
            <Typography
              fontSize={20}
              sx={{
                fontFamily: 'Archivo Black',
                color: '#EF4C27',
                textAlign: 'center',
              }}
            >
              Shorten your links in just 1 minute!
            </Typography>

            <Typography
              fontSize={18}
              fontWeight={800}
              sx={{
                fontFamily: 'Nunito',
                color: '#fff',
                textAlign: 'center',
              }}
            >
              Sign up now to use our free link shortening service. Share your links easily and
              quickly!
            </Typography>
            <Box
              className="p-3 cursor-pointer border rounded-md bg-transparent inline-flex gap-2 items-center"
              onClick={() => form.submit()}
            >
              <Typography
                fontSize={15}
                fontWeight={400}
                className="text-white"
                sx={{
                  fontFamily: 'Archivo Black',
                }}
              >
                Create free account
              </Typography>
              <Image src="/right.svg" preview={false} width={15} height={15} alt="" />
            </Box>
          </Box>
        </Col>
      </Box>
      <Box
        className="px-5 md:px-10 lg:px-20"
        sx={{
          '.ant-divider': {
            border: '1px solid #EF4C27',
          },
        }}
      >
        <Divider />
        <Box className="w-full flex justify-start">
          {/* <Typography
            fontSize={80}
            sx={{
              fontFamily: 'Lateef',
              color: '#89DE2B',
              fontSize: { xs: 50, sm: 65, md: 80 },
            }}
          >
            LOGO
          </Typography> */}
          <Image src={'/logo.svg'} width={120} preview={false} />
        </Box>
      </Box>
    </Box>
  );
};

export default connect((state: any) => ({
  getDataUrl: getDataUrl(state),
}))(AuthPage);
