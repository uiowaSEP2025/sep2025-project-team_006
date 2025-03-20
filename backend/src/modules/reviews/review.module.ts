import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entity/review.entity';
import { Application } from 'src/entity/application.entity';
import { Faculty } from 'src/entity/faculty.entity';
import { ConfigModule } from '@nestjs/config';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Review, Application, Faculty])
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
