export class CustomerDto {
  cpf: string;
  email: string;
  password: string;
  cep: string;
}

export class CustomerUpdateDto {
  id: string;
  cep: string;
}