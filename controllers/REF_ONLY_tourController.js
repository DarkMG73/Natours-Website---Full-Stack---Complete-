// const fs = require('fs');
const Tour = require('./../models/tourModel');

// // Import a JSON via the fs module.
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// This will be paramware, so it will have a value
// exports.checkBody = (req, res, next) => {
//   console.log(req.body.name, '---------', req.body.price);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();

// if(req.params.id * 1 > )
// };

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

exports.getAllTours = async (req, res) => {
  try {
    ////////// Filtering //////////
    // // Method 1
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    // // Method 2
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });

    // Method 3
    // This uses destructuring to create a new Object
    // then filters the query of things that might
    // are not part of the object being searched for
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);
    // Fill the query

    /////// Advanced filtering
    // The req Obj resturns the query without the  $ ,
    // so a RegEx can be used to replace these entries with proper entrioes.
    // { difficulty: 'easy', duration: {$gte: 5 }}
    // { difficulty: 'easy', duration: {gte: 5 }}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    let query = Tour.find(JSON.parse(queryStr));
    console.log('----------------');

    ////////// Sorting //////////

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    ////////// Field Limiting //////////
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    ////////// Pagination //////////
    // Convert the page to a number and make it 1 by default
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    // We can skip() the number on each page
    // to put us on a specific page
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('THis page does not exist');
    }

    // Query chain: query.sort().select().skip[].limit()
    //  Execute the query
    const tours = await query;
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // other method to get a single doctrine
    // const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      staus: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      staus: 'success',
      message: err
    });
  }

  //   // Method one for testing if item exists
  //   if (id > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID'
  //     });
  //   }
  // const tour = tours.find(el => el.id === id);
  // // Method 2 for chekcing if the item exists
  // // if (!tour) {
  // //   return res.status(404).json({
  // //     status: 'fail',
  // //     message: 'Invalid ID'
  // //   });
  // // }
  // // Method 3 is to handle it as paramware
  // // using checkID function above.

  // res.status(200).json({
  //   staus: 'success',
  //   data: {
  //     tour
  //   }
  // });
};

exports.createTour = async (req, res) => {
  try {
    // //Method 1
    // const newTour = new Tour({})
    // newTour.save();

    // Method 2 (better)
    // Calling creatge() right on the Model object
    // This returns a promise, so ASYNC-AWAIT
    // can be used instead of then().catch().
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // This returns newly updated doc
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // Status 204 is used to mean no data, which
    // what is sent back on a DELETE
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};
