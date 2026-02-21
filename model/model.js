const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utilts/geocoder')



const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: false,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a name'],
      maxlength: [500, 'Name can not be more than 500 characters'],
      trim: true,
        lowercase: true
    },
    
    website: {
        type: String,
        match: [
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}(\/\S*)?$/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            'Please provide a valid email address'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false,
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
 toJSON:{virtuals: true},
 toObject:{virtuals: true}
});

BootcampSchema.virtual('Courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne: false

})

//cascade delete course when a bootcamp is  deleted

BootcampSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Courses being removed from bootcamp ${this._id}`);
    }
   
    await this.model('Course').deleteMany({ bootcamp: this._id })
    next()
  })
 
/*BootcampSchema.pre('remove', async function(next) {
    console.log(`Courses being removed from bootcamp ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});*/


BootcampSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slugify(this.name, { lower: true });
    next();
});

//GEOCODE & CREATE LOCATION FIELD;
BootcampSchema.pre('save', async function(next) {
    if (!this.isModified('address')) {
        next();
        return;
    }
    try {
        const loc = await geocoder.geocode(this.address);
        this.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName,
            state: loc[0].stateCode,
            state: loc[0].stateCode,
            zipcode: loc[0].zipcode,
            country: loc[0].countryCode
        };
        // Do not save the address field in the database
        this.address = undefined;
        next();
    } catch (error) {
        console.error('Geocoding error:', error);
        next(error);
    }
});


/*BootcampSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location ={
        type: 'point',
        coordinates :[loc[0].longitude, loc[o].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipCode,
        country: loc[0].countryCode
    }
    //Do not save addtess in Db
    this.address = undefined;
    next();
})*/


module.exports = mongoose.model('model', BootcampSchema);




























/*const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'please add a name'],
        unique:true,
        trime:true,
        maxlength:[50,'name can not be more then 50 characters']
    },
    slug: string,
    description:{
        required:[true, 'please add a description'],
        unique:true,
        maxlength:[500,'name can not be more then 50  description']
       

    },
    website:{
        type: String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'please use a valid url with HTTP with or HTTPs '
        ]
    },
    phone:{
        type: String,
        maxlength:[20,'phone number can not be longer then 20 characters']

    },
    email:{
        type:String,
        match:[
            /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\]/,
            'please valide Email'
        ]
    },
   address:{
    type: String,
    required:[true,'please add an address']
   },
   location:{
    //GeoJson point
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      },
      formattedAddress:String,
      street:String,
      city:String,
      zipcode: String,
      country: String,
    },
    careers:{
        //Array of string
        type:[String],
        required: true,
        emum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data science',
            'Business',
            'other'
        ]
    },
    averageRating:{
        type: Number,
        min:[1,'Rating must be at leaste 1'],
        max:[ 10, 'Rating must can not be more then 10']
    },
    averageCost:Number,
    photo:{
        type: String,
        default: 'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        defualt: false,

    },
    jobGuarantee:{
        type:Boolean,
        default: false,
    },
    acceptGi:{
        type: Boolean,
        default:false,
    },
    createdAt:{
        type: Date,
        default:date.now
    }
   
   
   

})

module.exports = mongoose.model('model',BootcampSchema)*/
