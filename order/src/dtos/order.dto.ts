export class OrderDto {
  customer_id: number;
  product_id: number;
  qtd_product: number;
}

export class OrderUpdateDto {
  order_id: number;
  product_id: number;
  qtd_product: number;
}