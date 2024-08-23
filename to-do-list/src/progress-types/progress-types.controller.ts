import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressTypesService } from './progress-types.service';
import { CreateProgressTypeDto } from './dto/create-progress-type.dto';
import { ProgressTypes } from './progress-types.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReadProjectDto } from './dto/read-project.dto';
import { Project } from 'src/projects/projects.entity';
import { UpdateProgressOrderDto } from './dto/update-progress-type-order.dto';


@ApiTags('Типы прогресса')
@Controller('progress-types')
export class ProgressTypesController {

    constructor(private progressTypesServise: ProgressTypesService) {}

    @ApiOperation({summary: "Создание типа прогресса"})
    @ApiResponse({status:200 , type: ProgressTypes})
    @UseGuards(JwtAuthGuard)
    @Post()
    createProgressType(@Body() dto: CreateProgressTypeDto , @Req() req){
        const id = req.user.id;
        return this.progressTypesServise.createProgressType(dto , id);
    }

    @ApiOperation({summary: "Получение типа прогресса пользователя"})
    @ApiResponse({status:200 , type: [ProgressTypes]})
    @UseGuards(JwtAuthGuard)
    @Get()
    getProgressTypes(@Req() req , @Body() project : ReadProjectDto){
        const id = req.user.id
        const projectId = project.id
        return this.progressTypesServise.getProgressTypes(id , projectId)
    }

    @ApiOperation({summary: "Обновление порядка типа прогресса пользователя"})
    @ApiResponse({status:200 , type: ProgressTypes})
    @UseGuards(JwtAuthGuard)
    @Put('/update-progress-order')
    async updateProgressOrder(@Body() updateProgressOrderDto: UpdateProgressOrderDto, @Req() req) {
        const userId = req.user.id;
        return this.progressTypesServise.updateProgressOrder(userId, updateProgressOrderDto);
    }

    @ApiOperation({summary: "Обновление типа прогресса пользователя"})
    @ApiResponse({status:200 , type: ProgressTypes})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    updateProgressType(@Param("id") id: number , @Body() dto: CreateProgressTypeDto , @Req() req){
        const userId = req.user.id
        return this.progressTypesServise.updateProgressType(id , dto , userId)
    }

    @ApiOperation({summary: "Удаление типа прогресса пользователя"})
    @ApiResponse({status:200})
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    deleteProgressType(@Param("id") id: number , @Body() project , @Req() req){
        const userId = req.user.id
        const projectId = project.id
        return this.progressTypesServise.deleteProgressType(id , projectId , userId)
    }
}
