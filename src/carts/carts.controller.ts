import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('carts')

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }


  @Post()
  @ApiOperation({ summary: 'Crear nuevo Carrito y agregar prodcutos' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }


  @Patch(':cartId/products/:productId')
  @ApiOperation({ summary: 'decrementar la cantidad de un producto uno por uno' })
  async decrement(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartsService.decrement(cartId, productId);
  }

  @Delete(':cartId/products/:productId')
  @ApiOperation({ summary: 'Eliminar Producto del Carrito sin importar cantidad' })
  async removeProduct(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
  ) {
    return await this.cartsService.removeProductFromCart(cartId, productId);
  }



}
