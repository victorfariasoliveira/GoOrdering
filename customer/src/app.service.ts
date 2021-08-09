import axios, { AxiosError, AxiosResponse } from 'axios'
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { Address } from './interfaces/address.interface';
import { CustomerDto, CustomerUpdateDto } from './dtos/customer.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) { }

  private readonly logger = new Logger(AppService.name)

  public async findAll(): Promise<CustomerEntity[]> {
    try {
      return this.customerRepository.find()
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new Error(error)
    }
  }

  public async create(customer: CustomerDto): Promise<void> {
    try {
      await this.validateEmail(customer.email)
      await this.validateCpf(customer.cpf)
      const { bairro, logradouro, uf } = await this.validateCep(customer.cep)
      await this.customerRepository.save({ ...customer, logradouro, uf, district: bairro })
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new Error(error)
    }
  }

  public async update({ id, cep }: CustomerUpdateDto): Promise<void> {
    try {
      const { bairro, logradouro, uf } = await this.validateCep(cep)
      const customer = await this.customerRepository.findOne(id)

      customer.cep = cep ? cep : customer.cep
      customer.district = bairro ? bairro : customer.district
      customer.logradouro = logradouro ? logradouro : customer.logradouro
      customer.uf = uf ? uf : customer.uf

      await this.customerRepository.save(customer)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new Error(error)
    }
  }


  public async delete(id: number): Promise<void> {
    try {
      await this.customerRepository.delete(id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw new Error(error)
    }
  }

  // PRIVATE METHODS

  private async validateCep(cep: string): Promise<Address> {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((result: AxiosResponse) => {
        this.logger.log(JSON.stringify(result.data), this.validateCpf.name)
        return result.data as Address

      }).catch((error: AxiosError) => {
        this.logger.error(JSON.stringify(error))
        throw new Error(error.message)

      })
  }

  private async validateEmail(email: string): Promise<void> {
    const customer = await this.customerRepository.find({ where: { email } })

    if (customer.length !== 0) {
      const errorMessage = 'It is necessary to pass an unused email'
      this.logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  private async validateCpf(cpf: string): Promise<void> {
    const customer = await this.customerRepository.find({ where: { cpf } })

    if (customer.length !== 0) {
      const errorMessage = 'It is necessary to pass an unused cpf'
      this.logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

}