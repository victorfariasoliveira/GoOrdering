import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [CustomersModule, ProductOrdersModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
