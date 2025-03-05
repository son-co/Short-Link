import { createContext, useContext, useState, ReactNode } from 'react';
import React from 'react';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Có thể thay 'any' bằng kiểu người dùng của bạn nếu có
  login: (userData: any) => void; // Chỉnh sửa loại tham số của `login` theo yêu cầu
  logout: () => void;
}

// Cung cấp giá trị mặc định cho context
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
};

// Tạo AuthContext với giá trị mặc định
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
