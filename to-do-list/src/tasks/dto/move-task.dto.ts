// src/tasks/dto/move-task.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MoveTaskDto {
    @ApiProperty({ example: 1, description: 'Идентификатор задачи' })
    @IsNotEmpty()
    @IsNumber()
    taskId: number;

    @ApiProperty({ example: 2, description: 'Идентификатор нового типа прогресса (если требуется)' })
    @IsOptional()
    @IsNumber()
    newProgressTypeId?: number;

    @ApiProperty({ example: 3, description: 'Новый порядковый номер задачи' })
    @IsNotEmpty()
    @IsNumber()
    newOrder: number;
}
