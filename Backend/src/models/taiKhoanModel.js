const TaiKhoanModel = (sequelize, DataTypes) => {
  const TaiKhoan = sequelize.define('TaiKhoan', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ma_nhan_vien: {
      type: DataTypes.STRING(10),
      allowNull: false,
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
    id: false,
    indexes: [
      { unique: true, fields: ['username'] },
      { unique: true, fields: ['ma_nhan_vien'] }
    ]
  });
  return TaiKhoan;
};

export default TaiKhoanModel;