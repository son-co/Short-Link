import React, { useState } from 'react';
import {
  DashboardOutlined,
  LinkOutlined,
  PieChartOutlined,
  QrcodeOutlined,
  SettingOutlined,
  CloseOutlined,
  MenuOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Image, Button, message } from 'antd';
import { Box, Typography } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import * as PATH from '@/routes/routesConfig';
import store from '@/state/store';
import { authActions } from '@/state/ducks/authUser';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
type LayoutProps = {
  children: React.ReactNode;
};

// Hàm tạo item cho menu
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// Cấu hình menu
const items: MenuItem[] = [
  getItem(<Link to={PATH.HOME_PATH}>Home</Link>, '1', <DashboardOutlined />),
  getItem(<Link to={PATH.LINKS_PAGE}>Links</Link>, '2', <LinkOutlined />),
  // getItem('Qr Codes', '3', <QrcodeOutlined />),
  getItem(<Link to={PATH.ANALYTICS_PAGE}>Analytics</Link>, '3', <PieChartOutlined />),
  getItem('Settings', '4', <SettingOutlined />),
];

const selectedMenus = () => {
  switch (location.pathname) {
    case PATH.DASHBOARD_PATH:
      return '1';
    case PATH.LINKS_PAGE:
    case PATH.ADD_LINKS_PAGE:
    case PATH.VIEW_LINKS_PAGE:
      return '2';
    case PATH.ANALYTICS_PAGE:
      return '4';
    // case PATH.ADMIN_PRODUCTS_PATH:
    //   return '3';
    default:
      return '1';
  }
};

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      className="relative"
      sx={{
        '.ant-layout-sider-trigger': {
          background: '#28413e',
          borderTop: '1px solid #000',
        },
      }}
    >
      <Layout className="min-h-screen max-w-full">
        {/* Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className={`bg-[#28413e] fixed z-50 h-screen ${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:block`}
          style={{
            width: collapsed ? 80 : 200,
          }}
        >
          {/* Close Button for Mobile */}
          <Box className="flex justify-end md:hidden p-4">
            <CloseOutlined
              className="text-white text-2xl cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
          </Box>

          {/* Logo */}
          <Box className="flex justify-center items-center h-16 bg-[#28413e]">
            {/* <Typography
              fontSize={35}
              fontWeight={700}
              sx={{
                fontFamily: 'Lateef',
                color: '#89de2b',
              }}
            >
              LOGO
            </Typography> */}
            <Image src={'/logo.svg'} width={120} preview={false} />
          </Box>

          {/* Menu */}
          <Box
            sx={{
              '.ant-menu-item ,.ant-menu-title-content, .ant-menu-item:hover .ant-menu-item-icon': {
                color: '#fff',
                fontWeight: 'bold',
              },
              '.ant-menu-item.ant-menu-item-selected': {
                color: '#fff',
                fontWeight: 'bold',
                bgcolor: '#22a595',
              },
            }}
          >
            <Menu
              defaultSelectedKeys={[selectedMenus()]}
              mode="inline"
              items={items}
              style={{
                background: '#28413e',
                color: '#fff',
              }}
              theme="dark"
            />
          </Box>
        </Sider>

        {/* Main Layout */}
        <Layout
          className={`transition-all ${isMobileMenuOpen ? 'blur-sm pointer-events-none' : ''}`}
        >
          {/* Header */}
          <Header
            className={`fixed top-0 left-0 right-0 bg-[#28413e] z-40 px-4 flex items-center justify-between md:justify-end ${
              isMobileMenuOpen ? '' : collapsed ? 'md:pl-[80px]' : 'md:pl-[200px]'
            }`}
            style={{ height: 64 }}
          >
            {/* Menu Button for Mobile */}
            <MenuOutlined
              className="text-[#4e556d] text-2xl cursor-pointer md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            />

            <Button
              type="text"
              className="text-white text-lg md:ml-4 hover:!text-white"
              onClick={() => {
                store.dispatch(authActions.logout());
                message.success(`Logout successfully!`);
                navigate(PATH.LOGIN_PATH);
              }}
            >
              <LogoutOutlined /> Logout
            </Button>
          </Header>

          {/* Content */}
          <Content
            className={`w-full h-full pt-16 px-4 transition-all ${
              isMobileMenuOpen ? '' : collapsed ? 'md:pl-[80px]' : 'md:pl-[200px]'
            }`}
            style={{
              backgroundColor: '#f0f2f5',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Box>
  );
};

export default MainLayout;
