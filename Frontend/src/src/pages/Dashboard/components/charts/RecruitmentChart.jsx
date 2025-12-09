import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { TrendingUp } from 'react-feather';

const RecruitmentChart = ({ data }) => {
  return (
    <div className="card-custom">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-primary"/> Xu Hướng Tuyển Dụng Năm {dayjs().year()}
      </h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTuyenMoi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Area type="monotone" dataKey="TuyenMoi" name="Nhân viên mới" stroke="#8884d8" fillOpacity={1} fill="url(#colorTuyenMoi)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecruitmentChart;