import { Test } from '@nestjs/testing';
import { OrderController, OrderDto } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useClass: Repository },
      ],
    }).compile();

    orderRepository = moduleRef.get<Repository<Order>>(
      getRepositoryToken(Order),
    );
    orderService = moduleRef.get<OrderService>(OrderService);
    orderController = moduleRef.get<OrderController>(OrderController);
  });

  describe('create', () => {
    it('should return a Promise of Order', async () => {
      const payload = {
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as OrderDto;
      const result = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(Promise.resolve(result));
      jest
        .spyOn(orderService, 'create')
        .mockImplementation(() => Promise.resolve(result));
      expect(await orderController.create(payload)).toBe(result);
    });
  });

  describe('update', () => {
    it('should return a Promise of Order', async () => {
      const payload = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as OrderDto;
      const result = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(Promise.resolve(result));
      jest
        .spyOn(orderService, 'update')
        .mockImplementation(() => Promise.resolve(result));
      expect(await orderController.update(1, payload)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should return an Affected rows', async () => {
      const result = { affected: 1 } as DeleteResult;
      jest
        .spyOn(orderRepository, 'delete')
        .mockResolvedValueOnce(Promise.resolve(result));
      jest
        .spyOn(orderService, 'delete')
        .mockImplementation(() => Promise.resolve(result));
      expect(await orderController.delete(1)).toBe(void 0);
    });
  });

  describe('findById', () => {
    it('should return a Promise of Order', async () => {
      const result = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'A',
        total: 1234.56,
      } as Order;
      jest
        .spyOn(orderRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(result));
      jest
        .spyOn(orderService, 'findById')
        .mockImplementation(() => Promise.resolve(result));
      expect(await orderController.findById(1)).toBe(result);
    });
  });

  describe('findByIdNotFound', () => {
    it('should fail', async () => {
      jest
        .spyOn(orderRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null));
      jest
        .spyOn(orderService, 'findById')
        .mockRejectedValueOnce(
          new EntityNotFoundException('Order not found: 1'),
        );
      await expect(orderService.findById(1)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a Paginated of Order', async () => {
      const result = {
        data: [
          { id: 1, issuedDate: '2023-02-09', product: 'A', total: 1234.56 },
        ],
      } as Paginated<Order>;
      jest
        .spyOn(orderRepository, 'find')
        .mockResolvedValueOnce(Promise.resolve(result.data));
      jest
        .spyOn(orderService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));
      const query = { page: 1, limit: 5 } as PaginateQuery;
      expect(await orderController.findAll(query)).toBe(result);
    });
  });
});
