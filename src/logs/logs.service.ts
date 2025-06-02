import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepo: Repository<LogEntity>,
  ) {}

  async log(action: string, message: string, userId?: number) {
    const log = this.logRepo.create({ action, message, userId });
    return this.logRepo.save(log);
  }

  findAll() {
    return this.logRepo.find({ order: { createdAt: 'DESC' } });
  }
}
