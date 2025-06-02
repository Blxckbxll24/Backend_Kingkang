import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsService } from './logs.service';
import { LogEntity } from './entities/log.entity';
import { LogsController } from './logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [LogsService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
