const ErrorResponse = require('../utilts/erroRespon')
const User = require('../model/user');
const user = require('../model/user');

//@desc    Register user
//2route    post/api/v1/auth/rgister
// @cess   public

// Get token from model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Get token from user model
    const token = user.getSignedJwtToken();

    // Create cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set cookie expiration
        httpOnly: true // Cookie is accessible only via HTTP(S)
    };

    // Set secure cookie option if in production mode
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true; // Cookie will be sent only over HTTPS
    }

    // Set cookie with the token
    res.cookie('token', token, cookieOptions);

    // Send JSON response with token and status code
    res.status(statusCode).json({ success: true, token });
};

//@desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        // Send token response with status code 200
        sendTokenResponse(newUser, 200, res);
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User registration failed', 500));
    }
};

//@desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // validate email & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Send token response with status code 200
        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User login failed', 500));
    }
};


//@desc    Login logged in user
// @route   POST /api/v1/auth/me
// @access  private

exports.getMe = async (req,res,next) =>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        data:user
    });
}































/*exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });
        // Create token
        //const token = newUser.getSignedJwtToken();

       // res.status(200).json({ success: true, token });
       sendTokenResponse = (user,statusCode,res)
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User registration failed', 500));
    }
};

//@desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // validate email & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Create token
        //const token = user.getSignedJwtToken();

        //res.status(200).json({ success: true, token });
        sendTokenResponse = (user,statusCode,res)
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User login failed', 500));
    }
};
  
const sendTokenResponse = (user, statusCode, res) => {
    // Get token from user model
    const token = user.getSignedJwtToken();

    // Create cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set cookie expiration
        httpOnly: true // Cookie is accessible only via HTTP(S)
    };

    // Set secure cookie option if in production mode
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true; // Cookie will be sent only over HTTPS
    }

    // Set cookie with the token
    res.cookie('token', token, cookieOptions);

    // Send JSON response with token and status code
    res.status(statusCode).json({ success: true, token });
};

exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        // Send token response with status code 200
        sendTokenResponse(newUser, 200, res);
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User registration failed', 500));
    }
};






// Get token from model,create cookie and respose
/*const sendTokenResponse = (user,statusCode,res) => {
    const token = user.getSignedJwtToken(); 
    const options ={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true // Cookie is accessible only via HTTP(S
    };
    res.status(statusCode).cookie('token',token,options).json({
        success:true,token
    })
}







//@desc    Register user
//2route    Get/api/v1/auth/login
// @cess   public
/*exports.login= async (req, res, next) => {
    const { email, password,  } = req.body;

    try {
       // validate email $ password
       if(!email || !password){
        return next(new ErrorResponse('please provided an email and password',400))
       }

       //check for user
       const user = await User.findOne({email}).select('+password')
       if(!user){
        return next(new ErrorResponse('invalid credentials',401))
       }

       // Check if password matches
       const isMatch = await User.matchPassword(password);
       if(!isMatch){
        return next(new ErrorResponse('invalid credentials',401))
       }
        // Create token
        const token = newUser.getSignedJwtToken();

        res.status(200).json({ success: true, token });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('User registration failed', 500));
    }
};*/


/*exports.register = async  (req, res, next) =>{
    const {name,email,password,role} =req.body;
    

   // create user

const User = await User.create({
    name,email,password,role
});

 res.status(200).json({success: true})

}*/