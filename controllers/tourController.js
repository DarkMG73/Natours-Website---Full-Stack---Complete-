const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// This will be paramware, so it will have a value
exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req.body.name, '---------', req.body.price);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();

  // if(req.params.id * 1 > )
};

//*********************
//   Rout Handers
//*********************
exports.getAllTours = (req, res) => {
  res.status(200).json({
    staus: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours
    }
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  //   // Method one for testing if item exists
  //   if (id > tours.length) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID'
  //     });
  //   }
  const tour = tours.find(el => el.id === id);
  // Method 2 for chekcing if the item exists
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // }
  // Method 3 is to handle it as paramware
  // using checkID function above.

  res.status(200).json({
    staus: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // Below is better than tours[id] = "new data"
  // Because the below process will not mutate the original Object
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  // Since this is already running in the Evwnt Loops,
  //
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour
        }
      });
    }
  );
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  // Status 204 is used to mean no data, which
  // what is sent back on a DELETE
  res.status(204).json({
    status: 'success',
    data: null
  });
};
