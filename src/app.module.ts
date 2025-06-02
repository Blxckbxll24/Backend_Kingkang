import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart_items/cart_items.module';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';
import { OrderItem } from './order_items/entities/order_item.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './cart_items/entities/cart_item.entity';
import { Category } from './categories/entities/category.entity';
import { SessionsModule } from './sessions/sessions.module';
import { LogsModule } from './logs/logs.module';
import { LogsService } from './logs/logs.service';
import { LogEntity } from './logs/entities/log.entity';
import { SessionEntity } from './sessions/entities/session.entity';
import { FileUploadModule } from './file-upload/file-upload.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 8889,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, Order, Product, OrderItem, Cart, CartItem,Category,LogEntity, SessionEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    OrderItemsModule,
    CartsModule,
    CartItemsModule,
    LogsModule,
    SessionsModule,
    FileUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
