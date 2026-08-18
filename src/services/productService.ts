import { createProduct, deleteProduct, findProductById, setProductCategories, updateProduct, updateProductEmbedding } from "../repository/productRepository"
import { CreateProductDTO, UpdateProductDTO } from "../types/dtos/product";
import { ProductWithcategories } from "../types/product";
import { getEmbeddings } from "./embeddingService";

export async function regenerateEmbeddingForProduct(productId: number): Promise<void> {
    const product = await findProductById(productId)
    if(!product) return

    const categoryNames = product.categories.map(c => c.name).join(", ")
    const text = `${product.name}. ${product.description || ''}. Categorias: ${categoryNames}.`;

    const embedding = await getEmbeddings(text)
    const vectorStr = `[${embedding.join(',')}]`
    await updateProductEmbedding(productId, vectorStr)
}

export async function createProductWithEmbedding(product: CreateProductDTO): Promise<ProductWithcategories> {
    const created = await createProduct(product)
    
    if(product.categoryIds && product.categoryIds.length !== 0)
        await setProductCategories(created!.id, product.categoryIds)
    
    await regenerateEmbeddingForProduct(created!.id)

    const result = await findProductById(created!.id)
    return result!
}

export async function updateProductWithEmbedding(id: number, product: UpdateProductDTO): Promise<ProductWithcategories | null> {
    const updated = await updateProduct(id, product)
    if (!updated) return null

    if (product.categoryIds !== undefined) 
        await setProductCategories(id, product.categoryIds)

    await regenerateEmbeddingForProduct(id)
    return findProductById(id)
}

export async function deleteProductById(id: number): Promise<boolean> {
    return deleteProduct(id)
}