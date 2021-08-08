export class ProductDto {
  name: string;
  price: number;
}

export class ProductUpdateDto extends ProductDto {
  id: number
}
