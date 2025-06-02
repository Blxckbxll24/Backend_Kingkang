import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';
import { SessionsService } from '../sessions/sessions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsService,
    private readonly sessionsService: SessionsService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      await this.logsService.log('validateUser', `Correo inválido: ${email}`);
      throw new UnauthorizedException('Correo inválido');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.logsService.log('validateUser', `Contraseña incorrecta para: ${email}`);
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const { password: _, ...result } = user;
    await this.logsService.log('validateUser', `Usuario autenticado correctamente: ${email}`);
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.roleId };
    const token = this.jwtService.sign(payload);

    // Crear sesión
    await this.sessionsService.create(user.id, token);

    // Registrar log de login
    await this.logsService.log('login', `Usuario ${user.email} inició sesión correctamente.`);

    return {
      access_token: token,
    };
  }

  async logout(token: string) {
    const result = await this.sessionsService.expireSession(token);
    if ((result.affected ?? 0) > 0) {
      await this.logsService.log('logout', `Sesión cerrada para token: ${token}`);
    } else {
      await this.logsService.log('logout', `No se encontró sesión activa para token: ${token}`);
    }
    return {
      message: 'Sesión finalizada',
    };
  }
}
