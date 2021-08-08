import { Module } from '@nestjs/common';
import { ProductOrdersController } from './product-orders.controller';

@Module({
  controllers: [ProductOrdersController],
})
export class ProductOrdersModule {}
