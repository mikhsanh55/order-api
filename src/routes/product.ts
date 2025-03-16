import { Router } from "express";
import {productIndex} from '../controllers/productController';

const router = Router();

// define route for all order
router.get('/', productIndex);

export default router;