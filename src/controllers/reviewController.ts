import { Request, Response, NextFunction } from "express";
import Review from "../models/review";

const reviewController = {
    getReviews: async (req: Request, res: Response, next: NextFunction) => {
        const productId = parseInt(req.params.id);
        try {
            const reviews = await Review.getReviewsByProductId(productId);
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    },

    addReview: async (req: Request, res: Response, next: NextFunction) => {
        const productId = parseInt(req.params.id);
        if (!Number.isInteger(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }

        const { author, rating, comment } = req.body;
        if (!author || !rating) {
            res.status(400).json({ error: "Author and rating are required" });
            return;
        }

        try {
            const newReview = await Review.addReview(productId, author, rating, comment);
            res.status(201).json(newReview);
        } catch (error) {
            next(error);
        }
    },

    updateReview: async (req: Request, res: Response, next: NextFunction) => {
        const productId = parseInt(req.params.id);
        const reviewId = parseInt(req.params.reviewId);
        const { author, rating, comment } = req.body;

        try {
            const updatedReview = await Review.updateReview(reviewId, productId, author, rating, comment);
            if (!updatedReview) {
                res.status(404).json({ error: "Review not found" });
                return;
            }
            res.status(200).json(updatedReview);
        } catch (error) {
            next(error);
        }
    },

    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        const productId = parseInt(req.params.id);
        const reviewId = parseInt(req.params.reviewId);

        try {
            const deleted = await Review.deleteReview(reviewId, productId);
            if (!deleted) {
                res.status(404).json({ error: "Review not found" });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};

export default reviewController;
