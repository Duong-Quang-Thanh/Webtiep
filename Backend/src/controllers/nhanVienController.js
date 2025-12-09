import * as nhanVienService from '../services/nhanVienService.js';

// ------------------- C (Create) -------------------
export const create = async (req, res) => {
  try {
    const newNhanVien = await nhanVienService.createNhanVien(req.body);
    res.status(201).send({ message: "Thêm nhân viên thành công!", data: newNhanVien });
  } catch (error) {
    res.status(500).send({ message: "Lỗi khi thêm nhân viên: " + error.message });
  }
};

// ------------------- R (Read All) -------------------
export const findAll = async (req, res) => {
    try {
        const nhanViens = await nhanVienService.getAllNhanVien();
        res.status(200).send({ message: "Lấy danh sách nhân viên thành công.", data: nhanViens });
    } catch (error) {
        res.status(500).send({ message: "Lỗi truy vấn: " + error.message });
    }
};

// ------------------- R (Read One) -------------------
export const findOne = async (req, res) => {
    try {
        const ma_nhan_vien = req.params.ma_nv;
        const nhanVien = await nhanVienService.getNhanVienById(ma_nhan_vien);

        if (!nhanVien) {
            return res.status(404).send({ message: `Không tìm thấy nhân viên mã ${ma_nhan_vien}.` });
        }
        res.status(200).send({ data: nhanVien });
    } catch (error) {
        res.status(500).send({ message: "Lỗi truy vấn: " + error.message });
    }
};

// ------------------- U (Update) -------------------
export const update = async (req, res) => {
    try {
        const ma_nhan_vien = req.params.ma_nv;
        const updatedRows = await nhanVienService.updateNhanVien(ma_nhan_vien, req.body);

        if (updatedRows === 0) {
            return res.status(404).send({ 
                message: `Không tìm thấy hoặc không có thay đổi cho nhân viên mã ${ma_nhan_vien}.` 
            });
        }
        res.status(200).send({ message: "Cập nhật nhân viên thành công." });
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật nhân viên: " + error.message });
    }
};

// ------------------- D (Delete) -------------------
export const remove = async (req, res) => {
    try {
        const ma_nhan_vien = req.params.ma_nv;
        const deletedRows = await nhanVienService.deleteNhanVien(ma_nhan_vien);

        if (deletedRows === 0) {
            return res.status(404).send({ 
                message: `Không tìm thấy nhân viên mã ${ma_nhan_vien} để xóa.` 
            });
        }
        res.status(200).send({ message: "Xóa nhân viên và tài khoản liên quan thành công." });
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi xóa nhân viên: " + error.message });
    }
};