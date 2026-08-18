export interface Product {
    id?:number
    name: string
    description: string | null
    price: number | null
    distance?: number
}