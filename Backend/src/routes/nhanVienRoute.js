import express from 'express';
import * as nhanVienController from '../controllers/nhanVienController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

router.use(authMiddleware);
const adminHr = roleMiddleware([ROLES.ADMIN, ROLES.HR]);
const allRoles = roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]);

router.post('/', adminHr, nhanVienController.create);
router.get('/', adminHr, nhanVienController.findAll);

// R - Read One (Admin/HR xem mọi người, NHAN_VIEN chỉ xem chính mình)
router.get('/:ma_nv', allRoles, nhanVienController.findOne);
router.put('/:ma_nv', adminHr, nhanVienController.update);
router.delete('/:ma_nv', adminHr, nhanVienController.remove);

export default router;