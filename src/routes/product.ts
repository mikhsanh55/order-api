import { Router } from "express";
import {productIndex, productShow, productStore, productUpdate} from '../controllers/productController';
import { upload } from '../middlewares/upload';

const router = Router();    

// define route for all order
router.get('/', productIndex);
router.get('/:id', productShow);
router.post('/', upload.single('image'), productStore);
router.put('/:id', upload.single('image'), productUpdate);

export default router;