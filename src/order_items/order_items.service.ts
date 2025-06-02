import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order_item.entity';
import { Order } from '../orders/entities/order.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem) private repo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private readonly logsService: LogsService,
  ) {}

  async findAll() {
    const items = await this.repo.find({
      relations: ['order', 'product'],
    });
    await this.logsService.log('findAllOrderItems', `Se listaron ${items.length} items de orden`, undefined);
    return items;
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!item) {
      await this.logsService.log('findOneOrderItem', `Item de orden con id ${id} no encontrado`, undefined);
      throw new NotFoundException(`Item de orden con id ${id} no encontrado`);
    }
    await this.logsService.log('findOneOrderItem', `Se consultó item de orden id ${id}`, undefined);
    return item;
  }
}
