import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customers/interfaces/customer.interface';
import { Product } from 'src/product-orders/interfaces/product.interface';

export class OrderDto {
  @ApiProperty()
  customer: Customer;

  @ApiProperty()
  product: Product;

  @ApiProperty()
  qtd_product: number

}

export class OrderUpdateDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  qtd_product: number;
}