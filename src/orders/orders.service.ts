import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from '../order_items/entities/order_item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from 'src/cart_items/entities/cart_item.entity';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly logsService: LogsService,
  ) {}

  async create(userId: number) {
    if (!userId) {
      throw new HttpException('El ID de usuario es requerido', HttpStatus.BAD_REQUEST);
    }
    const cart = await this.cartRepo.findOne({ where: { userId }, relations: ['items', 'items.product'] });

    if (!cart || cart.items.length === 0) {
      await this.logsService.log('createOrder', `Intento de crear orden sin carrito o carrito vacío para usuario ${userId}`, userId);
      throw new HttpException('El carrito está vacío o no existe', HttpStatus.BAD_REQUEST);
    }

    const order = this.repo.create({
      userId,
      total: cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
      status: 'pending',
      items: cart.items.map((item) =>
        this.orderItemRepo.create({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          total: item.quantity * item.product.price,
        }),
      ),
    });

    await this.repo.save(order);
    await this.cartItemRepo.delete({ cartId: cart.id });

    await this.logsService.log('createOrder', `Orden creada con ID ${order.id} para usuario ${userId}`, userId);

    return this.repo.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }

  async findAll() {
    const orders = await this.repo.find({
      relations: ['items', 'items.product'],
    });
    await this.logsService.log('findAllOrders', `Se listaron ${orders.length} órdenes`);
    return orders;
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) {
      await this.logsService.log('findOneOrder', `ID inválido en findOne: ${id}`);
      throw new BadRequestException('El ID es inválido');
    }
    const order = await this.repo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      await this.logsService.log('findOneOrder', `Orden con id ${id} no encontrada`);
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.logsService.log('findOneOrder', `Consulta orden con id ${id}`);
    return order;
  }

  async remove(id: number) {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) {
      await this.logsService.log('removeOrder', `Intento de eliminar orden no encontrada con id ${id}`);
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.repo.softRemove(order);
    await this.logsService.log('removeOrder', `Orden con id ${id} eliminada (soft delete)`);
    return { message: 'Orden eliminada correctamente (soft delete)' };
  }

  async restore(id: number) {
    const order = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!order) {
      await this.logsService.log('restoreOrder', `Intento de restaurar orden no encontrada con id ${id}`);
      throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
    }
    await this.repo.restore(id);
    await this.logsService.log('restoreOrder', `Orden con id ${id} restaurada`);
    return { message: 'Orden restaurada correctamente' };
  }

  async findAllDeleted() {
    const deletedOrders = await this.repo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });
    await this.logsService.log('findAllDeletedOrders', `Se listaron ${deletedOrders.length} órdenes eliminadas`);
    return deletedOrders;
  }
}
