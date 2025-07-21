import { IsEmail, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMailDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    phone: string;
    @ApiProperty()
    @IsString()
    message: string;
    @ApiProperty()
    @IsString()
    status: string; // 'pending', 'sent', 'error
}
