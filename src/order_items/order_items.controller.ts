import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('order-items')

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}


  @Get()
  @ApiOperation({ summary: 'Obtener todos los Order Items' })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Order Item por ID' })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }
  
}
