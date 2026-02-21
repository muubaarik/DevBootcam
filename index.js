const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config({ path: './config/config.env' });
connectDB();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.bgYellow.bold));


//Handle Unhandled promise rejactions
process.on('unhandledRejection',(error,promise)=>{
    console.log(`Error: ${error.message}`.red)
    //close server $exit process
    server.close(()=>process.exit(1));
});
