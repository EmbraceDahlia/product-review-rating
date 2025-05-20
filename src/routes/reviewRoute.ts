
import { Router } from 'express';
import reviewController from '../controllers/reviewController';

const router = Router({ mergeParams: true });

router.route('/')
.get(reviewController.getReviews)
.post(reviewController.addReview);
router.route('/:reviewId')
.put(reviewController.updateReview)
.delete(reviewController.deleteReview);

export default router;