import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateProgressOrderDto {
    @ApiProperty({ example: 1, description: 'Идентификатор проекта' })
    @IsNotEmpty()
    @IsNumber()
    projectId: number;

    @ApiProperty({ example: [1, 3, 2], description: 'Новый порядок идентификаторов прогресс-типов' })
    @IsArray()
    @IsNumber({}, { each: true })
    progressTypeOrder: number[];
}
