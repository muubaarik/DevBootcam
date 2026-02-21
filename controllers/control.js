const ErrorResponse = require('../utilts/erroRespon')
const model= require('../model/model')
const geocoder = require('../utilts/geocoder');
const path = require('path');

//const { param } = require('../rought/bootcamps');






//@desc    Get all bootcamps
//2route    Get/api/v1/bootcamps
// @cess   public
exports.getBootcamps = async (req, res, next) => {
    try {
        const queryObj = { ...req.query };

        // Exclude fields not needed for MongoDB query
        const excludedFields = ['select', 'sort', 'page', 'limit'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Convert query parameters to MongoDB operators if needed
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|lt|lte|in)\b/g, match => `$${match}`);

        // Parse the query string back to a JavaScript object
        let query = JSON.parse(queryString);
        if (process.env.NODE_ENV !== 'test') {
            console.log('Query before sorting:', query);
        }

        // Handle sorting
        let sortCriteria = '-createdAt'; // Default sorting
        if (req.query.sort) {
            sortCriteria = req.query.sort.split(',').join(' ');
        }

        // Handle pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const skip = (page - 1) * limit;

        // Parse the select parameter to separate fields
        let selectFields = '';
        if (req.query.select) {
            selectFields = req.query.select.split(',').join(' ');
        }

        const bootcamps = await model
            .find(query).populate('Courses')
            .select(selectFields)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        //pagination result
        const total = await model.countDocuments();
        const pagination = {};

        if (skip + limit < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (skip > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};


/*exports.getBootcamps = async (req, res, next) => {
    try {
        const queryObj = { ...req.query };

        // Exclude fields not needed for MongoDB query
        const excludedFields = ['select', 'sort', 'page', 'limit'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Convert query parameters to MongoDB operators if needed
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|lt|lte|in)\b/g, match => `$${match}`);

        // Parse the query string back to a JavaScript object
        let query = JSON.parse(queryString);
        console.log('Query before sorting:', query);
        console.log(typeof query);

        // Handle sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);

        } else {
            query = query.sort('-createdAt'); // Default sorting
        }

        // Handle pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        console.log('Sorting Criteria:', query._options.sort); 
        const bootcamps = await model.find(query);

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};*/


/*exports.getBootcamps = async (req, res, next) => {
    try {
        // Copy request query parameters
        const queryObj = { ...req.query };

        // Exclude fields not needed for MongoDB query
        const excludedFields = ['select','sort','page','limit'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Convert query parameters to MongoDB operators if needed
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|lt|lte|in)\b/g, match => `$${match}`);

        // Parse the query string back to a JavaScript object
        let query = JSON.parse(queryString);

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = model.find(query).select(fields);
        }



        // Select fields if 'select' parameter is present in the request
       // if (req.query.select) {
            //const fields = req.query.select.split(',').join(' ');
            //query = query.select(fields);
       // }

        // Sort results if 'sort' parameter is present in the request
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

       
       // if (req.query.sort) {
           // const sortBy = req.query.sort.split(',').join(' ');
           // query = query.sort(sortBy);
        //} else {
            //query = query.sort('-createdAt'); // Default sorting by createdAt if sort parameter is not provided
       // }

        // Execute the Mongoose query
        const bootcamps = await model.find(query);

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};*/






/*exports.getBootcamps = async (req, res, next) => {
    try {
        const queryObj = { ...req.query };

        // Exclude fields not needed for MongoDB query
        const excludedFields = ['select'];
        excludedFields.forEach(field => delete queryObj[field]);

        // Convert query parameters to MongoDB operators if needed
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|lt|lte|in)\b/g, match => `$${match}`);

        // Parse the query string back to a JavaScript object
        let query = JSON.parse(queryString);
        //select field;
        if(req.query.select){
            const fields =req.query.select.split(',').join(' ');
            query = model.find(query).select(fields)
      
        }
        //sort
        if(req.query.sort){
            const sortBy =req.query.sort.split(',').join(' ');
              query = query.sort(sortBy)
           // query = model.find(query).sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }

        const bootcamps = await model.find(query);


        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
















/*exports.getBootcamps = async (req, res, next) => {
    let query;
    //copy req.query
    const reQuery ={...req.query};
    //fields to exclude
    const removeFields =['select'];
    //loop over removeFields and delate them from reqQuery

   //create query string
    let queryStr = JSON.stringify(reQuery);
    removeFields.forEach(param => delete reQuery[param]);
    console.log(reQuery)
    //creater operators ($ gte, gt ,tc)
    queryStr = queryStr.replace(/(\bgt\b|\blt\b|\blte\b|\bin\b)/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr); // Parse back to JSON after replacing keys
   
    try {
        // find resources
        query = model.find(queryStr);
        //Executing query
        const bootcamps = await query;
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Use `error` instead of `err`
    }
}*/


/*exports.getBootcamps = async (req, res, next) => {
    let query;
   
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/(\bgt\b|\blt\b|\blte\b|\bin\b)/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr); // Parse back to JSON after replacing keys
   
    try {
        query = model.find(queryStr);
        const bootcamps = await query;
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Use `error` instead of `err`
    }
}




/*exports.getBootcamps = async (req, res, next) => {
    let query;
   
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|lt|ilt|in)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr); // Parse back to JSON after replacing keys
   
    try {
       
        query = model.find(queryStr);
        const bootcamps = await query;
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error); // Use `error` instead of `err`
    }
}



/*exports.getBootcamps = async(req,res,next)=>{
    let query;
   
   let queryStr= JSON.stringify(req.query);
   queryStr = queryStr.replace(/\b(gt|lt|ilt|in)\b/g, match =>`$${match}`)
   console.log(queryStr);
   
   query =model.find(JSON.stringify(queryStr));
   
   
    console.log(req.query);



    try {
     // const bootcamps = await model.find(req.query)  
     const bootcamps = await query;
      res.status(200).json({success:true, count: bootcamps.length, data:bootcamps})
    } catch (error) {
       
       next(err)
    }

}*/


//@desc    Get single bootcamps
//2route    Get/api/v1/bootcamps
// @cess   public
exports.getBootcamp = async(req,res,next)=>{
    try {
     const bootcamps=  await model.findById(req.params.id)  
     if(!bootcamps){
     return   next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
       //return res.status(400).json({success:false})
     }
      res.status(200).json({
        success:true ,data : bootcamps
     })
    } catch (err) {
      // res.status(400).json({success:false})
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    
   
}
//@desc    create new bootcamps
//2route    post/api/v1/bootcamps
// @cess   private
exports.CreatBootcamp= async (req, res, next) => {
    try {
        const bootcamp = await model.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        // Check if the error is a validation error
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: errors });
        }
        next(error); // Pass other errors to the error handler middleware
    }
};









