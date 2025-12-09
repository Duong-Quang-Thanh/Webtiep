import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/constantConfig.js';

const router = express.Router();

router.post('/login', authController.login);

router.post(
    '/register', 
    authMiddleware, 
    roleMiddleware([ROLES.ADMIN, ROLES.HR]), 
    authController.register
);

export default router;