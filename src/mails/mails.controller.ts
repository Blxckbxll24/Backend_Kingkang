import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailsService } from './mails.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post()
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailsService.create(createMailDto);
  }

  @Get()
  findAll() {
    return this.mailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailsService.remove(+id);
  }
  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.mailsService.restore(+id);
  }
}
