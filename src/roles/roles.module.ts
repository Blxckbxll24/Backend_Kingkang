import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]),LogsModule], // Add your Role entity here
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], // Export RolesService if needed in other modules
})
export class RolesModule {}
