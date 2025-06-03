import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mail } from './entities/mail.entity';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class MailsService {
  constructor(
    @InjectRepository(Mail) private repo: Repository<Mail>,
    private readonly logsService: LogsService,
  ) { }
  async create(createMailDto: CreateMailDto) {
    const mail = await this.repo.create(createMailDto)
    await this.repo.save(mail)
    return this.repo.findOne({
      where: { id: mail.id }
    });
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id: id } });
  }


  async remove(id: number) {
    const mail = await this.repo.findOne({ where: { id } });
    if (!mail) {
      await this.logsService.log('removeMail', `Intento de eliminar mail con id ${id} no encontrado`, undefined);
      throw new HttpException(`Mail con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }
    await this.logsService.log('removeMail', `Mail con id ${id} eliminado`, mail.userId);
    await this.repo.softRemove(mail);
    return {
      message: `Mail con id ${id} eliminado correctamente`
    };
  }
  async restore(id: number) {
    const mail = await this.repo.findOne({ where: { id }, withDeleted: true });
    if (!mail) {
      await this.logsService.log('restoreMail', `Intento de restaurar mail con id ${id} no encontrado`, undefined);
      throw new HttpException(`Mail con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }
    await this.logsService.log('restoreMail', `Mail con id ${id} restaurado`, mail.userId);
    await this.repo.restore(id);
    return {
      message: `Mail con id ${id} restaurado correctamente`
    };
  }
}
