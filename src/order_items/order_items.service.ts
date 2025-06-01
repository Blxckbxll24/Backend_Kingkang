import { Injectable } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order_item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem) private repo : Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>

  ) {}

  findAll() {
    return this.repo.find({
      relations: ['order', 'product'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id: id },
      relations: ['order', 'product'],
    });
  }
}
