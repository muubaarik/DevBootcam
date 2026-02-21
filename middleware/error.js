const ErrorResponse = require("../utilts/erroRespon");



const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console except in test mode
    if (process.env.NODE_ENV !== 'test') {
        console.log(err);
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // MongoDB Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400); // Use 400 for duplicate key errors
    }

    // Mongoose ValidationError
    if (err.name === 'ValidationError') {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Mongoose Validation Errors:', err.errors);
        }
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

module.exports = errorHandler;


/*const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for development
    console.log(err);

    // Mongoose CastError
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // MongoDB Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400); // Use 400 for duplicate key errors
    }

    if(err.name === 'validationError'){
        const message = object.value(err.errorrs).map(val => val.message);
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
};

module.exports = errorHandler;









/*const errorHandler =(err,req,res,next)=>{
    let error = {...err}
    error.massage = err.massage;
    //log to console for development
    console.log(err)
   // console.log(err.stack.red);
    //Mongoose bad Object
    if(err.name === 'CastError'){
        const massage = `Bootcamp not found with id of ${err.vlue}`;
        error = new ErrorResponse(massage, 404)
    }
    if(err.code === 11000){
        const massage = 'Duplicate field value entered'
        error = new ErrorResponse(massage,404);
    }
    console.log(err.name)
    res.status(err.statusCode || 500).json({
        success: false,
        error:err.massage || 'server error'
    })
}

module.exports = errorHandler;*/