//@desc    create new bootcamps
//2route    post/api/v1/bootcamps
// @cess   private
/*exports.CreatBootcamp= async(req,res,next)=>{
    const bootcamp = await model.create(req.body)
   // console.log(req.body)
    //res.status(200).json({success: true, msg:'create new bootcamps'})
    res.status(201).json({
        success: true,
        data: bootcamp
    })
    next(error); 
}*/

//@desc    update new bootcamps
//2route    put/api/v1/bootcamps/:id
// @cess   private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};


//@desc    delete new bootcamps
//2route    delete/api/v1/bootcamps:id
// @cess   private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await model.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ success: false, error: `Bootcamp not found with id of ${req.params.id}` });
        }
        
        await bootcamp.deleteOne(); // Triggers middleware pre('deleteOne')
        
        res.status(200).json({ success: true, data: `Bootcamp with id ${req.params.id} has been deleted` });
    } catch (err) {
        // Handle any errors that occur during the deletion process
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};


//@desc   upload phot for bootcamp
//2route    Put/api/v1/bootcamps:id/photo
// @cess   private
exports.BootcampPhotoUpload = async (req, res, next) => {
    try {
        const bootcamp = await model.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }

        if (!req.files || !req.files.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        const file = req.files.file;
       
        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse('Please upload an image file', 400));
        }

        if (file.size > Number(process.env.MAX_FILE_UPLOAD)) {
            return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 400));
        }

        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
        await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);
        await model.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({ success: true, data: file.name });
    } catch (err) {
        next(err);
    }
};



