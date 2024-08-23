import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { ProgressTypes } from 'src/progress-types/progress-types.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/users.entity';
import { ReadProjectAndTypeDto } from './dto/read-project-and-type.dto';
import { Project } from 'src/projects/projects.entity';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Tasks)
        private tasksRepository: Repository<Tasks>,
        @InjectRepository(ProgressTypes)
        private progressTypesRepository: Repository<ProgressTypes>,
        @InjectRepository(Project) 
        private projectRepo : Repository<Project>,
        @InjectRepository(User) 
        private userRepo : Repository<User>
    ) {}

    
    async createTask(userId : number , createTaskDto: CreateTaskDto){
        const { name, description, progressTypeId } = createTaskDto;
        const progressType = await this.progressTypesRepository.findOne({
            where: { id: progressTypeId }, relations : ['project' , 'tasks']
        });

        const user = await this.userRepo.findOne({ where: { id: userId } , relations: ['project']});

        if (!user || !progressType) {
            throw new HttpException("Project or progressType not yours or doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const userProjects = user.project.map((project: Project) => project.id);
        const progressTypeProjectId = progressType.project.id;

        if (!userProjects.includes(progressTypeProjectId)) {
            throw new HttpException("Project or progressType not yours or doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const maxOrder = progressType.tasks.length+1

        const task = this.tasksRepository.create({name : name , description : description , date: new Date(),  order: maxOrder , progressTypes: progressType});

        return this.tasksRepository.save(task);
    }

    async getTasks(dto : ReadProjectAndTypeDto,  userId : number){
        const {projectId , progressId} = dto
        if(!(await this.projectRepo.findOne({where:{id: projectId} , relations : ['user']})) || 
           !(await this.progressTypesRepository.findOne({where:{id: progressId} , relations : ['project']}))){
                throw new HttpException("Project or progressType doesn't exist" , HttpStatus.BAD_REQUEST)
           }
        if((await this.projectRepo.findOne({where:{id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException("Project is not yours or doesn't exist" , HttpStatus.BAD_REQUEST)
        }
        if((await this.progressTypesRepository.findOne({where:{id: progressId} , relations : ['project']})).project.id !== projectId){
            throw new HttpException("Progress type doesn't exist" , HttpStatus.BAD_REQUEST)
        }
        return await this.tasksRepository.find({where: {progressTypes: (await this.progressTypesRepository.findOne({where:{id: progressId}}))} , relations: ['progressTypes']})
    }

    async updateTasks(id: number , createTaskDto: CreateTaskDto,  userId : number){
        const { name, description, progressTypeId } = createTaskDto;
        const progressType = await this.progressTypesRepository.findOne({
            where: { id: progressTypeId }, relations : ['project']
        });

        const user = await this.userRepo.findOne({ where: { id: userId } , relations: ['project']});

        if (!user || !progressType) {
            throw new HttpException("Project or progressType not yours or doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const userProjects = user.project.map((project: Project) => project.id);
        const progressTypeProjectId = progressType.project.id;

        if (!userProjects.includes(progressTypeProjectId)) {
            throw new HttpException("Project or progressType not yours or doesn't exist", HttpStatus.BAD_REQUEST);
        }

        const task = this.tasksRepository.update(id , {name : name , description : description , date: new Date() , progressTypes: progressType});

        return this.tasksRepository.findOne({where: {id}});
    }

    async deleteTasks(id: number , dto: ReadProjectAndTypeDto , userId: number){
        const {projectId , progressId} = dto
            
        if((await this.projectRepo.findOne({where:{id: projectId} , relations : ['user']})).user.id !== userId){
            throw new HttpException("Project is not yours or doesn't exist" , HttpStatus.BAD_REQUEST)
        }
        if((await this.progressTypesRepository.findOne({where:{id: progressId} , relations : ['project']})).project.id !== projectId){
            throw new HttpException("Progress type doesn't exist" , HttpStatus.BAD_REQUEST)
        }
        return this.tasksRepository.delete(id)
    }
    
    async moveTask(userId: number, moveTaskDto: MoveTaskDto): Promise<Tasks> {
        console.log('MoveTaskDto:', moveTaskDto);
        const { taskId, newProgressTypeId, newOrder } = moveTaskDto;
        
        console.log('MoveTaskDto:', moveTaskDto); // Логирование входящих данных
    
        // Найти задачу по ID
        const task = await this.tasksRepository.findOne({
            where: { id: taskId },
            relations: ['progressTypes', 'progressTypes.project'],
        });
    
        if (!task) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
    
        // Найти новый тип прогресса
        const oldProgressType = task.progressTypes;
        const newProgressType = newProgressTypeId
            ? await this.progressTypesRepository.findOne({
                  where: { id: newProgressTypeId },
                  relations: ['project', 'tasks'],
              })
            : oldProgressType;
    
        if (!newProgressType) {
            throw new HttpException('New progress type not found', HttpStatus.NOT_FOUND);
        }
    
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['project'],
        });
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        const userProjects = user.project.map((project: Project) => project.id);
        const newProgressTypeProjectId = newProgressType.project.id;
    
        if (!userProjects.includes(newProgressTypeProjectId)) {
            throw new HttpException("Project or progressType not yours or doesn't exist", HttpStatus.BAD_REQUEST);
        }
    
        // Обработка перемещения задачи
        if (oldProgressType.id !== newProgressType.id) {
            task.progressTypes = newProgressType;
            await this.reorderTasks(newProgressType.tasks, task, newOrder);
        } else {
            const tasksInProgressType = await this.tasksRepository.find({
                where: { progressTypes: oldProgressType },
                order: { order: 'ASC' },
            });
            await this.reorderTasks(tasksInProgressType, task, newOrder);
        }
    
        return this.tasksRepository.save(task);
    }
    
    
    
    private async reorderTasks(tasks: Tasks[], movedTask: Tasks, newOrder: number) {
        const filteredTasks = tasks.filter(t => t.id !== movedTask.id);
    
        if (newOrder > filteredTasks.length + 1) {
            newOrder = filteredTasks.length + 1;
        }
    
        filteredTasks.splice(newOrder - 1, 0, movedTask);
    
        // Обновить порядок всех задач
        for (let i = 0; i < filteredTasks.length; i++) {
            filteredTasks[i].order = i + 1;
            await this.tasksRepository.save(filteredTasks[i]);
        }
    }
    
    
}
