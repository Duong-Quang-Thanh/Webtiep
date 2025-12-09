import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, Briefcase, Users, FileText, Calendar, Gift, DollarSign, BarChart2, 
  Settings, Shield, Activity, Grid, CheckSquare, MessageSquare, LogOut 
} from 'react-feather';

const Logo = () => {
  return (
    <div className="flex items-center justify-center relative z-20">
      <div className="border border-cyan-400 rounded px-4 py-1 shadow-[0_0_8px_rgba(34,211,238,0.25)] bg-cyan-500/5">
        <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap uppercase">
          Management System
        </span>
      </div>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center relative z-20">
      <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        MS
      </span>
    </div>
  );
};

const AppSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role;

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

  const menuConfig = [
    // 1. CHUNG
    { key: '/', icon: <Home size={20} />, label: 'Trang chủ' },
    
    // 2. QUẢN LÝ TỔ CHỨC
    ...(role === 'admin' || role === 'hr' ? [
      { type: 'divider', label: 'Tổ chức' },
      { key: '/phong-ban', icon: <Briefcase size={20} />, label: 'Phòng Ban' },
      { key: '/chuc-vu', icon: <Shield size={20} />, label: 'Chức Vụ' },
      { key: '/nhan-vien', icon: <Users size={20} />, label: 'Nhân Viên' },
    ] : []),

    // 3. NGHIỆP VỤ KHÁC
    ...(role === 'admin' || role === 'hr' ? [
      { type: 'divider', label: 'Nghiệp vụ' },
      { key: '/danh-sach-cham-cong', icon: <CheckSquare size={20} />, label: 'Danh Sách Chấm Công' },
      { key: '/nghi-phep', icon: <Calendar size={20} />, label: 'Nghỉ phép' },
      { key: '/thuong-phat', icon: <Gift size={20} />, label: 'Thưởng / Phạt' },
    ] : []),

    // 4. QUẢN LÝ LƯƠNG
    ...(role === 'admin' || role === 'hr' ? [
      { type: 'divider', label: 'Lương & Thưởng' },
      { key: '/tinh-luong', icon: <DollarSign size={20} />, label: 'Tính Lương' },
      { key: '/bao-cao', icon: <BarChart2 size={20} />, label: 'Thu Nhập' },
    ] : []),

    // 5. HỆ THỐNG
    ...(role === 'admin' ? [
      { type: 'divider', label: 'Hệ thống' },
      { key: '/tai-khoan', icon: <Users size={20} />, label: 'Tài Khoản' },
      { key: '/cai-dat', icon: <Settings size={20} />, label: 'Cấu Hình' },
      { key: '/nhat-ky', icon: <Activity size={20} />, label: 'Nhật Ký' },
    ] : []),

    // 6. NHÂN VIÊN
    ...(role === 'nhanvien' ? [
      { type: 'divider', label: 'Cá nhân' },
      { key: '/bao-cao', icon: <DollarSign size={20} />, label: 'Phiếu Lương' },
      { key: '/thuong-phat', icon: <Gift size={20} />, label: 'Thưởng / Phạt' },
      { key: '/khao-sat', icon: <MessageSquare size={20} />, label: 'Phản Hồi' },
      { key: '/tien-ich', icon: <Grid size={20} />, label: 'Tiện Ích' },
      { key: '/cham-cong', icon: <CheckSquare size={20} />, label: 'Chấm công' },
    ] : []),
  ];

  return (
    <aside 
      onMouseEnter={() => setCollapsed(false)} 
      onMouseLeave={() => setCollapsed(true)}
      className={`
        bg-slate-900 border-r border-slate-800 text-white
        flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out shadow-xl
        ${collapsed ? 'w-[70px]' : 'w-[260px]'}
      `}
    >
      {/* 1. HEADER (Logo) */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-800 shrink-0 overflow-hidden bg-slate-900">
         {collapsed ? <LogoIcon /> : <Logo />}
      </div>

      {/* 2. BODY (Menu List) */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar flex flex-col gap-1">
        {menuConfig.map((item, index) => {
          if (item.type === 'divider') {
            if (collapsed) return <div key={index} className="h-px bg-slate-800 my-2 mx-2"></div>;
            return (
              <div key={index} className="px-2 mt-5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {item.label}
              </div>
            );
          }

          const isActive = location.pathname === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group w-full relative overflow-hidden
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                }
                ${collapsed ? 'justify-center' : 'justify-start'}
              `}
              title={collapsed ? item.label : ''}
            >
              <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              
              <span className={`
                 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 origin-left
                 ${collapsed ? 'w-0 opacity-0 translate-x-[-10px]' : 'w-auto opacity-100 translate-x-0'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 3. FOOTER (User + Logout Integrated) */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className={`
            flex items-center gap-3 transition-all duration-300
            ${collapsed ? 'justify-center' : 'justify-between'} 
        `}>
          
          {/* Group: Avatar + Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar */}
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center text-sm font-bold shadow-md cursor-default">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Info (Ẩn khi collapsed) */}
            <div className={`
                flex flex-col transition-all duration-300
                ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
            `}>
              <span className="text-sm font-semibold text-white truncate max-w-[100px]" title={user?.username}>
                {user?.username || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold truncate">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>

          {/* Nút Đăng Xuất (Chỉ hiện khi Expanded) */}
          <button 
            onClick={handleLogout}
            className={`
              p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200
              ${collapsed ? 'hidden' : 'block'} 
            `}
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>

        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;