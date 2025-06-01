import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { Repository } from 'typeorm';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    private readonly logsService: LogsService,
  ) {}

  async create(userId: number, token: string) {
    const session = this.sessionRepo.create({ userId, token });
    const savedSession = await this.sessionRepo.save(session);
    await this.logsService.log('createSession', `Sesión creada para usuario ${userId} con token ${token}`);
    return savedSession;
  }

  async expireSession(token: string) {
    const result = await this.sessionRepo.update({ token }, { isExpired: true });
    if ((result.affected ?? 0) > 0) {
      await this.logsService.log('expireSession', `Sesión con token ${token} expiró`);
    } else {
      await this.logsService.log('expireSession', `Intento de expirar sesión no encontrada con token ${token}`);
    }
    return result;
  }

  async validateToken(token: string) {
    const session = await this.sessionRepo.findOne({ where: { token, isExpired: false } });
    if (session) {
      await this.logsService.log('validateToken', `Token válido: ${token}`);
    } else {
      await this.logsService.log('validateToken', `Token inválido o expirado: ${token}`);
    }
    return session;
  }
    async findAll() {
        const sessions = await this.sessionRepo.find({ where: { isExpired: false } });
        await this.logsService.log('findAllSessions', `Se obtuvieron ${sessions.length} sesiones activas`);
        return sessions;
    }
}
