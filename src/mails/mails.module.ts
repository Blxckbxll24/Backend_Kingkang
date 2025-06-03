import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity'; // Import Mail entity
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mail]), LogsModule], // Import Mail entity
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService], // Export MailsService for use in other modules
})
export class MailsModule {}
