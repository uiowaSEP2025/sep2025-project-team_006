import { Review } from "src/entity/review.entity";

/**
 * Job: Calculates the faculty score of a review based on the scores and weights modified by the faculty
 * @returns faculty_score 
 */
export const calculateFacultyScore = (review: Review): number => {
    const metrics = review.review_metrics;
    let faculty_score: number = 0.0;
    metrics.forEach((metric) => {
        faculty_score += metric.selected_weight * metric.value;
    })

    return faculty_score;
}
