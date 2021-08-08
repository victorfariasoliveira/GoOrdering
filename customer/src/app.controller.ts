import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CustomerDto, CustomerUpdateDto } from './dtos/customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { ExceptionFilter } from './filters/rpc-exception.filter';

@Controller()
@UseFilters(new ExceptionFilter())
export class AppController {
  constructor(private readonly appService: AppService) { }

  private readonly logger = new Logger(AppController.name)

  @MessagePattern('find-all-customer')
  async index(): Promise<CustomerEntity[]> {
    return this.appService.findAll()
  }

  @MessagePattern('create-customer')
  async create(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.create(data.value as CustomerDto)
  }

  @MessagePattern('update-customer')
  async update(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.update(data.value as CustomerUpdateDto)
  }

  @MessagePattern('delete-customer')
  async remove(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.delete(data.value.id as number)
  }
}
