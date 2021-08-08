import { Customer } from "src/customers/interfaces/customer.interface";
import { Product } from "src/product-orders/interfaces/product.interface";

export interface Order {
  id: string;
  customer: Customer;
  product: Product;
}

export interface OrderProduct extends Order {
  products: Product[]
}