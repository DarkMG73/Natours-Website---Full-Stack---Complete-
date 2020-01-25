const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async function(req, res, next) {
  const features = await new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  res.status(200).json({
    staus: 'success',
    requestedAt: req.requestTime,
    data: {
      reviews
    }
  });
});

exports.getReviews = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query
  console.log('Get Reviews For!');
  const tourId = req.params.id;

  const reviews = await Review.find({ tour: tourId });
  res.status(200).json({
    status: 'success',
    reviews
  });
});

exports.createReview = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query
  console.log('Post Review  For!');

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    newReview
  });
});

exports.getReviewById = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query
  console.log('Get Reviews By ID!');
  const reviewId = req.params.id;
  res.status(200).json({
    status: 'success',
    reviewId
  });
});

exports.getSingleReview = catchAsync(async function(req, res, next) {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  res.status(200).json({
    status: 'success',
    review
  });
});
exports.updateReview = catchAsync(async function(req, res, next) {
  // const reviews = await new Review.find(), req.query
  console.log('Update Review  By ID!');
  const reviewId = req.params.id;

  const review = await Review.findByIdAndUpdate(reviewId, req.body, {
    // This returns newly updated doc
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    review
  });
});

exports.getUserReviews = catchAsync(async function(req, res, next) {
  const userId = req.params.id;
  const userReviews = await Review.find({ user: userId });

  res.status(200).json({
    status: 'success',
    userReviews
  });
});
