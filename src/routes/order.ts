import { Router } from "express";
import { orderIndex, orderShow, orderStore, orderUpdate, orderDestroy } from '../controllers/orderController';

const router = Router();

// define route for all order
router.get('/', orderIndex);

// define to get single order
router.get('/:id', orderShow);

// create
router.post('/', orderStore);

// update
router.put('/:id', orderUpdate);

// delete
router.delete('/:id', orderDestroy);

export default router;