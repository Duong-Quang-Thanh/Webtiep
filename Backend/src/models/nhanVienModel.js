const NhanVienModel = (sequelize, DataTypes) => {
  const NhanVien = sequelize.define('NhanVien', {
    ma_nhan_vien: {
      type: DataTypes.STRING(10), primaryKey: true, allowNull: false
    },
    ten_nhan_vien: {
      type: DataTypes.STRING(100), allowNull: false
    },
    ma_phong: {
      type: DataTypes.CHAR(3), references: { model: 'PhongBan', key: 'ma_phong' }
    },
    ma_chuc_vu: {
      type: DataTypes.CHAR(1), references: { model: 'ChucVu', key: 'ma_chuc_vu' }
    },
    muc_luong_co_ban: {
      type: DataTypes.DECIMAL(12, 2), allowNull: false
    },
    ngay_vao_lam: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    trang_thai: {
      type: DataTypes.ENUM('DangLam', 'DaNghi'), 
      defaultValue: 'DangLam'
    }
  }, { tableName: 'NhanVien', timestamps: false });
  return NhanVien;
};

export default NhanVienModel;