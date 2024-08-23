import { Module } from '@nestjs/common';
import { ProgressTypesController } from './progress-types.controller';
import { ProgressTypesService } from './progress-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressTypes } from './progress-types.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Project } from 'src/projects/projects.entity';

@Module({
  controllers: [ProgressTypesController],
  providers: [ProgressTypesService],
  imports:[TypeOrmModule.forFeature([ProgressTypes , Project]) , AuthModule]
})
export class ProgressTypesModule {}
