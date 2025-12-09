import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'react-feather';

const SalaryChart = ({ data }) => {
  return (
    <div className="card-custom">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart2 size={20} className="text-primary"/> Phân Bổ Quỹ Lương Theo Phòng
      </h3>
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" interval={0} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false}/>
            <YAxis width={80} tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }}/>
            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} formatter={(value) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Quỹ lương']} />
            <Bar dataKey="quyLuong" fill="#52c41a" barSize={50} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryChart;