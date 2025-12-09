const PhongBanModel = (sequelize, DataTypes) => {
  const PhongBan = sequelize.define('PhongBan', {
    ma_phong: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
      allowNull: false
    },
    ten_phong: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nam_thanh_lap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trang_thai: {
      type: DataTypes.ENUM('HoatDong', 'NgungHoatDong'),
      defaultValue: 'HoatDong'
    }
  }, {
    tableName: 'PhongBan',
    timestamps: false
  });
  return PhongBan;
};

export default PhongBanModel;