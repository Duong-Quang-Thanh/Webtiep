import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import dayjs from 'dayjs';
import { Calendar } from 'react-feather';
import chamCongApi from '../../../../api/chamCongApi'; 

const ATTENDANCE_COLORS = {
  'Đúng giờ': '#52c41a', 'Đi muộn': '#faad14', 'Về sớm': '#ff4d4f', 'Vắng phép': '#722ed1'
};

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thang, setThang] = useState(dayjs().month() + 1);
  const [nam, setNam] = useState(dayjs().year());

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await chamCongApi.getThongKeBieuDo(thang, nam);
        const processedData = [];
        if (data) {
            if (data.DungGio > 0) processedData.push({ name: 'Đúng giờ', value: data.DungGio, fill: ATTENDANCE_COLORS['Đúng giờ'] });
            if (data.DiMuon > 0) processedData.push({ name: 'Đi muộn', value: data.DiMuon, fill: ATTENDANCE_COLORS['Đi muộn'] });
            if (data.VeSom > 0) processedData.push({ name: 'Về sớm', value: data.VeSom, fill: ATTENDANCE_COLORS['Về sớm'] });
            if (data.NghiPhep > 0) processedData.push({ name: 'Vắng phép', value: data.NghiPhep, fill: ATTENDANCE_COLORS['Vắng phép'] });
        }
        setChartData(processedData);
      } catch (err) { setChartData([]); } finally { setLoading(false); }
    };
    loadStats();
  }, [thang, nam]);

  return (
    <div className="card-custom h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={18} className="text-primary"/> Chuyên Cần T{thang}/{nam}
        </h3>
        <div className="flex gap-2">
            <select value={thang} onChange={(e) => setThang(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5">
                {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
            </select>
            <select value={nam} onChange={(e) => setNam(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5">
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>
      </div>
      <div className="flex-grow min-h-[300px]">
        {loading ? <div className="h-full flex items-center justify-center text-gray-400">Đang tải...</div> : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                <Bar dataKey="value" name="Số lượt" maxBarSize={120} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">Chưa có dữ liệu</div>
          )}
      </div>
    </div>
  );
};

export default AttendanceChart;