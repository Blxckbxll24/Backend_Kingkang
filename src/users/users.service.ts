import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly logsService: LogsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = this.repo.create(createUserDto);
    const savedUser = await this.repo.save(user);
    await this.logsService.log('createUser', `Usuario creado con ID ${savedUser.id} y username ${savedUser.username}`);
    return savedUser;
  }

  async findAll() {
    const users = await this.repo.find({ relations: ['role'] });
    await this.logsService.log('findAllUsers', `Se obtuvieron ${users.length} usuarios`);
    return users;
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    await this.logsService.log('findUser', user ? `Usuario encontrado con ID ${id}` : `Usuario no encontrado con ID ${id}`);
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.repo.findOne({ where: { username }, relations: ['role'] });
    await this.logsService.log('findUserByUsername', user ? `Usuario encontrado con username ${username}` : `Usuario no encontrado con username ${username}`);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email }, relations: ['role'] });
    await this.logsService.log('findUserByEmail', user ? `Usuario encontrado con email ${email}` : `Usuario no encontrado con email ${email}`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    await this.repo.update(id, updateUserDto);
    const updatedUser = await this.repo.findOne({ where: { id } });
    await this.logsService.log('updateUser', updatedUser ? `Usuario actualizado con ID ${id}` : `Intento de actualizar usuario no encontrado con ID ${id}`);
    return updatedUser;
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    await this.logsService.log('removeUser', `Usuario eliminado con ID ${id}`);
    return result;
  }

  async deleteAll() {
    await this.repo.clear();
    await this.logsService.log('deleteAllUsers', `Todos los usuarios han sido eliminados`);
  }
}
