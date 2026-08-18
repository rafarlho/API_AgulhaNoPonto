import { pool } from '../config/db';
import type { Product } from '../types/product';

export async function findSimilarProducts(vectorStr: string, threshold = 0.6, limit = 5): Promise<Product[]> {
    const { rows } = await pool.query<Product>(
        `SELECT name, description, price, embedding <=> $1 AS distance
        FROM product
        WHERE embedding <=> $1 < $2
        ORDER BY distance
        LIMIT $3`,
        [vectorStr, threshold, limit]
    );
    return rows;
}