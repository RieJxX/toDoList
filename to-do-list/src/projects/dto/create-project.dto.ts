import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateProjectDto{
    @ApiProperty({example:"Work" , description: "Название проекта"})
    @IsString({message: "Должно быть строкой"})
    readonly name: string
    @ApiProperty({example:"Something" , description: "Описание проекта"})
    @IsString({message: "Должно быть строкой"})
    readonly description : string
}