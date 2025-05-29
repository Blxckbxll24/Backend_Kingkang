import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.repo.create(createRoleDto);
    return this.repo.save(role);
  }

  findAll() {
    return this.repo.find({ relations: ['users'] });
  }

  findOne(id: number) {
    return this.repo.findOne({where: { id }});
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.repo.update(id, updateRoleDto)
    return this.repo.findOne({where: { id }});
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
  deleteAll() {
    return this.repo.clear();
  }

  async createIfNotExists(name: string) {
  let role = await this.repo.findOne({ where: { name } });
  if (!role) {
    role = this.repo.create({ name });
    await this.repo.save(role);
  }
  return role;
}
}
