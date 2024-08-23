import { ApiProperty } from "@nestjs/swagger";
import { ProgressTypes } from "src/progress-types/progress-types.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Tasks{

    @ApiProperty({example: "1" , description: "Уникальный идентификатор"})
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({example: "Work" , description: "Название задачи"})
    @Column({unique: false , nullable: false})
    name: string

    @ApiProperty({example: "Make a project" , description: "Описание задачи"})
    @Column({unique: false , nullable: true})
    description: string

    @ApiProperty({example: "1995-12-17T03:24:00" , description: "Время создания"})
    @Column()
    date: Date

    @Column({nullable : true})
    order: number; 

    @ManyToOne(() => ProgressTypes, (progressType) => progressType.tasks)
    progressTypes: ProgressTypes;
}