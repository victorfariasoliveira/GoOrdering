
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderDto, OrderUpdateDto } from './dtos/order.dto';
import { ProductEntity } from './entities/product.entity';
import { CustomerEntity } from './entities/customer.entity';
import { RpcException } from '@nestjs/microservices';
import { OrderProduct } from './interfaces/order.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>
  ) { }

  private readonly logger = new Logger(AppService.name)

  public async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find()
  }

  public async findById(order_id: number): Promise<any> {
    let order = await this.orderRepository.findOne(order_id)
    const product = await this.productRepository.findOne(order.product_id)
    return { ...order, product }
  }

  public async findAllByCustomerId(customer_id: number): Promise<any> {
    await this.validateCustomer(customer_id)

    const orders = await this.orderRepository.find({ where: { customer_id } })

    return Promise.all(
      orders.map(async (order: OrderEntity) => {
        const product = await this.productRepository.findOne(order.product_id)
        return { ...order, product }
      })
    )
  }

  public async create({ customer_id, product_id, qtd_product }: OrderDto): Promise<void> {
    let total: number

    await this.validateCustomer(customer_id)
    const product = await this.validateProduct(product_id)

    total = this.getTotalProducts(product.price, qtd_product)
    await this.orderRepository.save({ customer_id, product_id, qtd_product, total })
  }

  public async update({ order_id, product_id, qtd_product }: OrderUpdateDto): Promise<void> {
    const product = await this.validateProduct(product_id)
    const order = await this.orderRepository.findOne(order_id)

    order.product_id = product_id ? product_id : order.product_id
    order.qtd_product = qtd_product ? product_id : order.product_id;
    order.total = this.getTotalProducts(product.price, order.qtd_product)

    await this.orderRepository.save(order)
  }

  public async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id)
  }

  // PRIVATE METHODS

  private async validateCustomer(customer_id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne(customer_id)

    if (!customer) {
      const errorMessage = 'It is necessary to pass a valid user id'
      this.logger.error(errorMessage)
      throw new RpcException(errorMessage)
    }

    return customer
  }

  private async validateProduct(product_id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne(product_id)

    if (!product) {
      const errorMessage = 'It is necessary to pass a valid product id'
      this.logger.error(errorMessage)
      throw new RpcException(errorMessage)
    }

    return product
  }

  private getTotalProducts(product_price: number, qtd_product: number) {
    return product_price * qtd_product
  }
}