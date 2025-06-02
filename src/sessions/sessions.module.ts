import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SessionEntity]),
        LogsModule
    ],
    providers: [SessionsService],
    exports: [SessionsService],
    controllers: [SessionsController],
})
export class SessionsModule { }
