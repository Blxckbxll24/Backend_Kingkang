import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }


  @Patch(':cartId/products/:productId')
  async decrement(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartsService.decrement(cartId, productId);
  }

  @Delete(':cartId/products/:productId')
  async removeProduct(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    return await this.cartsService.removeProductFromCart(cartId, productId);
  }



}
