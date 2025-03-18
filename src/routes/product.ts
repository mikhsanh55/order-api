import { Router } from "express";
import {productIndex, productShow, productStore, productUpdate} from '../controllers/productController';
import { upload } from '../middlewares/upload';
import { authenticate } from "../middlewares/auth";

const router = Router();    

// define route for all order
router.get('/', authenticate, productIndex);
router.get('/:id', authenticate, productShow);
router.post('/', [authenticate, upload.single('image')], productStore);
router.put('/:id', [authenticate, upload.single('image')], productUpdate);

export default router;