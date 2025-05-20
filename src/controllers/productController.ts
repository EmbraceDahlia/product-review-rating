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
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
};

export default productController;