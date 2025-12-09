import jwt from 'jsonwebtoken';
import { ROLES } from '../config/constantConfig.js';
import jwtConfig from '../config/jwtConfig.js';

// 1. Middleware xác thực Token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('[verifyToken] No token found in authorization header');
        return res.status(401).json({ message: "Không tìm thấy token xác thực!" });
    }

    jwt.verify(token, jwtConfig.SECRET, (err, decoded) => {
        if (err) {
            console.log('[verifyToken] Token verification failed:', err.message);
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
        
        console.log('[verifyToken] Token decoded successfully:', decoded);
        // QUAN TRỌNG: Lưu decoded vào req.user để các middleware sau dùng
        // decoded thường chứa: { ma_nhan_vien, role, ... }
        req.user = decoded;
        req.userRole = decoded.role;
        req.userId = decoded.ma_nhan_vien;
        console.log('[verifyToken] Set req.user:', req.user, ', req.userRole:', req.userRole, ', req.userId:', req.userId);
        next();
    });
};

// 2. Middleware kiểm tra quyền Quản lý (Hardcoded helper)
export const isManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Chưa xác thực người dùng!" });
    }

    if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.HR) {
        next();
        return;
    }

    res.status(403).json({ message: "Yêu cầu quyền Quản lý!" });
};