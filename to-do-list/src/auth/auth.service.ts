import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Project } from 'src/projects/projects.entity';

@Injectable()
export class AuthService {

    constructor(private userService : UsersService,
                private jwtService : JwtService){

    }


    async login(dto: CreateUserDto){
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    async registration(dto: CreateUserDto){
        const candidate = await this.userService.getUserByEmail(dto.email);
        if(candidate){
            throw new HttpException("Пользователь с таким email уже существует" , HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password , 5);
        const user = await this.userService.createUser({...dto , password: hashPassword});
        return this.generateToken(user);
    }

    private async validateUser(user:CreateUserDto){
        const candidate = await this.userService.getUserByEmail(user.email);
        if(!candidate){
            throw new UnauthorizedException({message: "Неверный пароль или email"});
        }
        const passwordEquals =  await bcrypt.compare(user.password , candidate.password);
        if(user && passwordEquals){
            return candidate;
        }
        else{
            throw new UnauthorizedException({message: "Неверный пароль или email"});
        }
        
    }

    private async generateToken(user: User){
        const roles = user.project ? user.project.map(project => project.name) : [];
        const payload = {email : user.email , id: user.id , role: roles};
        console.log({token: this.jwtService.sign(payload)})
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
