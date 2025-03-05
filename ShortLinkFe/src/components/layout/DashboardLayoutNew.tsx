import { Box } from '@mui/material';
import React from 'react';

type LayputProps = {
  children: React.ReactNode;
};

const DashboardLayoutNew: React.FC<LayputProps> = ({ children }) => {
  return <Box className="min-h-screen min-w-screen bg-[#050d10] ">{children}</Box>;
};

export default DashboardLayoutNew;
