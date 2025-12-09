import { ROLES } from '../config/constantConfig.js';

/**
 * Middleware kiểm tra quyền động dựa trên danh sách roles
 * @param {Array<string>} allowedRoles 
 */
const authorize = (allowedRoles) => (req, res, next) => {
    // SỬA LỖI: Lấy thông tin từ req.user (đã được verifyToken gán vào)
    if (!req.user) {
        return res.status(401).json({ message: "Chưa đăng nhập!" });
    }

    const userRole = req.user.role; // Lấy role từ token
    const currentUserId = req.user.ma_nhan_vien; // Lấy ID nhân viên từ token
    
    // Param ID từ URL (nếu có)
    const requestedId = req.params.ma_nhan_vien || req.params.id;

    console.log(`[DEBUG] userRole: ${userRole}, allowedRoles: ${JSON.stringify(allowedRoles)}, requestedId: ${requestedId}`);

    // 1. Nếu Role của user nằm trong danh sách cho phép -> OK
    if (allowedRoles.includes(userRole)) {
        console.log(`[DEBUG] User role matched, allowing access`);
        next();
        return;
    }

    // 2. Logic riêng cho NHAN_VIEN: Chỉ được xem/sửa chính mình
    if (allowedRoles.includes('nhanvien') && userRole === 'nhanvien') {
        if (requestedId && currentUserId === requestedId) {
            console.log(`[DEBUG] NHAN_VIEN accessing own resource, allowing`);
            next();
            return;
        }
    }

    // Trường hợp không có quyền
    console.log(`[DEBUG] Access denied for user role: ${userRole}`);
    return res.status(403).json({ 
        message: "Bạn không có quyền truy cập chức năng này.",
    });
}

export default authorize;