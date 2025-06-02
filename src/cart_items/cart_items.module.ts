import { Module } from '@nestjs/common';
import { CartItemsService } from './cart_items.service';
import { CartItemsController } from './cart_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity'; 
import { Cart } from '../carts/entities/cart.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem,Cart]),LogsModule], // Import CartItem and Cart entities
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService], 
})
export class CartItemsModule {}
