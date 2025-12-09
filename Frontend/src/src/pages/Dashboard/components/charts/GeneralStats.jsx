import React from 'react';
import { Users, Briefcase, Layers, DollarSign } from 'react-feather';

const StatCard = ({ title, value, icon, color, suffix, isCurrency }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
          <span className="font-semibold text-gray-500 text-sm uppercase tracking-wider">{title}</span>
          <span style={{ color: color }} className="opacity-80">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-800" style={{ color: color }}>
            {isCurrency 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
              : value}
          </span>
          {suffix && <span className="text-gray-400 text-sm font-medium">{suffix}</span>}
      </div>
  </div>
);

const GeneralStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="Tổng Nhân Viên" value={stats.totalNhanVien} icon={<Users size={24}/>} color="#3f8600" suffix="người" />
      <StatCard title="Tổng Phòng Ban" value={stats.totalPhongBan} icon={<Briefcase size={24}/>} color="#1890ff" suffix="phòng" />
      <StatCard title="Tổng Chức Vụ" value={stats.totalChucVu} icon={<Layers size={24}/>} color="#722ed1" suffix="vị trí" />
      <StatCard title="Quỹ Lương Tháng" value={stats.totalSalary} icon={<DollarSign size={24}/>} color="#cf1322" isCurrency={true} />
    </div>
  );
};

export default GeneralStats;