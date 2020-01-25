const express = require('express');
const reviewController = require('./../controllers/reviewsController');
// const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(reviewController.getAllReviews);
router
  .route('/:id')
  .get(reviewController.getReviews)
  .patch(reviewController.updateReview);

router
  .route('/single/:id')
  .get(reviewController.getSingleReview)
  .patch(reviewController.updateReview);

router.route('/create').post(reviewController.createReview);

router.route('/user/:id').get(reviewController.getUserReviews);

module.exports = router;
