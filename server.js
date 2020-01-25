const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// // Connect to local DB
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log('DB local connection successful');
//   });

// Connect on remote db.
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB remote connection successful');
  });

const port = process.env.PORT || 3000;

// console.log('Runing in environment: ', app.get('env'));
// To list all Environmental Variables
// console.log(process.env.PORT);
//*****************
//  Start Server
//*****************
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Unhandled Rejections
// Subscribe to the process Object that emits "unhandledRejection" event
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
