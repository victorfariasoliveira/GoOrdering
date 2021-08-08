import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty()
  cpf: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  cep: string;
}
