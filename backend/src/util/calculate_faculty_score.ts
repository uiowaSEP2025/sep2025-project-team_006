import { Review } from 'src/entity/review.entity';

/**
 * Job: Calculates the faculty score of a review based on the scores and weights modified by the faculty
 * @returns faculty_score
 */
export const calculateFacultyScore = (review: Review): number => {
  const metrics = review.review_metrics ?? [];
  let faculty_score = 0;
  for (const metric of metrics) {
    faculty_score += metric.selected_weight * metric.value;
  }
  faculty_score = (faculty_score / 5) * 100;
  return Math.trunc(faculty_score);
};
