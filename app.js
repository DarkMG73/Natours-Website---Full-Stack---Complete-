const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You posted to this endpoint...');
// });

// Creating a RESTful API

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// *** Serving Static Files***
// This is used to establish a static direactory
// With this, anything that ends in a file will work
//  Like http://localhost:3000/overview.html#
// Or http://localhost:3000/img/pin.png
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// app.1)  MIDDLEWARES

// *** Set Security HTTP Headers***
// This sets inportant security headers
app.use(helmet());

// *** Development Logging ***
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// *** Limit Requests from Same API***
const limiter = rateLimit({
  // The following limits requyests to 100 withtin 1 hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP{. Please try again in an hour'
});
// Here we use the rate limiter only on the api path
app.use('/api', limiter);

// *** Body Parser, Reading Data from the Body Into req.body ***
// Use Body Parser json with a limit of 10kb total package size per request
app.use(express.json({ limit: '10kb' }));

// For sending form data, this middleware is run to properly encoe the data being sent to the database
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Parses data from cookies
app.use(cookieParser());
// *** Dsts Sanitization Against NOQL Query Injection***
// This will look throught the query strings and params acending
// filter out all of the dollar signs and dots
app.use(mongoSanitize());

// *** Dsts Sanitization Against XSS ***
// This filters out html & code symbols
app.use(xss());

// *** Prevent Paramter Pollution ***
app.use(
  hpp({
    whitelist: [
      // THis whitelist will allow items we want to allow multiples of in params
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());
// // *** Test Middleware***
// app.use((req, res, next) => {
//   console.log('Hello form the middle!');

//   next();
// });

//*****************
//   Routes
//*****************
// // Method 1 for routing
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can not find ${req.originalURL} on this server!`);
  // err.status = 404;
  // If next() has anything passed in it, it assumes it is an error
  // next(err);
  console.log('ERROR App All');
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
