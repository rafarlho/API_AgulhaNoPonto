import { getEmbeddings } from "../services/embeddingService"

require("dotenv").config()
const { Pool } = require("../../node_modules/@types/pg")

const pool = new Pool({connectionString: process.env.DATABASE_URL})


async function main() {
    const {rows: products} = await pool.query(`
        select p.id,p.name, p.description, p.price, coalesce(string_agg(c.name, ', '),'') as categories
        from product p
        left join product_category pc on pc.product_id = p.id
        left join category c on c.id = pc.category_id
        group by p.id
    `)

    for (const product of products) {
        const text = `${product.name}. ${product.description || ''}. ${product.price}€. Pode Categorias: ${products.categories}.`
        const embedding = await getEmbeddings(text)
        await pool.query(
            `Update product set embedding = $1 where id = $2`,[`[${embedding.join(',')}]`, product.id]
        )
    }
    await pool.end();

}

main().catch(console.error)