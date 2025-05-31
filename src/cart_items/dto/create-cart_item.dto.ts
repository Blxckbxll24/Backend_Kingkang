import { IsDecimal, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    userId: number;
    
    @ApiProperty()
    @IsDecimal()
    @IsNotEmpty()
    price: number;
}
