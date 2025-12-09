import express from 'express';
import * as luongController from '../controllers/luongController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();
router.use(verifyToken);

router.post('/tinh-luong', roleMiddleware([ROLES.ADMIN, ROLES.HR]), luongController.tinhLuongThang);
router.get('/thong-ke/:ma_nv/:nam', roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]), luongController.thongKeThuNhapNam);

export default router;