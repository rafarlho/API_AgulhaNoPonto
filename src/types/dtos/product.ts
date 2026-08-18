export interface CreateProductDTO {
    name: string;
    description?: string | null;
    price?: number | null;
    categoryIds: number[];
}

export interface UpdateProductDTO {
    name?: string;
    description?: string | null;
    price?: number | null;
    categoryIds?: number[];
}
