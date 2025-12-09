import db from '../models/index.js';

const NhanVien = db.NhanVien;
const TaiKhoan = db.TaiKhoan;
const { Op } = db.Sequelize;

// Tạo mã nhân viên tự động theo cú pháp <Mã đơn vị><Mã chức vụ><Thứ tự>
 
export const generateMaNhanVien = async (ma_phong, ma_chuc_vu) => {
  const prefix = ma_phong + ma_chuc_vu; 

  const lastNhanVien = await NhanVien.findOne({
    where: { 
      ma_nhan_vien: { [Op.like]: `${prefix}%` }
    },
    order: [['ma_nhan_vien', 'DESC']]
  });

  let nextOrder = 1;
  if (lastNhanVien) {
    const lastMa = lastNhanVien.ma_nhan_vien;
    const lastOrderStr = lastMa.substring(prefix.length); 
    nextOrder = parseInt(lastOrderStr, 10) + 1;
  }

  const nextOrderStr = String(nextOrder).padStart(4, '0');
  return prefix + nextOrderStr; 
};

// Lấy tất cả nhân viên kèm thông tin phòng ban, chức vụ
 
export const getAllNhanVien = async () => {
    return await NhanVien.findAll({
        include: [
            { model: db.PhongBan, as: 'phongBan', attributes: ['ten_phong'] },
            { model: db.ChucVu, as: 'chucVu', attributes: ['ten_chuc_vu'] }
        ]
    });
};

// Lấy nhân viên theo mã danh cho nv

export const getNhanVienById = async (ma_nhan_vien) => {
    return await NhanVien.findByPk(ma_nhan_vien, {
        include: [
            { model: db.PhongBan, as: 'phongBan', attributes: ['ten_phong'] },
            { model: db.ChucVu, as: 'chucVu', attributes: ['ten_chuc_vu'] }
        ]
    });
};

// Tạo nhân viên mới và kiểm tra đầu vào

export const createNhanVien = async (data) => {
    const ma_nhan_vien = await generateMaNhanVien(data.ma_phong, data.ma_chuc_vu);
    
    return await NhanVien.create({
        ...data,
        ma_nhan_vien
    });
};

// Cập nhật thông tin nhân viên
 
export const updateNhanVien = async (ma_nhan_vien, data) => {
    const [updatedRows] = await NhanVien.update(data, {
        where: { ma_nhan_vien }
    });
    return updatedRows;
};

// Xóa nhân viên (Xóa cả tài khoản liên quan)

export const deleteNhanVien = async (ma_nhan_vien) => {
    return await db.sequelize.transaction(async (t) => {
        await TaiKhoan.destroy({ where: { ma_nhan_vien }, transaction: t });       // xoas tai khoan lien quan 

        const deletedRows = await NhanVien.destroy({
            where: { ma_nhan_vien },
            transaction: t
        });
        return deletedRows;
    });
};