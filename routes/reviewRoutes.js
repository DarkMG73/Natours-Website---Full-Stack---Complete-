const express = require('express');
const reviewController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReviews)
  .patch(authController.restrictTo('user'), reviewController.updateReview);

router
  .route('/single/:id')
  .get(reviewController.getSingleReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

router.route('/user/:id').get(reviewController.getUserReviews);

module.exports = router;
