import client from '../db';

export default class Review {
    constructor(
        public id: number,
        public productId: number,
        public author: string,
        public rating: number,
        public comment: string,
        public date: string
    ) { }

    static getReviewsByProductId = async (productId: number): Promise<Review[]> => {
        try {
            const result = await client.query(
                'SELECT * FROM reviews WHERE productId = $1 ORDER BY date DESC',
                [productId]
            );

            return result.rows.map((row: any) =>
                new Review(row.id, row.productid, row.author, row.rating, row.comment, row.date)
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching reviews: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching reviews.');
        }
    };

    static addReview = async (productId: number, author: string, rating: number, comment: string): Promise<Review> => {
        try {
            const result = await client.query(
                `INSERT INTO reviews (productId, author, rating, comment)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [productId, author, rating, comment]
            );
            await this.updateAverageRating(productId);
            const row = result.rows[0];
            return new Review(row.id, row.productid, row.author, row.rating, row.comment, row.date);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error adding review: ${error.message}`);
            }
            throw new Error('An unknown error occurred while adding a review.');
        }
    };

    static updateReview = async (
        reviewId: number,
        productId: number,
        author: string,
        rating: number,
        comment: string
    ): Promise<Review | null> => {
        try {
            const result = await client.query(
                `UPDATE reviews
                 SET author = $1, rating = $2, comment = $3
                 WHERE id = $4 AND productId = $5
                 RETURNING *`,
                [author, rating, comment, reviewId, productId]
            );

            if (result.rowCount === 0) return null;
            await this.updateAverageRating(productId);
            const row = result.rows[0];
            return new Review(row.id, row.productid, row.author, row.rating, row.comment, row.date);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error updating review: ${error.message}`);
            }
            throw new Error('An unknown error occurred while updating a review.');
        }
    };

    static deleteReview = async (reviewId: number, productId: number): Promise<boolean> => {
        try {
            const result = await client.query(
                'DELETE FROM reviews WHERE id = $1 AND productId = $2 RETURNING *',
                [reviewId, productId]
            );
            const success = !!result?.rowCount && result.rowCount > 0;
            if (success) {
                await this.updateAverageRating(productId); 
            }
            return success;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error deleting review: ${error.message}`);
            }
            throw new Error('An unknown error occurred while deleting a review.');
        }
    };

    private static updateAverageRating = async (productId: number): Promise<void> => {
        try {
            const result = await client.query(
                `SELECT AVG(rating) AS avg_rating FROM reviews WHERE productId = $1`,
                [productId]
            );

            const average = parseFloat(result.rows[0].avg_rating) || 0;

            await client.query(
                `UPDATE products SET averageRating = $1 WHERE id = $2`,
                [average.toFixed(2), productId]
            );
        } catch (error: unknown) {
            console.error('Failed to update average rating:', error);
        }
    };

}
