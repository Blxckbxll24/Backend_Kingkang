import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({required: false })
    @IsEmail()
    email?: string;

    @ApiProperty({required: false })
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({required: false })
    @IsNotEmpty()
    roleId?: number;
}
