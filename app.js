const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You posted to this endpoint...');
// });

// Creating a RESTful API

const app = express();

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// app.1)  MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log('You are in:', process.env.NODE_ENV);
app.use(express.json());
// This is used to establish a static direactory
// With this, anything that ends in a file will work
//  Like http://localhost:3000/overview.html#
// Or http://localhost:3000/img/pin.png
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello form the middle!');

  next();
});

//*****************
//   Routes
//*****************
// // Method 1 for routing
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
