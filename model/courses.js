



const mongoose = require('mongoose');
const bootcamp = require('./model');
 

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String, // Assuming weeks can be represented as a string
    required: [true, 'Please add the number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add the course tuition']
  },
  minimumSkill: {
    type: String, // Changed to String type
    required: [true, 'Please add the minimum skill level'],
    enum: ['beginner', 'intermediate', 'advanced'] // Updated enum values
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'model',
    required: true
  }
});
// Define getAverageCost as a static method
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Calculating average cost...');
    }
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' }
        }
      }
    ]);
    try {
        if (obj.length > 0) {
          await bootcamp.findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
          });
        } else {
          await bootcamp.findByIdAndUpdate(bootcampId, { averageCost: undefined });
        }
       // await this.model('model').findByIdAndUpdate(bootcampId,{averageCost: Math.ceil( obj[0].averageCost/10)*10})
    } catch (error) {
        console.error(error)
    }
    //console.log(obj);
  };
  
  // Call getAverageCost after save
  CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
  });
  
  // Call getAverageCost after document deletion
  CourseSchema.post('deleteOne', { document: true, query: false }, function() {
    this.constructor.getAverageCost(this.bootcamp);
  });
module.exports = mongoose.model('Course', CourseSchema);





























/*const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String, // Assuming weeks can be represented as a string
    required: [true, 'Please add the number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add the course tuition']
  },
  minimumSkill: {
    type: String, // Changed to String type
    required: [true, 'Please add the minimum skill level'],
    enum: ['beginner', 'intermediate', 'advance'] // Enum values as strings
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
});

module.exports = mongoose.model('Course', CourseSchema);*/
