import client from '../db';

let products: Product[] = [];

export default class Product {
    constructor(public id: number, public name: string, public price: number) {

    }

     static getAllProducts = async (page: number = 1, category?: string) => {
        const limit = 10; 
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products ORDER BY dateAdded DESC LIMIT $1 OFFSET $2';
        const queryParams: (string | number)[] = [limit, offset];

        if (category) {
            query = 'SELECT * FROM products WHERE category = $1 ORDER BY dateAdded DESC LIMIT $2 OFFSET $3';
            queryParams.unshift(category);
        }

        try {
            const result = await client.query(query, queryParams);
            return result.rows;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error('Error fetching products: ' + error.message);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    };
} 