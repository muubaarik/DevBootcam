
//@desc logs request to console
const logger =(req,res,next)=>{
    if (process.env.NODE_ENV !== 'test') {
      console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    }
     next();
  };

  module.exports=logger
