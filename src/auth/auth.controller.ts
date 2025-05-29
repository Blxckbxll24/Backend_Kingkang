import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }
    @Post('register')
    @ApiBody({ type: RegisterUserDto })
    register(@Body() registerDto: RegisterUserDto) {
        if (!registerDto.roleId) {
            registerDto.roleId = 2;
            registerDto.isActive = true // asigna manualmente si no viene en el body
        }
        return this.usersService.create(registerDto);
    }

    @Post('login')
    @ApiBody({
        type: LoginDto,
    })
    login(@Body() loginUserDto: LoginDto) {
        console.log(process.env.JWT_SECRET);
        const user = this.authService.validateUser(loginUserDto.email, loginUserDto.password);
        return this.authService.login(user);
    }
}
