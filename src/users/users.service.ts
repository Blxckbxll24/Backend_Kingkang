import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }
  create(createUserDto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    const user = this.repo.create(createUserDto)
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({ relations: ['role'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username }, relations: ['role'] });
  }
async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['role'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    await this.repo.update(id, updateUserDto)
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
  deleteAll() {
    return this.repo.clear();
  }
}
