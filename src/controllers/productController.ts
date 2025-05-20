import { Request, Response, NextFunction } from "express";
import Product from "../models/product";

const productController = {
    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const category = req.query.category as string;

            const products = await Product.getAllProducts(page, category);

            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },
    searchProducts: async (req: Request, res: Response, next: NextFunction) => {
        const searchQuery = req.query.q as string;
        if (!searchQuery) {
            res.status(400).json({ error: 'Search query is required' });
        }
        try {
            const products = await Product.searchProducts(searchQuery);
            if (products.length === 0) {
                res.status(404).json({ message: 'No products found' });
            }
            else res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }
};

export default productController;