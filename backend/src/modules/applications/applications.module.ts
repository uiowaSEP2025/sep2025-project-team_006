import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from 'src/entity/application.entity';
import { ConfigModule } from '@nestjs/config';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Student } from 'src/entity/student.entity';
import { Review } from 'src/entity/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Application, Student, Review]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ReviewsModule {}
