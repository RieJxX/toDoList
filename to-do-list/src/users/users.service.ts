import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepo : Repository<User> ){}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepo.create(dto)
        user.project = [];
        return this.userRepo.save(user)
    }

    async getUser(){
        return await this.userRepo.find({relations: ['project']})
    }

    async updateUser(id: number , dto: CreateUserDto){
        const updatedUser = await this.userRepo.update(id , dto)
        return this.userRepo.findOne({where: {id}});
    }

    async deleteUser(id: number){
        return await this.userRepo.delete(id)
    }

    async getUserByEmail(email : string){
        return this.userRepo.findOne({
            where: { email },
            relations: ['project'],
        });
    }
}
