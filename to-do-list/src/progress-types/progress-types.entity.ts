import { Post } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Project } from "src/projects/projects.entity";
import { Tasks } from "src/tasks/tasks.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ProgressTypes{

    @ApiProperty({example: "1" , description: "Уникальный идентификатор"})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: "Done" , description: "Название прогресса"})
    @Column({unique: false , nullable: false})
    name: string

    @Column()
    order: number

    @ManyToOne(() => Project, (project) => project.progressTypes)
    project: Project;

    @OneToMany(() => Tasks , (task) => task.progressTypes)
    tasks: Tasks[]

}