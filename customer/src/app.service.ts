import axios, { AxiosError, AxiosResponse } from 'axios'
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Address } from './interfaces/address.interface';
import { RpcException } from '@nestjs/microservices';
import { CustomerDto, CustomerUpdateDto } from './dtos/customer.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) { }

  private readonly logger = new Logger(AppService.name)

  public async findAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.find()
  }

  public async create(customer: CustomerDto): Promise<void> {
    const { bairro, logradouro, uf } = await this.validateCpf(customer.cep)
    await this.customerRepository.save({ ...customer, logradouro, uf, district: bairro })
  }

  public async update({ id, cep }: CustomerUpdateDto): Promise<void> {
    const { bairro, logradouro, uf } = await this.validateCpf(cep)
    const customer = await this.customerRepository.findOne(id)

    customer.cep = cep ? cep : customer.cep
    customer.district = bairro ? bairro : customer.district
    customer.logradouro = logradouro ? logradouro : customer.logradouro
    customer.uf = uf ? uf : customer.uf

    await this.customerRepository.save(customer)
  }


  public async delete(id: number): Promise<void> {
    await this.customerRepository.delete(id)
  }

  // PRIVATE METHODS

  private async validateCpf(cep: string): Promise<Address> {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((result: AxiosResponse) => {
        this.logger.log(JSON.stringify(result.data), this.validateCpf.name)
        return result.data as Address

      }).catch((error: AxiosError) => {
        this.logger.error(error.message, error.stack, this.validateCpf.name)
        throw new RpcException(error.message)

      })
  }

}