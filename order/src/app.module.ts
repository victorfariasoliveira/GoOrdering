import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CustomerEntity } from './entities/customer.entity';
import { OrderEntity } from './entities/order.entity';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([OrderEntity, ProductEntity, CustomerEntity])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
