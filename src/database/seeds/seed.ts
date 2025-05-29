
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { UsersService } from '../../users/users.service';
import { RolesService } from '../../roles/roles.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const usersService = app.get(UsersService);
  const rolesService = app.get(RolesService);

  console.log('Corriendo semillas...');

  const adminRole = await rolesService.createIfNotExists('admin');
  const userRole = await rolesService.createIfNotExists('cliente');

  const existing = await usersService.findByEmail('admin@example.com');
  if (!existing) {
    const password = await bcrypt.hash('123456', 10);
    await usersService.create({
      username: 'admin',
      email: 'admin@example.com',
      password,
      roleId: adminRole.id,
    });
    console.log('Admin creado');
  } else {
    console.log('Admin ya existe');
  }

  await app.close();
}

bootstrap();
