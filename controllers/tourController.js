// const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//*********************
//   Rout Handers
//*********************

// The alias for commonly used request
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Query chain: query.sort().select().skip[].limit()
  //  Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  //Send response
  res.status(200).json({
    staus: 'success',
    requestedAt: req.requestTime,
    data: {
      tours
    }
    // results: tours.length,
    // data: {
    //   tours: tours
    // }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await await Tour.findById(req.params.id);
  // other method to get a single doctrine
  // const tour = await Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404));
  }

  res.status(200).json({
    staus: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  console.log('IN_______');
  console.log(req.body);
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    // This returns newly updated doc
    new: true,
    runValidators: true
  });

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404));
  }

  // Status 204 is used to mean no data, which
  // what is sent back on a DELETE
  res.status(204).json({
    status: 'success',
    data: null
  });
});

/////// Aggregation Pipline ///////
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' }, // $toUpper = uppercase
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        // At this point the field names in $group need to be used
        // This sorts acending ( -1 foe decending)
        avgPrice: 1
      }
    }
    // {
    //   // This grabs any that are not equal ($ne) to 'EASY'
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        // Make a field not show up in the results
        _id: 0
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    }
    // {
    //   $limit: 3
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
