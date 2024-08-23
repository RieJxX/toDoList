import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from 'dotenv'
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { User } from "./users/users.entity";
import { ProgressTypesModule } from './progress-types/progress-types.module';
import { ProgressTypes } from "./progress-types/progress-types.entity";
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { Project } from "./projects/projects.entity";
import { Tasks } from "./tasks/tasks.entity";
import { AuthModule } from "./auth/auth.module";

dotenv.config()

@Module({
    exports:[],
    providers:[],
    controllers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [User , ProgressTypes , Project , Tasks],
          synchronize: true,
        }),
        UsersModule,
        ProgressTypesModule,
        ProjectsModule,
        TasksModule,
        AuthModule
      ]
})
export class AppModule {}