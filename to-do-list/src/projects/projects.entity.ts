import { ApiProperty } from "@nestjs/swagger";
import { ProgressTypes } from "src/progress-types/progress-types.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Project{

    @ApiProperty({example: "1" , description: "Уникальный идентификатор"})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: "Work" , description: "Название проекта"})
    @Column({unique: false , nullable: false})
    name: string

    @ApiProperty({example: "Make a project" , description: "Описание проекта"})
    @Column({unique: false , nullable: true})
    description: string

    @ApiProperty({example: "1995-12-17T03:24:00" , description: "Время создания"})
    @Column()
    date: Date

    @OneToMany(() => ProgressTypes, (progressType) => progressType.project)
    progressTypes: ProgressTypes[];

    @ManyToOne(() => User, (user) => user.project)
    user: User;
}