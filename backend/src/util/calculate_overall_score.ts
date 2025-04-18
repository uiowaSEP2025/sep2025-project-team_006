import { Review } from 'src/entity/review.entity';

/**
 * Job: Calculates the overall score of a review based on the scores and weights from the template
 * @returns overall_score
 */
export const calculateOverallScore = (review: Review): number => {
  const metrics = review.review_metrics ?? [];
  let overall_score = 0;
  for (const metric of metrics) {
    overall_score += metric.template_weight * metric.value;
  }
  return overall_score;
};
