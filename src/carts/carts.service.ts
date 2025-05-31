import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../cart_items/entities/cart_item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private repo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) { }
  async create(createCartDto: CreateCartDto) {
    const { userId, productId, quantity } = createCartDto;

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new HttpException(`Producto con id ${productId} no encontrado.`, HttpStatus.BAD_REQUEST);
    }

    let cart = await this.repo.findOne({
      where: { userId, isOrdered: false },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.repo.create({ userId, items: [] });
      cart = await this.repo.save(cart);

      await this.userRepo.update(userId, { cartId: cart.id });
      console.log('cart created', cart);
    }
    await this.userRepo.update(userId, { cartId: cart.id });
    const itemExistente = cart.items.find((item) => item.productId === productId);

    if (itemExistente) {
      itemExistente.quantity += quantity;
      // Verificar que la cantidad no exceda el stock del producto
      if (itemExistente.quantity > product.stock) {
        throw new HttpException(
          `Cantidad solicitada excede el stock disponible para el producto con id ${productId}. Stock disponible: ${product.stock}`,
          HttpStatus.BAD_REQUEST
        );
      }
      await this.itemRepo.save(itemExistente);
    } else {
      const newItem = this.itemRepo.create({ productId, quantity, cartId: cart.id });
      await this.itemRepo.save(newItem);
    }

    // Recalcular total
    const items = await this.itemRepo.find({ where: { cartId: cart.id }, relations: ['product'] });
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    await this.repo.update(cart.id, { total });

    return this.repo.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    });
  }


  findOne(id: number) {

    return this.repo.findOne({ where: { id }, relations: ['items', 'items.product'] });
  }

  async decrement(cartId: number, productId: number) {
    const cartItem = await this.itemRepo.findOne({ where: { cartId, productId }, relations: ['product'] });

    if (!cartItem) {
      throw new HttpException(`Item no encontrado en el carrito con id ${cartId} y producto ${productId}.`, HttpStatus.NOT_FOUND);
    }

    if (cartItem.quantity <= 1) {
      await this.itemRepo.remove(cartItem);
    } else {
      cartItem.quantity -= 1;
      await this.itemRepo.save(cartItem);
    }

    // Recalcular total del carrito
    const items = await this.itemRepo.find({ where: { cartId }, relations: ['product'] });
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    await this.repo.update(cartId, { total });

    return this.repo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
    if (!cartItem) {
      throw new HttpException(`Item no encontrado en el carrito con id ${cartId} y producto ${productId}.`, HttpStatus.NOT_FOUND);
    }
  }

  async removeProductFromCart(cartId: number, productId: number) {
    const items = await this.itemRepo.find({ where: { cartId, productId } });

    if (!items.length) {
      throw new HttpException(
        `No se encontraron productos con id ${productId} en el carrito ${cartId}.`,
        HttpStatus.NOT_FOUND
      );
    }

    await this.itemRepo.remove(items);

    // Recalcular total del carrito
    const remainingItems = await this.itemRepo.find({ where: { cartId }, relations: ['product'] });
    const total = remainingItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    await this.repo.update(cartId, { total });

    return this.repo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }
}
