const express = require('express');
const tourController = require('./../controllers/tourController');
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
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.resrtictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRouter;
