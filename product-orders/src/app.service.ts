import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(AppService.name)

  async findAll(): Promise<ProductEntity[]> {
    try {
      return this.productRepository.find();
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  async create(product: ProductDto): Promise<void> {
    try {
      await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  public async update({ id, name, price }: ProductUpdateDto): Promise<void> {
    try {
      const product = await this.productRepository.findOne(id)

      product.name = name ? name : product.name
      product.price = price ? price : product.price

      await this.productRepository.save(product)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.productRepository.delete(id)
    } catch (error) {
      this.logger.error(JSON.stringify(error))
      throw error
    }
  }
}
