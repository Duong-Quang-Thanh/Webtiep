import express from 'express';
import * as controller from '../controllers/chamCongController.js';
import { verifyToken, isManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Check-in/Check-out (Ai cũng dùng được, Controller sẽ tự check quyền)
router.post('/check-in', verifyToken, controller.checkIn);
router.put('/check-out', verifyToken, controller.checkOut);

// 2. Lấy danh sách (Cho quản lý - Trang DanhSachChamCongPage)
router.get('/', verifyToken, isManager, controller.getDanhSach); 

// 3. Cập nhật chuyên cần (HR/Admin) - PHẢI TRƯỚC :ma_nv
router.put('/:id', verifyToken, isManager, controller.updateTrangThaiChuanCan);

// 4. Lịch sử cá nhân (Chi tiết 1 nhân viên) - PHẢI SAU :id để không conflict
router.get('/:ma_nv', verifyToken, controller.getHistory);

// 5. Summary Dashboard
router.get('/summary', verifyToken, isManager, controller.getAll);

export default router;