const express = require('express');
const tourController = require('./../controllers/tourController');

const reviewRouter = require('./../routes/reviewRoutes');

const authController = require('./../controllers/authController');

// method 2 for routing
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);

// A commonly used set of parameters
// can be made easier by routing to
// custom middleware that adds parameters
// and then sends to the next middleware in the get()
tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route('/tour-stats').get(tourController.getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// tourRouter
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.resrtictTo('user'),
//     reviewsController.createReview
//   );

// Since this starts with 'tour', but is actually for reviews, you can set the router middleware to use the reviewRouter when this rout is encountered.
// To give the reviewRouter access to the tourId param, Express offers the ability to merge the parameters.
tourRouter.use('/:tourId/reviews', reviewRouter);

module.exports = tourRouter;
