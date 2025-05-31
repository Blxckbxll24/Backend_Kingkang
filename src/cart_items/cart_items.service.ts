import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity';
import { Repository } from 'typeorm';
import { Cart } from 'src/carts/entities/cart.entity';

@Injectable()
export class CartItemsService {
  constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>,
@InjectRepository(Cart) private cartRepo: Repository<Cart>
) {}



  async findOne(id: number) {
    const cart = await this.cartRepo.findOne({ where: { userId: id } });
    if (!cart) {
      throw new NotFoundException(`carrito con id ${id} no encontrado, o esta vacío`);
    }
    return this.repo.findOne({
      where: { cartId: cart?.id },
      relations: ['product'],
    });
  }

  async clearCart(id: number) {
    const cart = await this.cartRepo.findOne({ where: { userId: id } });
    if (!cart) {
      throw new NotFoundException(`carrito con id ${id} no encontrado`);
    }
    await this.repo.delete({ cartId: cart.id });
    
    return { message: 'Carrito vaciado correctamente' };
  }

}
