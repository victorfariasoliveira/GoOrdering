import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;
}

export class ProductUpdateDto extends ProductDto {
  @ApiProperty()
  id: number
}

