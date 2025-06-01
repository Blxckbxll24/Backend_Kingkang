import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('cart-items')

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}



  @Get(':id')
  @ApiOperation({ summary: 'Obtener todos los Cart Items por ID de Carrito' })
  findOne(@Param('id') id: string) {
    return this.cartItemsService.findOne(+id);
  }
  @Delete('clear/:id')
  @ApiOperation({ summary: 'Limpiar todos los Cart Items por ID de Carrito' })
  clearCart(@Param('id') id: string) {
    return this.cartItemsService.clearCart(+id);
  }


}
