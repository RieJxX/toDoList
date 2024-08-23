import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateTaskDto{
    @ApiProperty({ example: "Presentation", description: 'Название проекта' })
    @IsString({message: "Должно быть строкой"})
    readonly name : string
    @ApiProperty({ example: "Something", description: 'Описание проекта' })
    @IsString({message: "Должно быть строкой"})
    readonly description: string
    @ApiProperty({ example: 1, description: 'Идентификатор типа прогресса' })
    @IsString({message: "Должно быть числом"})
    readonly progressTypeId: number
}