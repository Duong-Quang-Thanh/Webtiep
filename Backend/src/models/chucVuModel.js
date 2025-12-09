const ChucVuModel = (sequelize, DataTypes) => {
  const ChucVu = sequelize.define('ChucVu', {
    ma_chuc_vu: {
      type: DataTypes.CHAR(1),
      primaryKey: true,
      allowNull: false
    },
    ten_chuc_vu: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'ChucVu',
    timestamps: false
  });
  return ChucVu;
};

export default ChucVuModel;