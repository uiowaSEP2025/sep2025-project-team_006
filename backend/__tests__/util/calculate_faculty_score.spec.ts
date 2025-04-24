import { Review } from 'src/entity/review.entity';
import { calculateFacultyScore } from 'src/util/calculate_faculty_score';

describe('calculateFacultyScore', () => {
    it('should return 0 when there are no metrics', () => {
        const review = { review_metrics: [] } as unknown as Review;
        expect(calculateFacultyScore(review)).toBe(0);
    });

    it('should sum selected_weight * value for all metrics', () => {
        const review = {
            review_metrics: [
                { selected_weight: 2, value: 1 },
                { selected_weight: 0.1, value: 10 },
                { selected_weight: 3, value: 0.5 },
            ],
        } as unknown as Review;

        // 2*1 + 0.1*10 + 3*0.5 = 2 + 1 + 1.5 = 4.5
        expect(calculateFacultyScore(review)).toBeCloseTo(90);
    });

    it('should handle mixed positive and negative weights', () => {
        const review = {
            review_metrics: [
                { selected_weight: -2, value: 3 },
                { selected_weight: 1, value: 4 },
            ],
        } as unknown as Review;

        // -2*3 + 1*4 = -6 + 4 = -2
        expect(calculateFacultyScore(review)).toBe(-40);
    });
});
