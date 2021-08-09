import { Controller, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ProductUpdateDto } from './dtos/product.dto';
import { ProductEntity } from './entities/product.entity';
import { Product } from './interfaces/product.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  private readonly logger = new Logger(AppController.name);

  @MessagePattern('find-all-product')
  async index(): Promise<ProductEntity[]> {
    return this.appService.findAll();
  }

  @MessagePattern('create-product')
  async create(@Payload() data: any): Promise<void> {
    this.logger.log(data);
    await this.appService.create(data.value as Product);
  }

  @MessagePattern('update-product')
  async update(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.update(data.value as ProductUpdateDto)
  }

  @MessagePattern('delete-product')
  async remove(@Payload() data: any): Promise<void> {
    this.logger.log(data)
    await this.appService.delete(data.value.id as number)
  }
}