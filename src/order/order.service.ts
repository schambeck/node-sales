import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Order } from './order.entity';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}
  async create(order: Order): Promise<Order> {
    return await this.orderRepository.save(this.orderRepository.create(order));
  }
  async update(id: number, order: Order): Promise<Order> {
    return await this.orderRepository.save(this.orderRepository.merge(order));
  }
  async delete(id: number): Promise<DeleteResult> {
    return await this.orderRepository.delete({ id: id });
  }
  async findById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: id });
    if (order === null) {
      throw new EntityNotFoundException(`Order not found: ${id}`);
    }
    return order;
  }
  async findAll(query: PaginateQuery): Promise<Paginated<Order>> {
    return await paginate(query, this.orderRepository, {
      maxLimit: query.limit,
      sortableColumns: ['id', 'product', 'total'],
      searchableColumns: ['id', 'product', 'total'],
      defaultSortBy: [['product', 'ASC']],
      relativePath: true,
    });
  }
}
