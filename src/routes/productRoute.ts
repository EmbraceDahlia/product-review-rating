import { Router } from 'express';
import productController from '../controllers/productController';
import reviewRouter from './reviewRoute';

const router = Router();


router.get("/search", productController.searchProducts);
router.get("/categories", productController.getProductCategories);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.use("/:id/reviews", reviewRouter);

export default router;