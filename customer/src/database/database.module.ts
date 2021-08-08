import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/customer.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            username: 'postgres',
            password: 'docker',
            database: 'ordering',
            entities: [CustomerEntity],
            synchronize: true
        }),
    ]
})
export class DatabaseModule { }
