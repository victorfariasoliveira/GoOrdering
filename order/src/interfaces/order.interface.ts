import { Product } from "./product.interface";

export interface Order {
  id: number;
  customer_id: number;
  product_id: number;
  qtd_product: number
  total: number
}

export interface OrderProduct extends Order {
  products: Product[]
}