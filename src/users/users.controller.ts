import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo User' })
  @ApiBody({
    type: CreateUserDto
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los Users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener User por ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Obtener User por nombre de usuario' })
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener User por email' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar User por ID' })
  @ApiBody({
    type: UpdateUserDto
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar User por ID' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Delete()
  @ApiOperation({ summary: 'Eliminar todos los Users' })
  deleteAll() {
    return this.usersService.deleteAll();
  }
}
