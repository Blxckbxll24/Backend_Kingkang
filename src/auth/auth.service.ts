import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return new UnauthorizedException('Invalid email');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new UnauthorizedException('Invalid password');
        }
        const { password: _, ...result } = user;
        return result;

    }
    async login(user:any ){
        const payload = { email: user.email, sub: user.id, role: user.roleId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
