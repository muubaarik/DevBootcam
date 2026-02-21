
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;








/*class erorResponse extends error{
    constructor(massage,statusCode){
        super(massage);
        this.statusCode = statusCode;
    }
}


module.exports =erorResponse;*/