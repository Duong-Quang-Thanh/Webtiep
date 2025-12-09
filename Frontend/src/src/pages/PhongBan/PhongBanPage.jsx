import React, { useEffect, useState } from 'react';
import phongBanApi from '../../api/phongBanApi';
import { Briefcase, RefreshCw, Plus, Edit, Trash2 } from 'react-feather';

const Modal = ({ isOpen, onClose, title, children, onOk }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-enter overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium transition-colors">Hủy</button>
          <button onClick={onOk} className="btn-primary">Lưu</button>
        </div>
      </div>
    </div>
  );
};

const PhongBanPage = () => {
  // 1. KHAI BÁO STATE
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ ma_phong: '', ten_phong: '', nam_thanh_lap: '', trang_thai: 'HoatDong' });

  // 2. HÀM GỌI API LẤY DỮ LIỆU 
  const fetchPhongBan = async () => {
    setLoading(true);
    try {
      const res = await phongBanApi.getAll();
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      alert('Lỗi tải danh sách phòng ban');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPhongBan(); }, []);

  // 3. XỬ LÝ SỰ KIỆN LƯU (THÊM HOẶC SỬA) 
  const handleOk = async () => {
    try {
      if (!formData.ma_phong || !formData.ten_phong) {
        return alert("Vui lòng nhập đầy đủ thông tin");
      }
      if (formData.ma_phong.length !== 3) {
        return alert("Mã phòng phải đúng 3 ký tự");
      }

      setLoading(true);
      const payload = { ...formData, ma_phong: formData.ma_phong.toUpperCase() };

      if (editingRecord) {
        await phongBanApi.update(editingRecord.ma_phong, payload);
        alert('Cập nhật thành công!');
      } else {
        await phongBanApi.create(payload);
        alert('Thêm mới thành công!');
      }

      setIsModalOpen(false);
      setFormData({ ma_phong: '', ten_phong: '', nam_thanh_lap: '', trang_thai: 'HoatDong' });
      setEditingRecord(null);
      fetchPhongBan();
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi lưu dữ liệu';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. XỬ LÝ SỰ KIỆN XÓA 
  const handleDelete = async (ma_phong) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await phongBanApi.delete(ma_phong);
      alert('Xóa thành công!');
      fetchPhongBan();
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  // 5. CÁC HÀM TIỆN ÍCH CHO MODAL
  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({ ma_phong: '', ten_phong: '', nam_thanh_lap: '', trang_thai: 'HoatDong' });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setIsModalOpen(true);
  };

  // 7. GIAO DIỆN HIỂN THỊ 
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-primary" /> Quản Lý Phòng Ban
        </h2>
        <div className="flex gap-3">
          <button onClick={fetchPhongBan} className="px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Thêm mới
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-sm text-white uppercase bg-gradient-to-r from-blue-500 to-sky-400 border-b border-blue-600">
              <tr>
                <th className="px-6 py-4 font-bold w-[10%]">Mã</th>
                <th className="px-6 py-4 font-bold w-[30%]">Tên Phòng Ban</th>
                <th className="px-6 py-4 font-bold w-[15%] text-center">Năm TL</th>
                <th className="px-6 py-4 font-bold w-[15%] text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Đang tải...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                data.map((record) => (
                  <tr key={record.ma_phong} className="bg-white border-b border-gray-100 hover:bg-blue-100 transition-colors duration-200">
                    <td className="px-6 py-4 font-bold text-gray-900">{record.ma_phong}</td>
                    <td className="px-6 py-4">{record.ten_phong}</td>
                    <td className="px-6 py-4 text-center">{record.nam_thanh_lap}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${record.trang_thai === 'HoatDong'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {record.trang_thai === 'HoatDong' ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(record.ma_phong)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOk={handleOk}
        title={editingRecord ? "Sửa Phòng Ban" : "Thêm Phòng Ban"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã Phòng <span className="text-red-500">*</span> (3 ký tự)</label>
            <input
              type="text"
              disabled={!!editingRecord}
              maxLength={3}
              value={formData.ma_phong}
              onChange={(e) => setFormData({ ...formData, ma_phong: e.target.value.toUpperCase() })}
              className={`input-std uppercase ${editingRecord ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Phòng <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.ten_phong}
              onChange={(e) => setFormData({ ...formData, ten_phong: e.target.value })}
              className="input-std"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm TL</label>
              <input
                type="number"
                value={formData.nam_thanh_lap}
                onChange={(e) => setFormData({ ...formData, nam_thanh_lap: e.target.value })}
                className="input-std"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
              <select
                value={formData.trang_thai}
                onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                className="input-std"
              >
                <option value="HoatDong">Hoạt động</option>
                <option value="NgungHoatDong">Ngừng</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PhongBanPage;