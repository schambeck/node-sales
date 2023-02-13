import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class OrderDto {
  id: number;
  @IsNotEmpty({ message: 'Issued Date is required' })
  issuedDate: string;
  @IsNotEmpty({ message: 'Product is required' })
  product: string;
  @IsPositive({ message: 'Total must be positive' })
  total: number;
}

@Controller('orders')
export class OrderController {
  constructor(private service: OrderService) {}

  @Post()
  async create(@Body() order: OrderDto) {
    return await this.service.create(order);
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() order: OrderDto) {
    return await this.service.update(id, order);
  }
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.service.delete(id);
  }
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.service.findById(id);
  }
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return await this.service.findAll(query);
  }
}
