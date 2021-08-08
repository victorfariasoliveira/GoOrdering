import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'docker',
      database: 'ordering',
      entities: [ProductEntity],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
