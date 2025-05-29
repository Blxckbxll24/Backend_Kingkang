import { IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterUserDto {
    @ApiProperty()
    @IsString()
    username: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    password: string;
    @IsNotEmpty()
    roleId: number;
    @IsNotEmpty()
    isActive: boolean;

}