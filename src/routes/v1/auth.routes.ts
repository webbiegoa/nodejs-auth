import express from 'express';
import AuthController from '../../controllers/auth.controller';
import { API_ENDPOINTS } from '../../constants/endpoints';
import { AuthValidator } from '../../validators/auth.validator';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = express.Router();

// Add RequestHandler type to ensure correct typing
router.post(API_ENDPOINTS.SIGNUP, AuthValidator.signupValidation(), validateRequest, AuthController.signup);
router.post(API_ENDPOINTS.FORGOT_PASSWORD, AuthValidator.forgotPasswordValidation(), validateRequest, AuthController.forgotPassword);
router.post(API_ENDPOINTS.RESET_PASSWORD, AuthValidator.resetPasswordValidation(), validateRequest, AuthController.resetPassword);
router.post(API_ENDPOINTS.LOGIN, AuthController.login as express.RequestHandler);
router.get(API_ENDPOINTS.VERIFY_EMAIL, AuthController.verifyEmail as express.RequestHandler);
router.post(API_ENDPOINTS.SOCIAL_LOGIN, AuthController.socialLogin as express.RequestHandler);
router.post(API_ENDPOINTS.REFRESH_TOKEN, AuthController.refreshToken as express.RequestHandler);
router.post(API_ENDPOINTS.LOGOUT, authenticateToken, AuthController.logout as express.RequestHandler);
router.get(API_ENDPOINTS.ME, authenticateToken, AuthController.me as express.RequestHandler);

export default router;