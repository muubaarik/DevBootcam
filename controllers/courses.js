

const mongoose = require('mongoose'); // Import mongoose module

const ErrorResponse = require('../utilts/erroRespon');
const Course = require('../model/courses');
const model= require('../model/model')







/*const ErrorResponse = require('../utilts/erroRespon')
const Course= require('../model/courses');
const courses = require('../model/courses');
const mongoose = require('mongoose')*/


//@desc    Get all bootcamps
//2route    Get/api/v1/bootcamps
// @cess   public
exports.getCourses = async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
          select: 'name description'
        });
    }

    try {
        const courses = await query;

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};

//@desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        });

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        next(err);
    }
};







// @route   POST /api/v1/courses/:bootcampId
// @access  Private
//@desc    Add single course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    try {
        const bootcamp = await model.findById(req.params.bootcampId);

        if (!bootcamp) {
            return res.status(404).json({ success: false, error: 'Bootcamp not found' });
        }

        // Create the course here using req.body or any other logic
        // For example:
        const course = await Course.create(req.body);

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        next(err);
    }
};



//@desc    UpdateCourse single course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, error: `No course found with id ${req.params.id}` });
        }

        // Update the course using req.body and options
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        next(err);
    }
};




//@desc    UpdateCourse single course
// @route   Delete /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: `course not found with id of ${req.params.id}` });
        }
        
        await course.deleteOne();
        
        res.status(200).json({ success: true, data: `Course with id ${req.params.id} has been deleted` });
    } catch (err) {
        // Handle any errors that occur during the deletion process
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};










/*exports.apdateCourse = async (req, res, next) => {
   
    try {
         let const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, error: `no course founde ${req.params.id}` });
        }

        // Create the course here using req.body or any other logic
        // For example:
        course = await Course.findByIdAndUpdate(req.params.id, req.body.{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        next(err);
    }
};*/
