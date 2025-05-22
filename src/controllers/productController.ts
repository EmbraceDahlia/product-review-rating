import { Request, Response, NextFunction } from "express";
import Product from "../models/product";

const productController = {
    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const category = req.query.category as string;

            const products = await Product.getAllProducts(page, limit, category);

            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },
    searchProducts: async (req: Request, res: Response, next: NextFunction) => {
        const searchQuery = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        if (!searchQuery) {
            res.status(400).json({ error: 'Search query is required' });
        }
        try {
            const products = await Product.searchProducts(searchQuery,page,limit);
            if (!products) {
                res.status(404).json({ message: 'No products found' });
            }
            else res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },
    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        const productId = parseInt(req.params.id);
        try {
            const reviews = await Product.getProductById(productId);
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    },
    getProductCategories: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Product.getProductCategories();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }
};

export default productController;