import { handleApiWithOutToken } from '@/api';
import AInput from '@/views/presentations/AInput';
import { Box, Typography } from '@mui/material';
import { Button, Checkbox, Col, Form, message, Row, Space } from 'antd';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import { getDataUrl } from '@/state/ducks/appData/selectors';
import { getCookie } from '@/state/utils/session';
import { JWT } from '@/configs';
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
      // setLoading(true);

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
      navigate(PATH.LINKS_PAGE);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Box className="h-screen w-screen">
      <Box
        sx={{
          border: '2px solid #0984e3',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: '20px',
          padding: '0 0 0 40px',
          width: '700px',
          position: 'absolute',
          zIndex: 999,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxSizing: 'border-box',
          boxShadow: '0 0 10px #0003',
          backgroundColor: '#fff',
        }}
      >
        <Row className="w-full">
          <Col xs={14} className="py-10 pr-[40px]">
            <Typography
              className="text-black text-center w-full h-[100px]"
              fontWeight={700}
              fontSize={24}
            >
              用户登录
            </Typography>
            <Form form={form} className="mt-5" onFinish={onFinish}>
              <AInput
                className="mb-5"
                name="username"
                maxLength="20"
                addonBefore={<Typography>用户名</Typography>}
                addonBeforeWidth="80px"
                placeholder="请输入用户名"
                showCount={true}
                rules={[{ required: true, message: '请输入用户名' }]}
              />
              <AInput
                name="password"
                type="password"
                addonBefore={<Typography>密 码</Typography>}
                addonBeforeWidth="80px"
                placeholder="密码"
                rules={[{ required: true, message: '密码' }]}
              />
              <Box className="flex justify-between items-center mt-20">
                <Checkbox>记住密码</Checkbox>
                <Button color="primary" htmlType="submit">
                  登录
                </Button>
              </Box>
            </Form>
          </Col>
          <Col xs={10} className="bg-[#0e87de]">
            <Box className="h-full flex flex-col justify-center items-center gap-8">
              <Typography className="text-white">还没有账号？</Typography>
              <Typography className="text-white">欢迎注册账号！</Typography>
              <Button className="px-8">去注册</Button>
            </Box>
          </Col>
        </Row>
      </Box>
    </Box>
  );
};

export default connect((state: any) => ({
  getDataUrl: getDataUrl(state),
}))(AuthPage);
