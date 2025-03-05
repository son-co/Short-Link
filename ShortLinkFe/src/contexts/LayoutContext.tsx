import { createContext, useContext, useState } from 'react';
import React from 'react';

// Định nghĩa kiểu dữ liệu cho context
interface LayoutContextType {
  showNavbar: boolean;
  setShowNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

// Giá trị mặc định cho context
const defaultValue: LayoutContextType = {
  showNavbar: true,
  setShowNavbar: () => {}, // Dummy function (không làm gì)
};

// Tạo context với giá trị mặc định
const LayoutContext = createContext<LayoutContextType>(defaultValue);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <LayoutContext.Provider value={{ showNavbar, setShowNavbar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
