import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity'; 
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), LogsModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
