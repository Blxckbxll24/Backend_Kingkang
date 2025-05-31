import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../order_items/entities/order_item.entity'
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from 'src/cart_items/entities/cart_item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>
  ) { }
  async create(userId: number) {
    if (!userId) {
      throw new HttpException('El ID de usuario es requerido', HttpStatus.BAD_REQUEST);
    }
    const cart = await this.cartRepo.findOne({ where: { userId: userId }, relations: ['items', 'items.product'] });

    if (!cart || cart.items.length === 0) {
      throw new HttpException('El carrito está vació o no existe', HttpStatus.BAD_REQUEST);
    }

    const order = this.repo.create({
      userId,
      total: cart.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0,
      ),
      status: 'pending',
      items: cart.items.map((item) =>
        this.orderItemRepo.create({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        }),
      ),
    });
    console.log(order)
    await this.repo.save(order);
    await this.cartItemRepo.delete({ cartId: cart.id });
    return this.repo.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }

  findAll() {
    return this.repo.find({
      relations: ['items', 'items.product'],
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

 async  remove(id: number) {
  // const order = await this.repo.findOne({ where: { id } });
  // if (order) {
  //   order.items.forEach(item => {
  //     item.isActive = false;
  //     this.orderItemRepo.save(item);
  //   });
  //   this.repo.save(order);
  //   return order;
  // }
  // throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  return  'hola mundo';
  }


}
