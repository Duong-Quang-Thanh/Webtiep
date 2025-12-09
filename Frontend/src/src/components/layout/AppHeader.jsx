import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, LogOut, ChevronDown, User } from 'react-feather';

// Chú ý: Component này sẽ cần được thêm vào Layout chính của bạn,
// và nếu bạn muốn toggle Sidebar từ Header, bạn cần truyền prop setCollapsed.
const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm Đăng Xuất (Tích hợp logic xác nhận)
  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        try {
            if (logout) await logout();
            navigate('/login');
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(prev => !prev);
  };
  
  // Icon Avatar
  const Avatar = () => (
    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-md cursor-pointer">
        {user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
  );

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      
      {/* 1. Bên Trái (Tiêu đề hoặc tên Module) */}
      <div className="flex items-center">
        <span className="text-xl font-semibold text-gray-800"></span>
      </div>

      {/* 2. Bên Phải (Icons + User) */}
      <div className="flex items-center space-x-4">
        
        {/* Biểu tượng Thông báo */}
        <button 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
            title="Thông báo"
        >
          <Bell size={20} />
          {/* Badge thông báo mới (ví dụ) */}
          {/* Thay đổi số lượng thông báo thực tế ở đây */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Biểu tượng Cài đặt */}
        <button 
            onClick={() => navigate('/cai-dat')} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            title="Cấu hình hệ thống"
        >
          <Settings size={20} />
        </button>

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button 
            onClick={handleProfileClick} 
            className="flex items-center p-1 rounded-full hover:bg-gray-100 transition duration-150"
            title={user?.username || 'Profile'}
          >
            <Avatar />
            <ChevronDown size={16} className={`ml-1 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-40 border border-gray-100 origin-top-right animate-in fade-in zoom-in-95">
              
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-gray-800 truncate" title={user?.username}>
                    {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 uppercase">
                    {user?.role || 'Guest'}
                </p>
              </div>

              {/* Item Profile */}
              <button 
                onClick={() => {
                    navigate('/tai-khoan'); // Giả sử '/tai-khoan' là trang thông tin cá nhân
                    setIsDropdownOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={16} className="mr-2 text-blue-500" />
                Thông tin cá nhân
              </button>

              {/* Item Logout */}
              <button 
                onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t mt-1"
              >
                <LogOut size={16} className="mr-2" />
                Đăng xuất
              </button>
              
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default AppHeader;