const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");


const listingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    rewiews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


//  ------------------->>>>>> this is a mongoose middleware that will delete all the reviews associated with a listing when the listing is deleted

listingSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.rewiews, } });
    }
});


// ------------------->>>>>>  this is a virtual property that will return the average rating of a listing

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

