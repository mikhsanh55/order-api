import { Router } from "express";
import { orderIndex, orderShow, orderStore, orderUpdate, orderDestroy } from '../controllers/orderController';
import { authenticate } from "../middlewares/auth";

const router = Router();

// define route for all order
router.get('/', authenticate, orderIndex);

// define to get single order
router.get('/:id', authenticate,orderShow);

// create
router.post('/', authenticate,orderStore);

// update
router.put('/:id', authenticate, orderUpdate);

// delete
router.delete('/:id', authenticate, orderDestroy);

export default router;