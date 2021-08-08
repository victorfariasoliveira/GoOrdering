import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { ProductDto, ProductUpdateDto } from './dtos/product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) { }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async create(product: ProductDto): Promise<void> {
    await this.productRepository.save(product);
  }

  public async update({ id, name, price }: ProductUpdateDto): Promise<void> {
    const product = await this.productRepository.findOne(id)

    product.name = name ? name : product.name
    product.price = price ? price : product.price

    await this.productRepository.save(product)
  }

  public async delete(id: number): Promise<void> {
    await this.productRepository.delete(id)
  }
}
