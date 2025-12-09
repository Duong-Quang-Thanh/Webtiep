import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient'; 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Khôi phục phiên khi F5
  useEffect(() => {
    const storedToken = localStorage.getItem('user_token');
    const storedUser = localStorage.getItem('user_info');
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user_token');
      }
    }
    setLoading(false);
  }, []);

  // 2. LOGIN 
  const login = async (username, password) => {
    try {
      // Gọi API xuống Backend
      const response = await axiosClient.post('/auth/login', {
        username,
        password
      });

      // Lấy token thật từ Backend 
      const { token, user } = response.data;

      // Lưu token 
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));
      setUser(user);

      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi đăng nhập";
      throw new Error(msg);
    }
  };

  // 3. Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);