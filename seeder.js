const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const  dotenv= require('dotenv');



// Load environment variables
dotenv.config({ path: './config/config.env' });

// Load models
const Model = require('./model/model');
const Course = require('./model/courses');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
 // useNewUrlParser: true,
  //useUnifiedTopology: true,
});

// Read JSON file
const bootcampsJson = fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8');
const bootcamps = JSON.parse(bootcampsJson);

const coursesJson= fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8');
const courses= JSON.parse(coursesJson);

// Import data into DB
const importData = async () => {
  try {
    await Model.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Model.deleteMany();
    await Course.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Check command line arguments and perform import or delete accordingly
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}


/*//load env vars

dotenv.config({path:'./config/config.env'})

//load models
const model = require('./model/model');

//connect to DB

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
     //useUnifiedTopology: true,
     
 });

 //import into DB

 //Read Json files
 const bootcamps = JSON.parse(fs.readdirSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));



 //Import into DB

 const imortData = async()=>{
    try {
        await model.create(bootcamps);
        console.log('Data Imported...'.green.inverse)
        process.exit();
    } catch (error) {
        console.error(err);
        
    }
 }


 const deletData = async()=>{
    try {
        await model.deleteMany(bootcamps);
        console.log('Data Destroyed...'.red.inverse)
        process.exit();
    } catch (error) {
        console.error(err);
        
    }
 }


 if(process.argv[2] === '-i'){
    imortData();
 }else if(process.argv[2]=== '-d'){
    deletData();

 }*/