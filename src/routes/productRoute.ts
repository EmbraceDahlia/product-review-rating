import { Router } from 'express';
import productController from '../controllers/productController';
import reviewRouter from './reviewRoute';

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.use("/:id/reviews", reviewRouter);

export default router;