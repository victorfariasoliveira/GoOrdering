import { Body, Controller, Delete, Get, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ProductDto, ProductUpdateDto } from './dtos/product.dto';
import { Product } from './interfaces/product.interface';

@Controller('product-orders')
export class ProductOrdersController implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-orders',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'product-orders-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private client: ClientKafka;

  async onModuleInit() {
    const requestPatters = ['find-all-product'];

    requestPatters.forEach(async (pattern) => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect;
    });
  }

  @Get()
  index(): Observable<Product[]> {
    return this.client.send('find-all-product', {});
  }

  @Post()
  @ApiBody({ type: ProductDto })
  create(@Body() product: ProductDto) {
    return this.client.emit('create-product', product);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() { name, price }: ProductUpdateDto) {
    const payload = { id, name, price }
    return this.client.emit('update-product', payload);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.client.emit('delete-customer', { id });
  }

}
