import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart_items/entities/cart_item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private repo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly logsService: LogsService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const { userId, productId, quantity } = createCartDto;

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      await this.logsService.log('createCart', `Producto ${productId} no encontrado`, userId);
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
      await this.logsService.log('createCart', `Carrito creado para usuario ${userId}`, userId);
    }

    await this.userRepo.update(userId, { cartId: cart.id });
    const itemExistente = cart.items.find((item) => item.productId === productId);

    if (itemExistente) {
      itemExistente.quantity += quantity;

      if (itemExistente.quantity > product.stock) {
        await this.logsService.log('createCart', `Intento de agregar más del stock disponible (${product.stock}) del producto ${productId}`, userId);
        throw new HttpException(
          `Cantidad solicitada excede el stock disponible para el producto con id ${productId}.`,
          HttpStatus.BAD_REQUEST
        );
      }

      await this.itemRepo.save(itemExistente);
      await this.logsService.log('createCart', `Producto ${productId} actualizado en carrito de usuario ${userId}`, userId);
    } else {
      const newItem = this.itemRepo.create({ productId, quantity, cartId: cart.id });
      await this.itemRepo.save(newItem);
      await this.logsService.log('createCart', `Producto ${productId} agregado al carrito de usuario ${userId}`, userId);
    }

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
      await this.logsService.log('decrementCartItem', `Item no encontrado en carrito ${cartId} para producto ${productId}`, undefined);
      throw new HttpException(`Item no encontrado en el carrito con id ${cartId} y producto ${productId}.`, HttpStatus.NOT_FOUND);
    }

    if (cartItem.quantity <= 1) {
      await this.itemRepo.remove(cartItem);
      await this.logsService.log('decrementCartItem', `Producto ${productId} eliminado del carrito ${cartId}`, undefined);
    } else {
      cartItem.quantity -= 1;
      await this.itemRepo.save(cartItem);
      await this.logsService.log('decrementCartItem', `Producto ${productId} decrementado en carrito ${cartId}`, undefined);
    }

    const items = await this.itemRepo.find({ where: { cartId }, relations: ['product'] });
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    await this.repo.update(cartId, { total });

    return this.repo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }

  async removeProductFromCart(cartId: number, productId: number) {
    const items = await this.itemRepo.find({ where: { cartId, productId } });

    if (!items.length) {
      await this.logsService.log('removeProductFromCart', `Intento de eliminar producto ${productId} no existente en carrito ${cartId}`, undefined);
      throw new HttpException(
        `No se encontraron productos con id ${productId} en el carrito ${cartId}.`,
        HttpStatus.NOT_FOUND
      );
    }

    await this.itemRepo.remove(items);
    await this.logsService.log('removeProductFromCart', `Producto ${productId} eliminado del carrito ${cartId}`, undefined);

    const remainingItems = await this.itemRepo.find({ where: { cartId }, relations: ['product'] });
    const total = remainingItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    await this.repo.update(cartId, { total });

    return this.repo.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });
  }
}
