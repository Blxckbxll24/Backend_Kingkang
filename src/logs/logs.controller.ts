import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  @Post()
  createLog(
    @Body() body: { action: string; message: string; userId?: number },
  ) {
    return this.logsService.log(body.action, body.message, body.userId);
  }
}
