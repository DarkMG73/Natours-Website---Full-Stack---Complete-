const mongoose = require('mongoose');

// review / rating / createdAt / ref to tour / ref to userSchema

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      maxlength: [40, 'A tour must have less than or equal to 40],characters.'],
      minlength: [1, 'A tour must have 10 or more characters],characters.']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user']
    }
  },
  {
    // Schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
