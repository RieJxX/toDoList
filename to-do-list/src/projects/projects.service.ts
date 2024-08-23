import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from 'src/users/users.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectsService {

    constructor(@InjectRepository(Project) private projectRepo : Repository<Project> , @InjectRepository(User) private userRepo : Repository<User>){}

    async getProjets(user: User){
        const id = user.id;
        return await this.projectRepo.find( {where: { user: { id } } , relations: ['user' , 'progressTypes' , 'progressTypes.tasks']})
    }

    async createProject(dto : CreateProjectDto , user: User){
        const { name, description } = dto;

    // Создание проекта
    const project = this.projectRepo.create({
        name,
        description,
        date: new Date(),
        user,  
        progressTypes: []  
    });
    project.user = user
    const savedProject = await this.projectRepo.save(project);
    return plainToInstance(Project, savedProject, { excludeExtraneousValues: true });
    }

    async updateProject(id : number , dto: CreateProjectDto , userId : number){
        if((await this.projectRepo.findOne({where: {id} ,  relations: ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        await this.projectRepo.update(id , dto);
        return this.projectRepo.findOne({where:{id}})
    }

    async deleteProject(id:number , userId : number){
        if((await this.projectRepo.findOne({where: {id} ,  relations: ['user']})).user.id !== userId){
            throw new HttpException('Project does not belong to the user or does not exist' , HttpStatus.BAD_REQUEST);
        }
        await this.projectRepo.delete(id)
    }
}
