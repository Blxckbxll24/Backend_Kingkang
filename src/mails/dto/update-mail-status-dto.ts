import { IsEmail, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class updateMailStatusDto {
    @ApiProperty()
    @IsString()
    status: string; // 'pending', 'sent', 'error
}
