import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post(':userId')
  @ApiOperation({ summary: 'Crear nueva Order' })
  create(@Param('userId') id: number) {
    return this.ordersService.create(+id);
  }

  @Get()
@ApiOperation({ summary: 'Obtener todas las Orders' })
  findAll() {
    return this.ordersService.findAll();
  }

   @Get('getDeletedOrders')
@ApiOperation({ summary: 'Obtener todas las Orders eliminadas' })
  async getDeletedOrders() {
    return this.ordersService.findAllDeleted();
  }

  @Get(':id')
@ApiOperation({ summary: 'Obtener Order por ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
@ApiOperation({ summary: 'Eliminar Order por ID' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
  @Patch(':id')
@ApiOperation({ summary: 'Restaurar Order por ID' })
  restore(@Param('id') id: string) {
    return this.ordersService.restore(+id);
  }

 

}
