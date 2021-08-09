import { Body, Controller, Delete, Get, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { OrderDto, OrderUpdateDto } from './dtos/order.dto';
import { Order, OrderProduct } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController implements OnModuleInit {
    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'order',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'order-consumer',
                allowAutoTopicCreation: true,
            },
        },
    })
    private client: ClientKafka;

    async onModuleInit() {
        const requestPatters = [
            'find-all-order',
            'find-all-order-by-customer-id',
            'find-order-by-id'
        ];

        requestPatters.forEach(async (pattern) => {
            this.client.subscribeToResponseOf(pattern);
            await this.client.connect;
        });
    }

    @Get()
    index(): Observable<Order[]> {
        return this.client.send('find-all-order', {});
    }

    @Get('customer/:id')
    indexByCustomerId(@Param('id') id: Number): Observable<OrderProduct[]> {
        return this.client.send('find-all-order-by-customer-id', { id });
    }

    @Get(':id')
    find(@Param('id') id: Number): Observable<Order> {
        return this.client.send('find-order-by-id', { id });
    }

    @Post()
    @ApiBody({ type: OrderDto })
    create(@Body() order: OrderDto) {
        return this.client.emit('create-order', order);
    }

    @Put(':id')
    update(@Param('id') id: Number, @Body() { product_id, qtd_product }: OrderUpdateDto): Observable<Order> {
        return this.client.emit('update-order', { order_id: id, product_id, qtd_product });
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.client.emit('delete-order', { id });
    }
}
