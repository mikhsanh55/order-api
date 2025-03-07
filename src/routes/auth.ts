import {Router} from 'express';
import {authRegister, authLogin} from '../controllers/authController';

const router = Router();

router.post('/register', authRegister);
router.post('/login', authLogin);

export default router;