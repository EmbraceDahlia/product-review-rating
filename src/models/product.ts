import client from '../db';

export default class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public category: string,
        public price: number,
        public dateAdded: string,
        public averageRating: number,
        public imagePath: string,
    ) { }

    static getAllProducts = async (page: number, limit: number, category?: string): Promise<{ products: Product[], totalCount: number }> => {
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products ORDER BY dateadded DESC LIMIT $1 OFFSET $2';
        const queryParams: (string | number)[] = [limit, offset];

        if (category) {
            query = 'SELECT * FROM products WHERE category = $1 ORDER BY dateadded DESC LIMIT $2 OFFSET $3';
            queryParams.unshift(category);
        }

        let countQuery = 'SELECT COUNT(*) FROM products';
        let countQueryParams: (string | number)[] = [];

        if (category) {
            countQuery = 'SELECT COUNT(*) FROM products WHERE category = $1';
            countQueryParams = [category];
        }

        try {
            const result = await client.query(query, queryParams);
            const products = result.rows.map((row: any) => new Product(row.id, row.name, row.description, row.category, row.price, row.dateadded, row.averagerating, row.imagepath));

            const countResult = await client.query(countQuery, countQueryParams);
            const totalCount = parseInt(countResult.rows[0].count, 10);

            return { products, totalCount };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching products: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching products.');
        }
    };

    static searchProducts = async (searchQuery: string, page: number, limit: number): Promise<{ products: Product[], totalCount: number }> => {
        const offset = (page - 1) * limit;
        
        const query = 'SELECT * FROM products WHERE name ILIKE $1 ORDER BY dateadded DESC LIMIT $2 OFFSET $3';
        const queryParams = [`%${searchQuery}%`, limit, offset];
        
        const countQuery = 'SELECT COUNT(*) FROM products WHERE name ILIKE $1';
        const countQueryParams = [`%${searchQuery}%`];

        try {
            const result = await client.query(query, queryParams);
            const products = result.rows.map((row: any) => new Product(
                row.id,
                row.name,
                row.description,
                row.category,
                row.price,
                row.dateadded,
                row.averagerating,
                row.imagepath
            ));
            
            const countResult = await client.query(countQuery, countQueryParams);
            const totalCount = parseInt(countResult.rows[0].count, 10);

            return { products, totalCount };
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
                row.price, row.dateadded, row.averagerating, row.imagepath
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching the product: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching the product.');
        }
    };

    static getProductCategories = async (): Promise<string[]> => {
        const query = 'SELECT DISTINCT category FROM products';
        try {
            const result = await client.query(query);
            return result.rows.map((row: any) => row.category);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error fetching categories: ${error.message}`);
            }
            throw new Error('An unknown error occurred while fetching categories.');
        }
    };


}
