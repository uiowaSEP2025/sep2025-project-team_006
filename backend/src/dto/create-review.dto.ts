import { IsNumber } from "class-validator";

export class CreateReviewDto {

    @IsNumber()
    faculty_id: number;

    @IsNumber()
    application_id: number;
}
