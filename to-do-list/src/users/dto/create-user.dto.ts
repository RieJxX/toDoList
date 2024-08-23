import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto{
    @ApiProperty({example: "ivanov.ivan@gmail.com" , description: "Электронная почта пользователя"})
    @IsString({message: "Должно быть строкой"})
    @IsEmail({} , {message: "Некорректный email"})
    readonly email: string
    @ApiProperty({example: "123456789" , description: "Пароль пользователя"})
    @IsString({message: "Должно быть строкой"})
    @Length(8 , 14  , {message: "Длина пароля от 8 до 14 символов"})
    readonly password: string
}