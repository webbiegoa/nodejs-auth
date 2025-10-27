// routes/v1/dash.routes.ts
import express from 'express';
import DashController from '../../controllers/dash.controller';
import { API_ENDPOINTS } from '../../constants/endpoints';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get(API_ENDPOINTS.DASHBOARD, authenticateToken, DashController.getDash);

export default router;
