const mongoose = require("mongoose");
const initData = require("./data");
const listing = require("../models/listing.js");


main().then((res) => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airBnb');
}



const initDB = async () => {
    await listing.deleteMany();
    await listing.insertMany(initData.data);
    console.log(listing);
}


initDB();
