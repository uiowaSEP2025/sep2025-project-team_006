import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/entity/application.entity';
import { Review } from 'src/entity/review.entity';
import { Student } from 'src/entity/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Review, Student])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
