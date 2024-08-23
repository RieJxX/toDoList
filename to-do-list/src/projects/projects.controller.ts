import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Project } from './projects.entity';

@Controller('projects')
export class ProjectsController {

    constructor(private projectService : ProjectsService){}

    @ApiOperation({summary: "Получение проектов"})
    @ApiResponse({status:200 , type: [Project]})
    @UseGuards(JwtAuthGuard)
    @Get()
    getProjects(@Req() req){
        const user = req.user;
        return this.projectService.getProjets(user)
    }

    @ApiOperation({summary: "Создание проекта"})
    @ApiResponse({status:200 , type: Project})
    @UseGuards(JwtAuthGuard)
    @Post()
    createProject(@Body() dto: CreateProjectDto , @Req() req){
        const user = req.user;
        return this.projectService.createProject(dto , user)
    }

    @ApiOperation({summary: "Обновление проекта"})
    @ApiResponse({status:200 , type: Project})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateProject(@Param('id') id: number , @Body() dto: CreateProjectDto , @Req() req){
        const userId = req.user.id;
        console.log(req.user.id)
        return this.projectService.updateProject(id , dto , userId)
    }

    @ApiOperation({summary: "Удаление проекта"})
    @ApiResponse({status:200})
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteProject(@Param('id') id: number , @Req() req){
        const userId = req.user.id
        return this.projectService.deleteProject(id , userId)
    }
}
