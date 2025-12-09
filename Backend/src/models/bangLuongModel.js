const BangLuongModel = (sequelize, DataTypes) => {
  const BangLuong = sequelize.define('BangLuong', {
    id: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    ma_nhan_vien: {
      type: DataTypes.STRING(10), allowNull: false
    },
    thang: { type: DataTypes.INTEGER, allowNull: false },
    nam: { type: DataTypes.INTEGER, allowNull: false },
    tong_gio_lam: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
    luong_co_ban: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    luong_them_gio: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    tong_luong: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
  }, { 
    tableName: 'BangLuong', 
    timestamps: false,
    indexes: [{ unique: true, fields: ['ma_nhan_vien', 'thang', 'nam'] }]
  });

  return BangLuong;
};

export default BangLuongModel;