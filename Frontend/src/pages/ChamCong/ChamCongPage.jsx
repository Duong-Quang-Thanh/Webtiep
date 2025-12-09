import React, { useEffect, useState } from "react";
import chamCongApi from "../../api/chamCongApi";
import { useAuth } from "../../contexts/AuthContext";
import dayjs from "dayjs";
import { Clock, LogOut, Calendar } from "react-feather";

const ChamCongPage = () => {
  const { user } = useAuth();
  const [listChamCong, setListChamCong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const ma_nhan_vien = user?.ma_nhan_vien;

  // LOAD LỊCH SỬ CHẤM CÔNG TRONG THÁNG
  const loadHistory = async () => {
    if (!ma_nhan_vien) return;

    setLoading(true);
    try {
      const res = await chamCongApi.getByNhanVien(
        ma_nhan_vien,
        selectedMonth,
        selectedYear
      );
      setListChamCong(res || []);
    } catch (err) {
      console.error("Lỗi tải lịch sử chấm công:", err);
      setListChamCong([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [ma_nhan_vien, selectedMonth, selectedYear]);

  // CHECK-IN
  const handleCheckIn = async () => {
    if (!ma_nhan_vien) {
      alert("Lỗi: Không xác định được nhân viên!");
      return;
    }

    setChecking(true);
    try {
      await chamCongApi.checkIn({
        ma_nhan_vien: ma_nhan_vien,
      });
      alert("✅ Check-in thành công lúc " + dayjs().format("HH:mm:ss"));
      loadHistory();
    } catch (err) {
      alert("❌ Lỗi check-in: " + (err.response?.data?.message || err.message));
    } finally {
      setChecking(false);
    }
  };

  // CHECK-OUT
  const handleCheckOut = async () => {
    if (!ma_nhan_vien) {
      alert("Lỗi: Không xác định được nhân viên!");
      return;
    }

    setChecking(true);
    try {
      await chamCongApi.checkOut({
        ma_nhan_vien: ma_nhan_vien,
      });
      alert("✅ Check-out thành công lúc " + dayjs().format("HH:mm:ss"));
      loadHistory();
    } catch (err) {
      alert("❌ Lỗi check-out: " + (err.response?.data?.message || err.message));
    } finally {
      setChecking(false);
    }
  };

  // Tính thống kê
  const stats = {
    total: listChamCong.length,
    onTime: listChamCong.filter(cc => cc.trang_thai_ca === 'DungGio').length,
    late: listChamCong.filter(cc => cc.trang_thai_ca === 'DiMuon').length,
    early: listChamCong.filter(cc => cc.trang_thai_ca === 'VeSom').length,
    absent: listChamCong.filter(cc => cc.trang_thai_ca === 'VangMat').length,
  };

  // Kiểm tra nếu đã check-in hôm nay
  const today = dayjs().format('YYYY-MM-DD');
  const todayCheckIn = listChamCong.find(cc => dayjs(cc.ngay_lam).format('YYYY-MM-DD') === today);
  const hasCheckedInToday = !!todayCheckIn;
  const hasCheckedOutToday = hasCheckedInToday && !!todayCheckIn.gio_ra;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Calendar size={32} className="text-blue-600" />
        Chấm Công Nhân Viên
      </h2>

      {/* SECTION 1: CHECK-IN / CHECK-OUT BUTTONS */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
        <h3 className="text-2xl font-bold mb-6">🚀 Chấm Công Hôm Nay</h3>
        
        {/* Hiển thị trạng thái check-in hôm nay */}
        {hasCheckedInToday && (
          <div className="mb-4 p-4 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30">
            {hasCheckedOutToday ? (
              <p className="text-white font-semibold">✅ Bạn đã check-out hôm nay lúc {todayCheckIn.gio_ra}</p>
            ) : (
              <p className="text-white font-semibold">⏱️ Bạn đã check-in hôm nay lúc {todayCheckIn.gio_vao}. Vui lòng check-out khi kết thúc ca làm việc.</p>
            )}
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleCheckIn}
            disabled={checking || hasCheckedInToday}
            title={hasCheckedInToday ? "Bạn đã check-in hôm nay rồi" : "Click để check-in"}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition ${
              hasCheckedInToday 
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-50' 
                : 'bg-white text-blue-600 hover:shadow-lg'
            } disabled:opacity-50`}
          >
            <Clock size={24} />
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={checking || !hasCheckedInToday || hasCheckedOutToday}
            title={!hasCheckedInToday ? "Bạn chưa check-in hôm nay" : hasCheckedOutToday ? "Bạn đã check-out rồi" : "Click để check-out"}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition ${
              !hasCheckedInToday || hasCheckedOutToday
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                : 'bg-white text-cyan-600 hover:shadow-lg'
            } disabled:opacity-50`}
          >
            <LogOut size={24} />
            Check Out
          </button>
        </div>
      </div>

      {/* SECTION 2: FILTER + STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* THÁNG */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tháng</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* NĂM */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Năm</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
          >
            {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* STATS */}
        <div className="bg-green-100 p-3 rounded-lg text-center">
          <p className="text-gray-600 text-sm">Đúng giờ</p>
          <p className="text-2xl font-bold text-green-600">{stats.onTime}</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-lg text-center">
          <p className="text-gray-600 text-sm">Đi muộn</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
        </div>
        <div className="bg-red-100 p-3 rounded-lg text-center">
          <p className="text-gray-600 text-sm">Vắng</p>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </div>
      </div>

      {/* SECTION 3: LỊCH SỬ CHẤM CÔNG */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-bold">📋 Lịch Sử Chấm Công Tháng {selectedMonth}/{selectedYear}</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">Đang tải...</div>
        ) : listChamCong.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Không có dữ liệu chấm công</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Ngày</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Giờ Vào</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Giờ Ra</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Trạng Thái</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Giờ Làm</th>
                </tr>
              </thead>
              <tbody>
                {listChamCong.map((cc, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{dayjs(cc.ngay_lam).format('DD/MM/YYYY')}</td>
                    <td className="px-6 py-4 font-mono">{cc.gio_vao || '-'}</td>
                    <td className="px-6 py-4 font-mono">{cc.gio_ra || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold
                        ${cc.trang_thai_ca === 'DungGio' ? 'bg-green-500' : 
                          cc.trang_thai_ca === 'DiMuon' ? 'bg-yellow-500' : 
                          cc.trang_thai_ca === 'VeSom' ? 'bg-orange-500' :
                          cc.trang_thai_ca === 'VangMat' ? 'bg-red-500' :
                          'bg-gray-500'}
                      `}>
                        {cc.trang_thai_ca}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{cc.tong_gio_lam || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChamCongPage;
