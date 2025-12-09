import React, { useEffect, useState } from "react";
import chamCongApi from "../../api/chamCongApi";
import nhanVienApi from "../../api/nhanVienApi";
import dayjs from "dayjs";

const ChamCongPage = () => {
  const [listChamCong, setListChamCong] = useState([]);
  const [nhanVienList, setNhanVienList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    ma_nhan_vien: "",
    ngay_lam: dayjs().format("YYYY-MM-DD"),
    gio_vao: "",
    gio_ra: "",
  });

  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // ---------------- LOAD NHÂN VIÊN ----------------
  const loadNhanVien = async () => {
    if (role === "NHAN_VIEN") {
      setNhanVienList([{ ma_nhan_vien: userId, ten_nhan_vien: "Bạn" }]);
      setForm((f) => ({ ...f, ma_nhan_vien: userId }));
      return;
    }
    try {
      const data = await nhanVienApi.getAll();
      setNhanVienList(data);
    } catch {
      alert("Lỗi tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    loadNhanVien();
  }, []);

  // ---------------- LOAD LỊCH SỬ ----------------
  const loadHistory = async (ma_nv) => {
    if (!ma_nv) return;

    setLoading(true);
    try {
      const res = await chamCongApi.getByNhanVien(
        ma_nv,
        selectedMonth,
        selectedYear
      );

      const rows = res.map((item) => {
        const nv = nhanVienList.find(
          (n) => n.ma_nhan_vien === item.ma_nhan_vien
        );
        return { ...item, ten_nhan_vien: nv?.ten_nhan_vien ?? "N/A" };
      });

      setListChamCong(rows);
    } catch {
      setListChamCong([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi danh sách nhân viên load xong → load lịch sử
  useEffect(() => {
    if (!form.ma_nhan_vien) return;
    loadHistory(form.ma_nhan_vien);
  }, [nhanVienList, selectedMonth, selectedYear]);

  // ---------------- ACTIONS ----------------

  const handleCheckIn = async () => {
    if (!form.ma_nhan_vien) return alert("Chọn nhân viên!");

    try {
      await chamCongApi.checkIn({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam,
        gio_vao: form.gio_vao || dayjs().format("HH:mm:ss"),
      });
      alert("Check-in thành công");
      loadHistory(form.ma_nhan_vien);
    } catch {
      alert("Lỗi check-in");
    }
  };

  const handleCheckOut = async () => {
    if (!form.ma_nhan_vien) return alert("Chọn nhân viên!");

    try {
      await chamCongApi.checkOut({
        ma_nhan_vien: form.ma_nhan_vien,
        ngay_lam: form.ngay_lam,
        gio_ra: form.gio_ra || dayjs().format("HH:mm:ss"),
      });
      alert("Check-out thành công");
      loadHistory(form.ma_nhan_vien);
    } catch {
      alert("Lỗi check-out");
    }
  };

  const handleFull = async () => {
    if (!form.ma_nhan_vien || !form.gio_vao || !form.gio_ra)
      return alert("Điền đầy đủ!");

    try {
      await chamCongApi.createFull(form);
      alert("Ghi Full thành công!");
      loadHistory(form.ma_nhan_vien);
    } catch {
      alert("Lỗi ghi full");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📝 Quản lý Chấm Công</h2>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Chấm công mới</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {(role === "HR" || role === "ADMIN") && (
            <select
              className="p-2 border rounded-lg"
              value={form.ma_nhan_vien}
              onChange={(e) => {
                setForm({ ...form, ma_nhan_vien: e.target.value });
                loadHistory(e.target.value);
              }}
            >
              <option value="">Chọn nhân viên</option>
              {nhanVienList.map((nv) => (
                <option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                  {nv.ten_nhan_vien}
                </option>
              ))}
            </select>
          )}

          <input
            type="month"
            className="p-2 border rounded-lg"
            value={`${selectedYear}-${String(selectedMonth).padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              setSelectedYear(+y);
              setSelectedMonth(+m);
            }}
          />

          <input
            type="date"
            className="p-2 border rounded-lg"
            value={form.ngay_lam}
            onChange={(e) =>
              setForm({ ...form, ngay_lam: e.target.value })
            }
          />

          <input
            type="time"
            placeholder="Giờ vào"
            className="p-2 border rounded-lg"
            value={form.gio_vao}
            onChange={(e) => setForm({ ...form, gio_vao: e.target.value })}
          />

          <input
            type="time"
            placeholder="Giờ ra"
            className="p-2 border rounded-lg"
            value={form.gio_ra}
            onChange={(e) => setForm({ ...form, gio_ra: e.target.value })}
          />
        </div>

        <div className="flex gap-3 mt-4">
          {(role === "HR" || role === "ADMIN") && (
            <button
              onClick={handleFull}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ghi Full
            </button>
          )}

          <button
            onClick={handleCheckIn}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Check-in
          </button>

          <button
            onClick={handleCheckOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Check-out
          </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">
          Danh sách chấm công — {selectedMonth}/{selectedYear}
        </h3>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Nhân viên</th>
              <th className="p-3 border">Ngày</th>
              <th className="p-3 border">Giờ vào</th>
              <th className="p-3 border">Giờ ra</th>
              <th className="p-3 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : listChamCong.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              listChamCong.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.ten_nhan_vien}</td>
                  <td className="p-3">{item.ngay_lam}</td>
                  <td className="p-3">{item.gio_vao}</td>
                  <td className="p-3">{item.gio_ra}</td>
                  <td className="p-3">{item.trang_thai_ca}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChamCongPage;