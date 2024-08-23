import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @ApiOperation({summary: "Создание пользователя"})
    @ApiResponse({status:200 , type: User})
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateUserDto){
        return this.userService.createUser(dto)
    }

    @ApiOperation({summary: "Создание пользователя"})
    @ApiResponse({status:200 , type: [User]})
    @UseGuards(JwtAuthGuard)
    @Get()
    getUser(){
        return this.userService.getUser()
    }

    @ApiOperation({summary: "Изменение пользователя"})
    @ApiResponse({status: 200 , type: User})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateUser(@Param("id") id: number , @Body() dto: CreateUserDto){
        return this.userService.updateUser(id , dto)
    }

    @ApiOperation({summary: "Удаление пользователя"})
    @ApiResponse({status: 200 , type: User})
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteUser(@Param("id") id: number){
        return this.userService.deleteUser(id)
    }
}
