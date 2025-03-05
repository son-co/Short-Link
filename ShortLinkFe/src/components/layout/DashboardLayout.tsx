import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

import * as PATH from '@/routes/routesConfig';

import { connect, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { Button, message, Popover } from 'antd';

type LayputProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayputProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-[#eef0f5] " sx={{ width: '100vw' }}>
      <Box
        sx={{ height: '54px' }}
        className="bg-black w-full flex justify-between items-center px-8"
      >
        <Typography className="text-white" fontWeight={700} fontSize={16}>
          拿个offer-SaaS短链接@马丁
        </Typography>
        <Box className="flex items-center gap-5">
          <Typography sx={{ color: '#ccc' }}>官方文档 </Typography>
          <Typography sx={{ color: '#ccc' }}>加沟通群 </Typography>
          <Typography sx={{ color: '#ccc' }}>🔥视频教程</Typography>
          <Typography sx={{ color: '#ccc' }}>演示环境</Typography>
          <Popover
            placement="bottomRight"
            title=""
            content={
              <>
                <Typography sx={{ color: '#000' }}>个人信息</Typography>
                <Typography sx={{ color: '#000' }}>
                  <Button
                    type="text"
                    onClick={() => {
                      dispatch({ type: 'authUser/LOGOUT' });
                      message.success('Logout successfully');
                      navigate(PATH.LOGIN_PATH);
                    }}
                  >
                    Logout
                  </Button>
                </Typography>
              </>
            }
          >
            <Typography sx={{ color: '#ccc' }}>admin</Typography>
          </Popover>
        </Box>
      </Box>
      <Box sx={{ height: 'calc(100vh - 54px)' }}>{children}</Box>
    </Box>
  );
};

export default connect((state: any) => ({}), {})(Layout);
