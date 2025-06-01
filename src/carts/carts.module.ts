import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart_items/entities/cart_item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User]), LogsModule], // Add your Cart entity here
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService], // Export CartsService if needed in other modules
})
export class CartsModule {}
