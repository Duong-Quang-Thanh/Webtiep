import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'react-feather';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#AF19FF', '#00C49F', '#FF4560'];

const StructureChart = ({ data }) => {
  return (
    <div className="card-custom h-full flex flex-col bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PieIcon size={20} className="text-blue-600"/> Cơ Cấu Nhân Sự
      </h3>
      
      <div className="flex-grow w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="45%"         
              outerRadius={105} 
              innerRadius={10}
              label={false}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
            />
            
            {/* 3. Cấu hình Legend nằm gọn ở dưới */}
            <Legend 
              verticalAlign="bottom" 
              align="center"
              height={80} 
              iconType="circle"
              wrapperStyle={{ 
                bottom: 0,
                fontSize: '15px', 
                width: '100%' 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StructureChart;