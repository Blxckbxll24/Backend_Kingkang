import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogsModule } from 'src/logs/logs.module';
import { SessionsModule } from 'src/sessions/sessions.module'; // Assuming you have a SessionsModule for session management
import { LogEntity } from 'src/logs/entities/log.entity';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    LogsModule,
    SessionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    // Assuming you have a SessionsModule for session management
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule], // Export AuthService and JwtModule for use in other modules
})
export class AuthModule { }

