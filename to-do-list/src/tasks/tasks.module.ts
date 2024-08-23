import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { ProgressTypes } from 'src/progress-types/progress-types.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/users.entity';
import { Project } from 'src/projects/projects.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Tasks , ProgressTypes , User , Project]) , AuthModule]
})
export class TasksModule {}
