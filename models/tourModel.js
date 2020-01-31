const mongoose = require('mongoose');

const slugify = require('slugify');
// const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less than or equal to 40],characters.'],
      minlength: [10, 'A tour must have 10 or more characters],characters.']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON is used to specify geospacial data
      type: {
        type: String,
        default: 'Point',
        // THis defines the options (only one in this case)
        enum: ['Point']
      },
      coordinates: [Number], // An array of numbers (lattitude first and then longitude)
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number], // An array of numbers (lattitude first and then longitude)
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    // Schema options
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/////// Virtual Property ///////
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Setting up indexes
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review', // The Model this points to
  foreignField: 'tour', // The field within that model
  localField: '_id' // The corresponding field within the parent model (the tour's ID in this case)
});

/////// Mongo DB Middware ///////
// This middleware runs only before .save() and .create()
// THIS is the document being saved
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// //  The .post() middleware rund after the .save(0 or .create()
// //  The DOC that was jhust saved can be passed as a param
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// Query middlewares
// Since this is triggered when Mongo DB .find()
// is used, queries like .findOne() will not work
// The solution is a RegEx to get all versions of .find()
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({
    secretTour: { $ne: true }
  });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordCHangedAt'
  });
  next();
});

// Aggregation middleware
// tourSchema.pre('aggregate', function(next) {
//   // Add the removal of a secrect doc by putting
//   // the filter at the begining of the array using .unshift()
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   next();
// });

//  The .post() middleware rund after the .save(0 or .create()
//  The DOC that was jhust saved can be passed as a param
tourSchema.post('find', function(doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
