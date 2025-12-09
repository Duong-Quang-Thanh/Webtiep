import express from 'express';
import * as chamCongController from '../controllers/chamCongController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/check-in', 
  roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]),
  chamCongController.checkIn
);

router.put(
    '/check-out', 
    roleMiddleware([ROLES.NHAN_VIEN, ROLES.ADMIN, ROLES.HR]),
    chamCongController.checkOut
);

router.post(
    '/full', 
    roleMiddleware([ROLES.ADMIN, ROLES.HR]), 
    chamCongController.createFullChamCong
);

router.get(
    '/summary', 
    roleMiddleware([ROLES.ADMIN, ROLES.HR]), 
    chamCongController.getAll
);

router.get(
  '/:ma_nv', 
  roleMiddleware([ROLES.ADMIN, ROLES.HR, ROLES.NHAN_VIEN]),
  chamCongController.getHistory
)

export default router;