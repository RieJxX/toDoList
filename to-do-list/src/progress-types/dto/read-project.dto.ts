import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { IsNull } from "typeorm";

export class ReadProjectDto{
    @ApiProperty({ example: 1, description: 'Идентификатор проекта' })
    @IsNumber()
    readonly id : number
}