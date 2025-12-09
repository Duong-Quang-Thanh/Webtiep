import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import dayjs from 'dayjs';
import { Calendar } from 'react-feather';
import chamCongApi from '../../../../api/chamCongApi'; 

const ATTENDANCE_COLORS = {
  'DungGio': '#10b981',
  'DiMuon': '#f59e0b',
  'VeSom': '#f97316',
  'VangMat': '#ef4444',
  'LamThemGio': '#3b82f6',
  'NghiPhep': '#a855f7'
};

const ATTENDANCE_LABELS = {
  'DungGio': 'Đúng giờ',
  'DiMuon': 'Đi muộn',
  'VeSom': 'Về sớm',
  'VangMat': 'Vắng mặt',
  'LamThemGio': 'Làm thêm giờ',
  'NghiPhep': 'Nghỉ phép'
};

const AttendanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [statsDetail, setStatsDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [thang, setThang] = useState(dayjs().month() + 1);
  const [nam, setNam] = useState(dayjs().year());
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Lấy danh sách chấm công
        const data = await chamCongApi.getDanhSach({ thang, nam });
        
        // Tính toán thống kê
        const stats = {
          DungGio: 0,
          DiMuon: 0,
          VeSom: 0,
          VangMat: 0,
          LamThemGio: 0,
          NghiPhep: 0,
        };

        if (Array.isArray(data)) {
          data.forEach((item) => {
            const status = item.trang_thai_ca || 'VangMat';
            if (status in stats) {
              stats[status]++;
            }
          });
        }

        setStatsDetail(stats);

        // Xử lý dữ liệu cho biểu đồ
        const processedData = Object.keys(stats)
          .filter(key => stats[key] > 0)
          .map(key => ({
            name: ATTENDANCE_LABELS[key],
            value: stats[key],
            fill: ATTENDANCE_COLORS[key]
          }));

        setChartData(processedData);
      } catch (err) { 
        console.error('Lỗi tải thống kê chuyên cần:', err);
        setChartData([]); 
      } finally { 
        setLoading(false); 
      }
    };
    loadStats();
  }, [thang, nam]);

  return (
    <div className="card-custom h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={18} className="text-primary"/> Thống Kê Chuyên Cần T{thang}/{nam}
        </h3>
        <div className="flex gap-2">
            <select value={thang} onChange={(e) => setThang(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5">
                {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
            </select>
            <select value={nam} onChange={(e) => setNam(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5">
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button 
              onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
            >
              {chartType === 'bar' ? 'Biểu đồ tròn' : 'Biểu đồ cột'}
            </button>
        </div>
      </div>

      {/* Thống kê chi tiết */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.keys(ATTENDANCE_LABELS).map(key => (
          <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{color: ATTENDANCE_COLORS[key]}}>{statsDetail[key] || 0}</div>
            <div className="text-xs text-gray-600 mt-1">{ATTENDANCE_LABELS[key]}</div>
          </div>
        ))}
      </div>

      <div className="flex-grow min-h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">Đang tải...</div> 
        ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                  <Bar dataKey="value" name="Số lượt" maxBarSize={120} radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}`} />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">Chưa có dữ liệu</div>
          )}
      </div>
    </div>
  );
};

export default AttendanceChart;