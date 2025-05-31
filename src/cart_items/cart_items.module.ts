import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity'; 
import { Cart } from 'src/carts/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem,Cart])], 
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService], 
})
export class CartItemsModule {}
