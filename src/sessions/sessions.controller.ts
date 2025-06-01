import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('sessions')

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
    @ApiOperation({ summary: 'Crear nueva sesión' })
  async createSession(
    @Body('userId') userId: number,
    @Body('token') token: string,
  ) {
    return this.sessionsService.create(userId, token);
  }

  @Patch('expire/:token')
    @ApiOperation({ summary: 'Expirar sesión por token' })
  async expireSession(@Param('token') token: string) {
    return this.sessionsService.expireSession(token);
  }

  @Get('validate/:token')
    @ApiOperation({ summary: 'Validar token de sesión' })
  async validateToken(@Param('token') token: string) {
    return this.sessionsService.validateToken(token);
  }
  @Get()
    @ApiOperation({ summary: 'Obtener todas las sesiones' })
  async findAll() {
    return this.sessionsService.findAll();
  }

}
