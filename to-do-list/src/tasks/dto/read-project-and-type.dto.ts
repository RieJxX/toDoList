import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class ReadProjectAndTypeDto{
    @ApiProperty({ example: 2, description: 'Идентификатор типа прогресса' })
    @IsNumber()
    readonly projectId : number

    @ApiProperty({ example: 3, description: 'Порядковый номер задачи' })
    @IsNumber()
    readonly progressId : number
}