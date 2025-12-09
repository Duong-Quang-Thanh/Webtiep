import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Plus, Edit, Trash2 } from 'react-feather';
import chucVuApi from '../../api/chucVuApi';

const TailwindModal = ({ isOpen, onClose, title, children, onOk }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-enter overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 font-medium transition-colors">Hủy</button>
          <button onClick={onOk} className="btn-primary">Lưu</button>
        </div>
      </div>
    </div>
  );
};

const ChucVuPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({ ma_chuc_vu: '', ten_chuc_vu: '' });

  const fetchChucVu = async () => {
    setLoading(true);
    try {
      const res = await chucVuApi.getAll();
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      alert('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChucVu(); }, []);

  const handleOk = async () => {
    if (!formData.ma_chuc_vu || !formData.ten_chuc_vu) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ma_chuc_vu: formData.ma_chuc_vu.trim().toUpperCase(),
        ten_chuc_vu: formData.ten_chuc_vu
      };
      if (editingRecord) {
        await chucVuApi.update(editingRecord.ma_chuc_vu, payload);
        alert('Cập nhật thành công!');
      } else {
        await chucVuApi.create(payload);
        alert('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      setFormData({ ma_chuc_vu: '', ten_chuc_vu: '' });
      setEditingRecord(null);
      fetchChucVu();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await chucVuApi.delete(id);
      alert('Xóa thành công!');
      fetchChucVu();
    } catch (error) {
      alert('Không thể xóa chức vụ này');
    }
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({ ma_chuc_vu: '', ten_chuc_vu: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-primary" size={28} /> Quản Lý Chức Vụ
          </h2>
          <div className="flex gap-3">
            <button onClick={fetchChucVu} className="px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <RefreshCw size={16} /> Làm mới
            </button>
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
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
                  <th className="px-6 py-4 font-bold w-1/4">Mã</th>
                  <th className="px-6 py-4 font-bold">Tên Chức Vụ</th>
                  <th className="px-6 py-4 font-bold text-center w-1/4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" className="text-center py-8 text-gray-500">Đang tải...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-8 text-gray-500">Không có dữ liệu</td></tr>
                ) : (
                  data.map((record) => (
                    <tr key={record.ma_chuc_vu} className="bg-white border-b border-gray-100 hover:bg-blue-100 transition-colors duration-200">
                      <td className="px-6 py-4 text-gray-900 font-bold">{record.ma_chuc_vu}</td>
                      <td className="px-6 py-4">{record.ten_chuc_vu}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-4">
                          <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-800">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(record.ma_chuc_vu)} className="text-red-500 hover:text-red-700">
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

        {/* MODAL FORM */}
        <TailwindModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOk={handleOk}
          title={editingRecord ? "Sửa Chức Vụ" : "Thêm Chức Vụ"}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Chức Vụ <span className="text-red-500">*</span></label>
              <input
                type="text"
                disabled={!!editingRecord}
                maxLength={1}
                value={formData.ma_chuc_vu}
                onChange={(e) => setFormData({ ...formData, ma_chuc_vu: e.target.value.toUpperCase() })}
                className={`input-std uppercase ${editingRecord ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                placeholder="VD: A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Chức Vụ <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.ten_chuc_vu}
                onChange={(e) => setFormData({ ...formData, ten_chuc_vu: e.target.value })}
                className="input-std"
                placeholder="Nhập tên chức vụ"
              />
            </div>
          </div>
        </TailwindModal>

      </div>
    </div>
  );
};

export default ChucVuPage;
