import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), LogsModule], 
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], 
})
export class CategoriesModule {}
