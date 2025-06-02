import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartItem } from './entities/cart_item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { LogsService } from '../logs/logs.service'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem) private repo: Repository<CartItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    private readonly logsService: LogsService,
  ) {}

  async findOne(id: number) {
    const cart = await this.cartRepo.findOne({ where: { userId: id } });

    if (!cart) {
      await this.logsService.log('findOneCartItem', `Carrito de usuario ${id} no encontrado`, id);
      throw new NotFoundException(`carrito con id ${id} no encontrado, o esta vacío`);
    }

    const item = await this.repo.findOne({
      where: { cartId: cart.id },
      relations: ['product'],
    });

    await this.logsService.log(
      'findOneCartItem',
      `Se buscó el contenido del carrito del usuario ${id}`,
      id,
    );

    return item;
  }

  async clearCart(id: number) {
    const cart = await this.cartRepo.findOne({ where: { userId: id } });

    if (!cart) {
      await this.logsService.log('clearCart', `Intento fallido de vaciar carrito del usuario ${id}`, id);
      throw new NotFoundException(`carrito con id ${id} no encontrado`);
    }

    await this.repo.delete({ cartId: cart.id });

    await this.logsService.log('clearCart', `Carrito del usuario ${id} vaciado`, id);

    return { message: 'Carrito vaciado correctamente' };
  }
}
