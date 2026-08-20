import { pool } from "../config/db";
import { Category } from "../types/categories";

export async function getAllCategories(): Promise<Category[]> {
    const { rows } = await pool.query<Category>("SELECT * FROM category ORDER BY name");
    return rows
}

export async function createCategory(name: string): Promise<Category | null> {
    const { rows } = await pool.query<Category>(`INSERT INTO category (name) VALUES ($1) RETURNING id,name`,[name])
    return rows[0] ?? null
}

export async function updateCategory(id: number, name: string): Promise<Category | null> {
    const { rows } = await pool.query<Category>('UPDATE category SET name = $1 WHERE id = $2 RETURNING id, name',[name, id]);
    return rows[0] ?? null
}

export async function deleteCategory(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM category WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
}