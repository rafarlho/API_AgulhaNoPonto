import { pool } from '../config/db';
import { CreateProductDTO, UpdateProductDTO } from '../types/dtos/product';
import type { Product, ProductWithcategories } from '../types/product';

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

export async function getAllProducts(): Promise<Product[]> {
    const { rows } = await pool.query<Product>(`
        SELECT p.id, p.name, p.description, p.price, 
            COALESCE(
                json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL),
                '[]'
            ) AS categories
        FROM product p
        LEFT JOIN product_category pc ON p.id = pc.product_id
        LEFT JOIN category c ON c.id = pc.category_id
        GROUP BY p.id
        `)
    return rows
}

export async function findProductById(id: number): Promise<ProductWithcategories | null> {
    const { rows } = await pool.query<ProductWithcategories>(`
        SELECT p.id, p.name, p.description, p.price, 
            COALESCE(
                json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL),
                '[]'
            ) AS categories
        FROM product p
        LEFT JOIN product_category pc ON p.id = pc.product_id
        LEFT JOIN category c ON c.id = pc.category_id
        WHERE p.id = $1
        GROUP BY p.id
        `, [id])
    return rows[0] ?? null
}

export async function createProduct(product: CreateProductDTO): Promise<Product | null> {
    const { rows } = await pool.query<Product>("INSERT INTO product (name, description, price) VALUES ($1, $2, $3) returning id, name, description, price",[product.name, product.description, product.price])
    return rows[0] ?? null
}

export async function updateProduct(id: number, product: UpdateProductDTO): Promise<Product | null> {
    const { rows } = await pool.query<Product>(`UPDATE product
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price)
        WHERE id = $4
        RETURNING id, name, description, price`,[product.name, product.description, product.price, id]
    )
    return rows[0] ?? null
}

export async function deleteProduct(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM product WHERE id = $1',[id])
    return (result.rowCount ?? 0) > 0
}

export async function setProductCategories(productId: number, categoryIds: number[]): Promise<void> {
    await pool.query('DELETE FROM product_category WHERE product_id = $1', [productId]);

    if (categoryIds.length === 0) return;

    const values = categoryIds.map((_, i) => `($1, $${i + 2})`).join(', ');
    await pool.query(
        `INSERT INTO product_category (product_id, category_id) VALUES ${values}`,
        [productId, ...categoryIds]
    );
    }

export async function updateProductEmbedding(id: number, vectorStr: string): Promise<void> {
    await pool.query('UPDATE product SET embedding = $1 WHERE id = $2', [vectorStr, id]);
}

export async function getProductsByCategoryId(id: number): Promise<number[]> {
    const { rows } = await pool.query<{ id: number }>(`
        SELECT p.id 
        FROM product p 
        LEFT JOIN product_category pc on pc.product_id = p.id
        LEFT JOIN category c on pc.category_id = c.id
        WHERE c.id = $1
        `,[id])
    return rows.map(r => r.id)


}