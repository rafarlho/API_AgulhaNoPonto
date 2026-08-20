import express, { Router, Request, Response } from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../repository/categoryRepository';
import { getProductsByCategoryId } from '../repository/productRepository';
import { regenerateEmbeddingForProduct } from '../services/productService';

const router: Router = express.Router()

router.get('/categories', async (_req: Request, res: Response) => {
    const categories = await getAllCategories()
    res.json(categories)
})

router.post('/categories', async (req: Request, res: Response) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' })

    const category = await createCategory(name)
    res.status(201).json(category)
});

router.put('/categories/:id', async (req: Request, res: Response) => {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' })

    const id = Number(req.params.id)

    const category = await updateCategory(id, name);

    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' })

    const productsWithChangedCategory: number[] = await getProductsByCategoryId(id)

    productsWithChangedCategory.forEach(async id => await regenerateEmbeddingForProduct(id))

    res.json(category)
})

router.delete('/categories/:id', async (req: Request, res: Response) => {
    const deleted = await deleteCategory(Number(req.params.id))
    if (!deleted) return res.status(404).json({ error: 'Categoria não encontrada' })
    res.status(204).send();
})

export default router;