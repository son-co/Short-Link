import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Image } from 'antd';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        className="mx-5 md:mx-12 xl:mx-20 xxl:mx-32 flex justify-between items-center md:flex"
        sx={{ display: { xs: 'none', lg: 'flex' } }}
      >
        <Box>
          {/* <Typography
            fontSize={80}
            fontWeight={700}
            sx={{
              fontFamily: 'Lateef',
              color: '#89de2b',
            }}
          >
            LOGO
          </Typography> */}
          <Image src={'/logo.svg'} preview={false} />
        </Box>
        <Box className="flex gap-5 xl:gap-10">
          <Typography
            className="hover:text-[#EF4C27] cursor-pointer"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}
          >
            Platform
          </Typography>
          <Typography
            className="hover:text-[#EF4C27] cursor-pointer"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}
          >
            Solutions
          </Typography>
          <Typography
            className="hover:text-[#EF4C27] cursor-pointer"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}
          >
            Resources
          </Typography>
        </Box>
        <Box className="flex gap-10 cursor-pointer items-center">
          <Link to="/login" className="hover:text-[#EF4C27]">
            <Typography sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}>
              Login
            </Typography>
          </Link>
          <Box className="border-2 rounded-xl px-4 py-2 hover:bg-white hover:text-black">
            <Typography sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}>
              Get a Quote
            </Typography>
          </Box>
          <Box className="border-2 rounded-xl bg-white px-4 py-2 text-black hover:bg-black hover:text-white hover:border-2">
            <Typography sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400 }}>
              Sign up free
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Mobile Header */}
      <Box
        className="flex items-center justify-between px-5 py-3 md:hidden"
        sx={{ display: { xs: 'flex', lg: 'none' } }}
      >
        {/* <Typography fontSize={40} fontWeight={700} sx={{ fontFamily: 'Lateef', color: '#89de2b' }}>
          LOGO
        </Typography> */}
        <Image src={'/logo.svg'} width={120} preview={false} />

        <Box className="text-white cursor-pointer" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Box>
      </Box>

      {/* Sidebar */}
      {isSidebarOpen && (
        <Box className="fixed top-0 left-0 w-2/3 h-full bg-white shadow-lg z-50 flex flex-col px-5 py-3 gap-5">
          <Box className="flex justify-between items-center">
            {/* <Typography
              fontSize={40}
              fontWeight={700}
              sx={{ fontFamily: 'Lateef', color: '#89de2b' }}
            >
              LOGO
            </Typography> */}
            <Image src={'/logo.svg'} width={120} preview={false} />

            <Box className="text-black cursor-pointer" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Box>
          </Box>
          <Typography
            className="cursor-pointer hover:text-[#EF4C27]"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
          >
            Platform
          </Typography>
          <Typography
            className="cursor-pointer hover:text-[#EF4C27]"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
          >
            Solutions
          </Typography>
          <Typography
            className="cursor-pointer hover:text-[#EF4C27]"
            sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
          >
            Resources
          </Typography>
          <Link to="/login">
            <Typography
              className="cursor-pointer hover:text-[#EF4C27]"
              sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
            >
              Login
            </Typography>
          </Link>
          <Link to="#">
            <Typography
              className="cursor-pointer hover:text-[#EF4C27]"
              sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
            >
              Get a Quote
            </Typography>
          </Link>

          <Link to="/login">
            <Typography
              className="cursor-pointer hover:text-[#EF4C27]"
              sx={{ fontFamily: 'Archivo Black', fontSize: 16, fontWeight: 400, color: '#000' }}
            >
              Sign up free
            </Typography>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default Header;
