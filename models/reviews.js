const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
