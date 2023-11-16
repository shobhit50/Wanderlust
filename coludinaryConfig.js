const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Wonderlut_Dev',
        allowedFormats: ['jpeg', 'png', 'jpg'],


    },


});
console.log("cloudinary config file");



module.exports = {
    cloudinary,
    storage
};