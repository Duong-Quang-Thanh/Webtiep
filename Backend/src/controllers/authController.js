import * as authService from '../services/authService.js';
import db from '../models/index.js';
import bcrypt from 'bcryptjs';



const NhanVien = db.NhanVien;

// POST /api/auth/login

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("============================================");
        console.log(`🔑 Mật khẩu nhập vào: ${password}`);
        console.log(`🔒 Mã Hash chuẩn :`);
        console.log(bcrypt.hashSync(password, 8));
        console.log("============================================");
        const result = await authService.verifyUser(username, password);

        if (!result.success) {
            return res.status(401).send({ message: result.message });
        }

        const payload = { 
            ma_nhan_vien: result.user.ma_nhan_vien, 
            role: result.user.role 
        };
        
        const token = authService.generateToken(payload);

        res.status(200).send({ 
            message: " Đăng nhập thành công!",
            user: {
                ma_nhan_vien: result.user.ma_nhan_vien,
                role: result.user.role
            },
            token: token
        });

    } catch (error) {
        res.status(500).send({ message: " Lỗi Server khi đăng nhập: " + error.message });
    }
};

// POST /api/auth/register (Tạo tài khoản)

export const register = async (req, res) => {
    try {
        const { username, password, ma_nhan_vien, role } = req.body;


        const nhanVien = await NhanVien.findByPk(ma_nhan_vien);
        if (!nhanVien) {
             return res.status(404).send({ message: " Không tìm thấy nhân viên với mã này." });
        }
        
        const newAccount = await authService.registerUser(username, password, ma_nhan_vien, role);

        res.status(201).send({ 
            message: " Tạo tài khoản thành công!", 
            data: { 
                username: newAccount.username, 
                ma_nhan_vien: newAccount.ma_nhan_vien,
                role: newAccount.role
            } 
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).send({ message: " Tên đăng nhập hoặc Mã nhân viên đã tồn tại." });
        }
        res.status(500).send({ message: " Lỗi Server khi tạo tài khoản: " + error.message });
    }
};

