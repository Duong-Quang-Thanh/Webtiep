const ChamCongModel = (sequelize, DataTypes) => {
    const ChamCong = sequelize.define('ChamCong', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ma_nhan_vien: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'NhanVien',
                key: 'ma_nhan_vien'
            }
        },
        ngay_lam: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gio_vao: {
            type: DataTypes.TIME,
            allowNull: false
        },
        gio_ra: {
            type: DataTypes.TIME,
            allowNull: true // Cho phép NULL nếu là ca đang làm (chưa check-out)
        },
        trang_thai_ca: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'DangLam'
        },
        trang_thai_chuyen_can: {
            type: DataTypes.STRING (20),
            allowNull: true
        }

    }, {
        tableName: 'ChamCong',
        timestamps: true,
        createdAt: 'created_at',       
        updatedAt: 'updated_at',
        
    });

    return ChamCong;
};

export default ChamCongModel;