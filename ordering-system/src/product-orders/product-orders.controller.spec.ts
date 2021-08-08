import { Test, TestingModule } from '@nestjs/testing';
import { ProductOrdersController } from './product-orders.controller';

describe('ProductOrdersController', () => {
  let controller: ProductOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOrdersController],
    }).compile();

    controller = module.get<ProductOrdersController>(ProductOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
