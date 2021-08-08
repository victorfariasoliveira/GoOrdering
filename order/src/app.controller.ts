import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { OrderDto, OrderUpdateDto } from './dtos/order.dto';
import { OrderEntity } from './entities/order.entity';
import { ExceptionFilter } from './filters/rpc-exception.filter';
;

@Controller()
@UseFilters(new ExceptionFilter())
export class AppController {
  constructor(private readonly appService: AppService) { }

  private readonly logger = new Logger(AppController.name)

  @MessagePattern('find-all-order')
  async index(): Promise<OrderEntity[]> {
    return this.appService.findAll()
  }

  @MessagePattern('find-all-order-by-customer-id')
  async indexByCustomerId(@Payload() data: any): Promise<OrderEntity[]> {
    this.logger.log(data)
    return this.appService.findAllByCustomerId(data.value.id as number)
  }

  @MessagePattern('find-order-by-id')
  async find(@Payload() data: any): Promise<OrderEntity> {
    this.logger.log(data)
    return this.appService.findById(data.value.id as number)
  }

  @MessagePattern('create-order')
  async create(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.create(data.value as OrderDto)
  }

  @MessagePattern('update-order')
  async update(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.update(data.value as OrderUpdateDto)
  }

  @MessagePattern('delete-order')
  async remove(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.delete(data.value.id as number)
  }
}
