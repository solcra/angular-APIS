export interface Category {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  taxes?: number;
}

//Omit nos nos omite los parametros que enviemos
export interface CreateProductDTO extends Omit<Product, 'id' | 'category'> {
  categoryId: number;
}

//Partial nos pone todo opcionales
export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
