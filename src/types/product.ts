import { Category } from "./categories"

export interface Product {
    id:number
    name: string
    description: string | null
    price: number | null
    distance?: number
}

export interface ProductWithcategories extends Product {
    categories: Category[]
}