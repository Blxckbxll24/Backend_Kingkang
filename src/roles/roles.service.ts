import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private repo: Repository<Role>,
    private readonly logsService: LogsService
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.repo.create(createRoleDto);
    const savedRole = await this.repo.save(role);
    await this.logsService.log('createRole', `Rol creado con id ${savedRole.id}`);
    return savedRole;
  }

  async findAll() {
    const roles = await this.repo.find({ relations: ['users'] });
    await this.logsService.log('findAllRoles', `Se listaron ${roles.length} roles`);
    return roles;
  }

  async findOne(id: number) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) {
      await this.logsService.log('findOneRole', `Rol con id ${id} no encontrado`);
      throw new Error(`Rol con id ${id} no encontrado`);
    }
    await this.logsService.log('findOneRole', `Rol con id ${id} consultado`);
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const result = await this.repo.update(id, updateRoleDto);
    if (result.affected === 0) {
      await this.logsService.log('updateRole', `Intento de actualizar rol no encontrado con id ${id}`);
      throw new Error(`Rol con id ${id} no encontrado`);
    }
    await this.logsService.log('updateRole', `Rol con id ${id} actualizado`);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      await this.logsService.log('removeRole', `Intento de eliminar rol no encontrado con id ${id}`);
      throw new Error(`Rol con id ${id} no encontrado`);
    }
    await this.logsService.log('removeRole', `Rol con id ${id} eliminado`);
    return { message: `Rol con id ${id} eliminado` };
  }

  async deleteAll() {
    await this.repo.clear();
    await this.logsService.log('deleteAllRoles', `Se eliminaron todos los roles`);
    return { message: 'Todos los roles eliminados' };
  }

  async createIfNotExists(name: string) {
    let role = await this.repo.findOne({ where: { name } });
    if (!role) {
      role = this.repo.create({ name });
      await this.repo.save(role);
      await this.logsService.log('createRoleIfNotExists', `Rol creado con nombre ${name}`);
    } else {
      await this.logsService.log('createRoleIfNotExists', `Rol con nombre ${name} ya existe`);
    }
    return role;
  }
}
