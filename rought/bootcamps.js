const express = require('express');

const{getBootcamps,getBootcamp,CreatBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius,BootcampPhotoUpload} = require('../controllers/control')

//Include other resource routers
const courseRouter =require('./courses')

const router =express.Router()
//RE-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

const{ protect,authorize} = require('../middleware/uath')

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo/').put(protect,authorize('publisher','admin'), BootcampPhotoUpload)



router.route('/').get(protect,getBootcamps).post(protect,CreatBootcamp);
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'),updateBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp)




/*router.get('/',(req,res)=>{
    res.status(200).json({success: true, msg:'show all bootcamps'})
 
})
router.get('/:id',(req,res)=>{
    res.status(200).json({success: true, msg:`show bootcamps ${req.params.id}`})
 
})
router.post('/',(req,res)=>{
    res.status(200).json({success: true, msg:'create new bootcamps'})
 
})
router.put('/:id',(req,res)=>{
    res.status(200).json({success: true, msg:`update bootcamps ${req.params.id}`})
 
})
router.delete('/:id',(req,res)=>{
    res.status(200).json({success: true, msg:`delete bootcamps ${req.params.id}`})
 
});*/

module.exports=router;
