import express, { Router , Request, Response} from "express";
import { findProductById, getAllProducts } from "../repository/productRepository";
import { createProductWithEmbedding, deleteProductById, updateProductWithEmbedding } from "../services/productService";

const router: Router = express.Router()

router.get('/products/:id', async (req: Request, res:Response) => {
    const id = Number(req.params.id);
    const products = await findProductById(id)
    res.json(products) 
})


router.get('/products', async (_req: Request, res:Response) => {
    const products = await getAllProducts()
    res.json(products) 
})

router.post('/products', async (req:Request, res: Response) => {
    const {name, description, price, categoryIds } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    try {
        const product = await createProductWithEmbedding({ name, description, price, categoryIds });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

router.put('/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, description, price, categoryIds } = req.body
    try {
        const product = await updateProductWithEmbedding(id, { name, description, price, categoryIds })
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
        res.json(product);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Erro ao atualizar produto' })
    }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const deleted = await deleteProductById(id)
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' })
    res.status(204).send()
});

export default router;