const TaiKhoanModel = (sequelize, DataTypes) => {
  const TaiKhoan = sequelize.define('TaiKhoan', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ma_nhan_vien: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      references: {
        model: 'NhanVien', // Tên bảng NhanVien
        key: 'ma_nhan_vien'
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'hr', 'nhanvien'),
      allowNull: false
    }
  }, {
    tableName: 'TaiKhoan',
    timestamps: false,
    id: false
  });
  return TaiKhoan;
};

export default TaiKhoanModel;