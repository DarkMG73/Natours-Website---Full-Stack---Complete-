const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

console.log('Runing in environment: ', app.get('env'));
// To list all Environmental Variables
console.log(process.env.PORT);
//*****************
//  Start Server
//*****************
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
