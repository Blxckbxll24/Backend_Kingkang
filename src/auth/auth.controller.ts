import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerDto: RegisterUserDto) {
    if (!registerDto.roleId) {
      registerDto.roleId = 2;
      registerDto.isActive = true;
    }
    return this.usersService.create(registerDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginUserDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@Body('token') token: string) {
    return this.authService.logout(token);
  }
}
