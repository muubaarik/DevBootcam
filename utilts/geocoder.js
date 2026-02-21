require('dotenv').config();
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY,
    httpAdapter: 'https',
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;











/*const NodeGeocoder = require('node-geocoder');

const options ={
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apikey: process.env.GEOCODER_PROVIDER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options);


module.exports = geocoder;*/