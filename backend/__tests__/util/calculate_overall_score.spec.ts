import { Review } from 'src/entity/review.entity';
import { calculateOverallScore } from 'src/util/calculate_overall_score';

describe('calculateOverallScore', () => {
    it('should return 0 when there are no metrics', () => {
        const review = { review_metrics: [] } as unknown as Review;
        expect(calculateOverallScore(review)).toBe(0);
    });

    it('should sum template_weight * value for all metrics', () => {
        const review = {
            review_metrics: [
                { template_weight: 1, value: 2 },
                { template_weight: 0.5, value: 4 },
                { template_weight: 2, value: 1.5 },
            ],
        } as unknown as Review;

        // 1*2 + 0.5*4 + 2*1.5 = 2 + 2 + 3 = 7
        expect(calculateOverallScore(review)).toBeCloseTo(7);
    });

    it('should handle zero and negative values correctly', () => {
        const review = {
            review_metrics: [
                { template_weight: 1, value: 0 },
                { template_weight: -1, value: 5 },
            ],
        } as unknown as Review;

        // 1*0 + (-1)*5 = -5
        expect(calculateOverallScore(review)).toBe(-5);
    });
});
