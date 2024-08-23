import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgressTypes } from './progress-types.entity';
import { Repository } from 'typeorm';
import { CreateProgressTypeDto } from './dto/create-progress-type.dto';
import { Project } from 'src/projects/projects.entity';
import { UpdateProgressOrderDto } from './dto/update-progress-type-order.dto';

@Injectable()
export class ProgressTypesService {

    constructor(@InjectRepository(ProgressTypes) private progressTypesRepo: Repository<ProgressTypes>, 
                @InjectRepository(Project) private projectRepo: Repository<Project>){}

    async createProgressType(dto: CreateProgressTypeDto , userId : number){
        const projectId = dto.projectId
        if((await this.projectRepo.findOne({where: {id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        const {name} = dto
        const id = dto.projectId
        const project = await this.projectRepo.findOne({where: {id}})
        if(!project.progressTypes){
            project.progressTypes = []
        }
        const order = project.progressTypes.length+1
        const progressType = await this.progressTypesRepo.create({name: name , project: project , order: order})
        project.progressTypes.push(progressType)
        return this.progressTypesRepo.save(progressType)
    }

    async getProgressTypes(userId : number , projectId: number){
        if((await this.projectRepo.findOne({where: {id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        return await this.progressTypesRepo.find({where: {project: {id:projectId}}})
    }

    async updateProgressType(id: number , dto: CreateProgressTypeDto , userId : number){
        const projectId = dto.projectId;
        if((await this.projectRepo.findOne({where: {id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        await this.progressTypesRepo.update(id , {name : dto.name , project: (await this.projectRepo.findOne({where : {id : projectId}}))})
        return this.progressTypesRepo.findOne({where:{id}})
    }

    async deleteProgressType(id : number , projectId : number , userId : number){
        if((await this.projectRepo.findOne({where: {id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        if((await this.projectRepo.findOne({where: {id : projectId} , relations : ['progressTypes']})).progressTypes.includes(
            await this.progressTypesRepo.findOne({where: {id}}))){
                throw new HttpException('Project has no this type of Progress' , HttpStatus.BAD_REQUEST);
            }
        await this.progressTypesRepo.delete(id)
    }  

    async updateProgressOrder(userId: number, updateProgressOrderDto: UpdateProgressOrderDto) {
        const { projectId, progressTypeOrder } = updateProgressOrderDto;
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
            relations: ['user', 'progressTypes'],
        });

        if (!project) {
            throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
        }

        if (project.user.id !== userId) {
            throw new HttpException('Project does not belong to the user', HttpStatus.FORBIDDEN);
        }
        const progressTypeIds = project.progressTypes.map(pt => pt.id);
        if (progressTypeOrder.some(id => !progressTypeIds.includes(id))) {
            throw new HttpException('Invalid progress type order', HttpStatus.BAD_REQUEST);
        }
        const updatedProgressTypes = project.progressTypes.map(pt => {
            const newOrder = progressTypeOrder.indexOf(pt.id) + 1; // Индексы начинаются с 0, порядок — с 1
            pt.order = newOrder;
            return pt;
        });

        await Promise.all(updatedProgressTypes.map(pt => this.projectRepo.manager.save(pt)));

        return { message: 'Progress type order updated successfully' };
    }
}
