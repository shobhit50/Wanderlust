const express = require("express");
const router = express.Router({ mergeParams: true }); // this is for merge the params of the review and listing
const wrapAsync = require("../utill/wrapAsync.js");
const ExpressEroor = require("../utill/expressErorr.js");

const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");









// this is for review route and delete route----------------------------------//
// rating Route

router.post("/", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review);

    const Alllisting = await listing.findById(id);


    Alllisting.rewiews.push(review);
    await review.save();
    await Alllisting.save();
    console.log(review);

    // res.send("ok");
    res.redirect(`/listings/${id}`);
}
));

// delete route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { rewiews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}
));



module.exports = router;