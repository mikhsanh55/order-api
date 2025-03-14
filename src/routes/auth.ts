import {Router} from 'express';
import {authRegister, authLogin, forgotPassword, resetPassword} from '../controllers/authController';

const router = Router();

router.post('/register', authRegister);
router.post('/login', authLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;