import { Test } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

jest.mock('nestjs-paginate', () => ({
  paginate: jest.fn().mockResolvedValueOnce({
    data: [{ id: 1, issuedDate: '2023-02-09', product: 'A', total: 1234.56 }],
  }),
}));

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useClass: Repository },
      ],
    }).compile();

    orderRepository = moduleRef.get<Repository<Order>>(
      getRepositoryToken(Order),
    );
    orderService = moduleRef.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('should return a Promise of Order', async () => {
      const payload = {
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      const result = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      jest.spyOn(orderRepository, 'create').mockImplementation(() => result);
      jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(Promise.resolve(result));
      expect(await orderService.create(payload)).toBe(result);
    });
  });

  describe('update', () => {
    it('should return a Promise of Order', async () => {
      const payload = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      const result = {
        id: 1,
        issuedDate: '2023-02-09',
        product: 'ABC',
        total: 1234.5,
      } as Order;
      jest.spyOn(orderRepository, 'merge').mockImplementation(() => result);
      jest
        .spyOn(orderRepository, 'save')
        .mockResolvedValueOnce(Promise.resolve(result));
      expect(await orderService.update(1, payload)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should return an Affected rows', async () => {
      const result = { affected: 1 } as DeleteResult;
      jest
        .spyOn(orderRepository, 'delete')
        .mockResolvedValueOnce(Promise.resolve(result));
      expect(await orderService.delete(1)).toBe(result);
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
      expect(await orderService.findById(1)).toBe(result);
    });
  });

  describe('findByIdNotFound', () => {
    it('should fail', async () => {
      jest
        .spyOn(orderRepository, 'findOneBy')
        .mockResolvedValueOnce(Promise.resolve(null));
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
      const query = { page: 1, limit: 5 } as PaginateQuery;
      expect(await orderService.findAll(query)).toStrictEqual(result);
    });
  });
});
