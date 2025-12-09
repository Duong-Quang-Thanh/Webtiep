import express from 'express';
import * as nhanVienController from '../controllers/nhanVienController.js';

// SỬA LỖI: Dùng ngoặc nhọn {} vì bên kia export const
import { verifyToken } from '../middleware/authMiddleware.js'; 

// Import default cho roleMiddleware (vì bên kia export default)
import roleMiddleware from '../middleware/roleMiddleware.js'; 
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

// Áp dụng verifyToken cho toàn bộ router này
router.use(verifyToken);

// Định nghĩa các bộ quyền
const adminHrOnly = roleMiddleware([ROLES.ADMIN, ROLES.HR]);
const allowAll = roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]);

// Route tạo mới (Chỉ Admin/HR)
router.post('/', adminHrOnly, nhanVienController.create);

// Route lấy tất cả (Chỉ Admin/HR)
router.get('/', adminHrOnly, nhanVienController.findAll);

// Route lấy 1 người (Admin/HR xem ai cũng được, NV chỉ xem chính mình - logic đã xử lý trong roleMiddleware)
router.get('/:ma_nv', allowAll, nhanVienController.findOne);

// Update/Delete (Chỉ Admin/HR)
router.put('/:ma_nv', adminHrOnly, nhanVienController.update);
router.delete('/:ma_nv', adminHrOnly, nhanVienController.remove);

export default router;