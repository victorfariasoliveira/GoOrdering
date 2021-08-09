import { Body, Controller, Delete, Get, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiBody } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CustomerDto } from './dtos/customer.dto';
import { Customer } from './interfaces/customer.interface';

@Controller('customers')
export class CustomersController implements OnModuleInit {
    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'customer',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'customer-consumer',
                allowAutoTopicCreation: true,
            },
        },
    })
    private client: ClientKafka;

    async onModuleInit() {
        const requestPatters = ['find-all-customer'];

        requestPatters.forEach(async (pattern) => {
            this.client.subscribeToResponseOf(pattern);
            await this.client.connect;
        });
    }

    @Get()
    index(): Observable<Customer[]> {
        return this.client.send('find-all-customer', {});
    }

    @Post()
    @ApiBody({ type: CustomerDto })
    create(@Body() customer: CustomerDto) {
        return this.client.emit('create-customer', customer);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() { cep }: CustomerDto) {
        const payload = { id, cep }
        return this.client.emit('update-customer', payload);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.client.emit('delete-customer', { id });
    }

}
