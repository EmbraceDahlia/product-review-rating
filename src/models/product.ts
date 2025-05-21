import client from '../db';

export default class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public category: string,
        public price: number,
        public dateAdded: string,
        public averageRating: number
    ) { }

    static getAllProducts = async (page: number = 1, category?: string): Promise<Product[]> => {
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
            return result.rows.map((row: any) => new Product(row.id, row.name, row.description, row.category, row.price, row.dateAdded, row.averageRating));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching products: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching products.');
        }
    };


    static searchProducts = async (searchQuery: string): Promise<Product[]> => {
        const query = 'SELECT * FROM products WHERE name ILIKE $1 ORDER BY dateAdded DESC';
        try {
            const result = await client.query(query, [`%${searchQuery}%`]);
            return result.rows.map((row: any) => new Product(row.id, row.name, row.description, row.category, row.price, row.dateAdded, row.averageRating));
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error searching products: ${error.message}`);
            }
            throw new Error('An unknown error occurred while searching for products.');
        }
    };

    static getProductById = async (productId: number): Promise<Product | null> => {
        try {
            const result = await client.query(
                'SELECT * FROM products WHERE id = $1',
                [productId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return new Product(
                row.id, row.name, row.description, row.category,
                row.price, row.dateadded, row.averagerating
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching the product: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching the product.');
        }
    };

}
