import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ProgressTypes } from "src/progress-types/progress-types.entity";
import { Project } from "src/projects/projects.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{

    @ApiProperty({example: "1" , description: "Уникальный идентификатор"})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: "ivanov.ivan@gmail.com" , description: "Электронная почта пользователя"})
    @Column({unique: true , nullable: false})
    email: string

    @ApiProperty({example: "123456789" , description: "Пароль пользователя"})
    @Column({nullable: false})
    password: string

    @OneToMany(() => Project, (project) => project.user , { cascade: true })
    @Exclude()
    project: Project[];
}