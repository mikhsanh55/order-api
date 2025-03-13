import {Router} from 'express';
import {authRegister, authLogin, forgotPassword} from '../controllers/authController';

const router = Router();

router.post('/register', authRegister);
router.post('/login', authLogin);
router.post('/forgot-password', forgotPassword);

export default router;