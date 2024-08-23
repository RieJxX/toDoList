import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateProgressTypeDto{
    @ApiProperty({example:"Done" , description: "Название типа прогресса"})
    @IsString({message: "Должно быть строкой"})
    readonly name : string
    readonly projectId : number
}