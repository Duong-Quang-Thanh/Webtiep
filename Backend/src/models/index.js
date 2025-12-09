import dbConfig from '../config/dbConfig.js'; 
import { Sequelize, DataTypes } from 'sequelize';
import PhongBanModel from './phongBanModel.js';
import ChucVuModel from './chucVuModel.js';
import NhanVienModel from './nhanVienModel.js';
import ChamCongModel from './chamCongModel.js';
import BangLuongModel from './bangLuongModel.js';
import TaiKhoanModel from './taiKhoanModel.js';

const sequelize = new Sequelize(
  dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
  { host: dbConfig.HOST, 
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Khởi tạo Models
db.PhongBan = PhongBanModel(sequelize, DataTypes);
db.ChucVu = ChucVuModel(sequelize, DataTypes);
db.NhanVien = NhanVienModel(sequelize, DataTypes);
db.ChamCong = ChamCongModel(sequelize, DataTypes);
db.BangLuong = BangLuongModel(sequelize, DataTypes);
db.TaiKhoan = TaiKhoanModel(sequelize, DataTypes);

// Định nghĩa Quan hệ (Relationships)
db.NhanVien.belongsTo(db.PhongBan, { foreignKey: 'ma_phong', as: 'phongBan' });
db.NhanVien.belongsTo(db.ChucVu, { foreignKey: 'ma_chuc_vu', as: 'chucVu' });
db.NhanVien.hasMany(db.ChamCong, { foreignKey: 'ma_nhan_vien', as: 'chamCongs' });
db.NhanVien.hasMany(db.BangLuong, { foreignKey: 'ma_nhan_vien', as: 'bangLuongs' });
db.NhanVien.hasOne(db.TaiKhoan, { foreignKey: 'ma_nhan_vien', as: 'taiKhoan' });

// Quan hệ ngược 
db.ChamCong.belongsTo(db.NhanVien, { foreignKey: 'ma_nhan_vien', as: 'nhanVien' });
db.BangLuong.belongsTo(db.NhanVien, { foreignKey: 'ma_nhan_vien', as: 'nhanVien' });
db.TaiKhoan.belongsTo(db.NhanVien, { foreignKey: 'ma_nhan_vien', as: 'nhanVien' });
db.PhongBan.hasMany(db.NhanVien, { foreignKey: 'ma_phong', as: 'nhanViens' });

export default db;
