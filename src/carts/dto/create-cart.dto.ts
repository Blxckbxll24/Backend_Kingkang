import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCartDto {
    @ApiProperty()
    @IsInt()
    userId: number;
    @ApiProperty()
    @IsInt()
    productId: number;
    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity: number;
}
