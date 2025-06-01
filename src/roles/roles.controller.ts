import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo Rol' })
  @ApiBody({
    type: CreateRoleDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los Roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Rol por ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Rol por ID' })
  @ApiBody({
    type: UpdateRoleDto,
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar Rol por ID' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
  @Delete()
  @ApiOperation({ summary: 'Eliminar todos los Roles' })
  deleteAll() {
    return this.rolesService.deleteAll();
  }
  @Post('create-if-not-exists')
  @ApiOperation({ summary: 'Crear Rol si no existe' })
  createIfNotExists(@Body('name') name: string) {
    return this.rolesService.createIfNotExists(name);
  }
}