/*exports.BootcampPhotoUpload = async (req, res, next) => {
    try {
        const bootcamp = await model.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }
        
        // Check if a file was uploaded
        if (!req.files || !req.files.photo) {
            return next(new ErrorResponse('Please upload a file', 400));
        }
        const file = req.files.file;

        // Logic to handle file upload goes here
        // For example, you can save the file to a specific directory or process it in any way required
        
        console.log(req.file.file); // Log the uploaded file details
        
        // Return a success response
        res.status(200).json({ success: true, data: 'File uploaded successfully' });
    } catch (err) {
        // Handle any errors that occur during the upload process
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

/*exports.BootcampPhotoUpload = async (req, res, next) => {
    try {
        const bootcamp = await model.findById(req.params.id);
        console.log(bootcamp)
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
        }
        
        // Check if a file was uploaded
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }
        const file = req.files.file;
        // Handle the file upload logic here
        
        console.log(req.file); // Log the uploaded file details
        
        // Return a success response
        res.status(200).json({ success: true, data: 'File uploaded successfully' });
    } catch (err) {
        // Handle any errors that occur during the upload process
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};*/







/*exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await model.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ success: false, error: 'Bootcamp not found' });
        }
        
        // Log the retrieved bootcamp object for debugging
        console.log('Retrieved Bootcamp:', bootcamp);

        // Check if the bootcamp object has a remove function
        //if (typeof bootcamp.remove !== 'function') {
            //return res.status(500).json({ success: false, error: 'Cannot delete bootcamp' });
       // }

        // Call remove() and await the operation
        //await bootcamp.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};



















//consolog(if faction,Retrieved Bootcamp:', bootcamp)
/*exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await model.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({ success: false, error: 'Bootcamp not found' });
        }
        
        // Log the retrieved bootcamp object for debugging
        console.log('Retrieved Bootcamp:', bootcamp);

        // Check if the bootcamp object has a remove function
        if (typeof bootcamp.remove !== 'function') {
            return res.status(500).json({ success: false, error: 'Cannot delete bootcamp' });
        }

        await bootcamp.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};*/

exports.getBootcampsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    try {
        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        console.log('Geocoder Response:', loc); // Log the geocoder response

        if (!loc || loc.length === 0) {
            // Handle case where geocoder does not return data
            return res.status(404).json({ error: 'Location not found' });
        }

        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        // Calculate radius using radians
        const radius = distance / 3963;

        console.log('Radius:', radius); // Log the radius value

        const bootcamps = await model.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius]
                }
            }
        });

        console.log('Bootcamps:', bootcamps); // Log the bootcamp data

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

/*exports.getBootcampsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    try {
        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(zipcode);
        console.log('Geocoder Response:', loc); // Log the geocoder response

        if (!loc || loc.length === 0) {
            // Handle case where geocoder does not return data
            return res.status(404).json({ error: 'Location not found' });
        }

        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        // Calculate radius using radians
        const radius = distance / 3963;

        const bootcamp = await model.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius]
                }
            }
        });

        console.log('Bootcamp:', bootcamp); // Log the bootcamp data

        res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};


//@desc    Get bootcamps within a radius
//@route   GET /api/V1/bootcamps/:zipcode/:distance
//@access  private
/*exports.getBootcampsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;
 
    try {
        
       // Get lat/lng from geocoder
       //const loc = await geocoder.geocode(zipcode);
       console.log(loc);
       const lat = loc[0].latitude;
       const lng = loc[0].longitude;
 
       // Calculate radius using radians
       // Divide distance by radius of Earth
       // Earth Radius = 3,963 mi / 6,378 km
       const radius = distance / 3963;
       console.log('Geocoder Response:', loc);
       const bootcamp = await model.find({
          location: {
             $geoWithin: {
                $centerSphere: [[lng, lat], radius]
           
             }
          } 
          
       });

       console.log('bootcamp', bootcamp )
 
       res.status(200).json({
          success: true,
          count: bootcamp.length,
          data: bootcamp
          
       });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Server Error' });
    }
 };
 





/*
//@desc    Get bootcamps within a radius
//2route    Get/api/V1/bootcamps/:zipcode/:distance
// @cess   private
exports.getBootcampsInRadius= async(req,res,next)=>{
   const {zipcod,distance} = req.params;

   //Get lat/lng from geocdore
   const loc = await geocoder.geocode(zipcod);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   //calc radius using radians
   //Divide dist by radius of Earth
   //Earth Radius = 3,963 mi/ 6,378

   const radius = distance/3963

   const  bootcamps = await model.find({
    location: {$geoWithin: { $centerSphere: [ [ lng,  lat ], radius ] }} 
   });


  
   
}*/
