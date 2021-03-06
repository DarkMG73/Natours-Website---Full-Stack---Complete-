const Review = require('./../models/reviewModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('./../utils/appError');

exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async function(req, res, next) {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const features = await new APIFeatures(Review.find(filter), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const reviews = await features.query;

//   res.status(200).json({
//     staus: 'success',
//     requestedAt: req.requestTime,
//     data: {
//       reviews
//     }
//   });
// });

exports.getReviews = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query

  const tourId = req.params.id;

  const reviews = await Review.find({ tour: tourId });
  res.status(200).json({
    status: 'success',
    reviews
  });
});

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async function(req, res, next) {
//   // const reviews = await new Review.find(), req.query
//   console.log('req.params', req.params);
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

//   console.log('Post Review  For!');

//   const newReview = await Review.create(req.body);

//   res.status(200).json({
//     status: 'success',
//     newReview
//   });
// });

exports.getReviewById = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query
  console.log('Get Reviews By ID!');
  const reviewId = req.params.id;
  res.status(200).json({
    status: 'success',
    reviewId
  });
});

exports.getSingleReview = factory.getOne(Review);
// exports.getSingleReview = catchAsync(async function(req, res, next) {
//   const reviewId = req.params.id;
//   const review = await Review.findById(reviewId);
//   res.status(200).json({
//     status: 'success',
//     review
//   });
// });

exports.updateReview = factory.updateOne(Review);
// exports.updateReview = catchAsync(async function(req, res, next) {
//   // const reviews = await new Review.find(), req.query
//   console.log('Update Review  By ID!');
//   const reviewId = req.params.id;

//   const review = await Review.findByIdAndUpdate(reviewId, req.body, {
//     // This returns newly updated doc
//     new: true,
//     runValidators: true
//   });
//   res.status(200).json({
//     status: 'success',
//     review
//   });
// });

exports.getUserReviews = catchAsync(async function(req, res, next) {
  const userId = req.params.id;
  const userReviews = await Review.find({ user: userId });

  res.status(200).json({
    status: 'success',
    userReviews
  });
});

exports.deleteReview = factory.deleteOne(Review);
