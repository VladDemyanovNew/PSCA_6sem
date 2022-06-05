import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = express.Router();
const authController = new AuthController();

authRouter.get('/login', authController.loginView);
authRouter.post('/login', authController.login);
authRouter.get('/signup', authController.signupView);
authRouter.post('/signup', authController.signup);
authRouter.get('/logout', authController.logout);
authRouter.get('/resource', authController.resource);
authRouter.get('/refresh-token', authController.refreshToken);

export { authRouter };