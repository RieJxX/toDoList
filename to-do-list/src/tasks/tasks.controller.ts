import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { ReadProjectAndTypeDto } from './dto/read-project-and-type.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService : TasksService){}

    @ApiOperation({summary: "Полечение задач"})
    @ApiResponse({status:200 , type: [Tasks]})
    @UseGuards(JwtAuthGuard)
    @Get('get')
    async getTasks(@Req() req , @Body() dto : ReadProjectAndTypeDto){
        const userId = req.user.id
        return await this.tasksService.getTasks(dto , userId);
    }

    @ApiOperation({summary: "Создание задачи"})
    @ApiResponse({status:200 , type: Tasks})
    @UseGuards(JwtAuthGuard)
    @Post()
    createTask(@Req() req , @Body() dto : CreateTaskDto){
        const userId = req.user.id
        return this.tasksService.createTask(userId , dto);
    }

    @ApiOperation({summary: "Обновление порядка задачи"})
    @ApiResponse({status:200 , type: Tasks})
    @Put('move')
    @UseGuards(JwtAuthGuard)
    moveTask(@Req() req , @Body() moveTaskDto: MoveTaskDto ) {
        console.log('Request Object:', req); // Логируем весь запрос
        console.log('MoveTaskDto:', moveTaskDto); // Логируем только DTO
        const userId = req.user.id;
        console.log('UserId:', userId); // Логируем ID пользователя
        return this.tasksService.moveTask(userId, moveTaskDto);
    }

    @ApiOperation({summary: "Обновление задачи"})
    @ApiResponse({status:200 , type: Tasks})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateTask(@Param("id") id : number, @Req() req , @Body() dto : CreateTaskDto){
        const userId = req.user.id;
        return this.tasksService.updateTasks(id , dto  , userId)
    }

    @ApiOperation({summary: "Удаление задачи"})
    @ApiResponse({status:200})
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteTask(@Param("id") id : number , @Req() req , @Body() dto : ReadProjectAndTypeDto){
        const userId = req.user.id
        return this.tasksService.deleteTasks(id , dto , userId);
    }
}
