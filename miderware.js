const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const expressError = require("./utill/expressErorr.js");


module.exports.logedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }

    next();
};

module.exports.redirect = (req, res, next) => {
    // console.log(req.session.returnTo);
    if (req.session.returnTo) {
        res.locals.redirect = req.session.returnTo;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let Listings = await Listing.findByIdAndUpdate(id);
    // console.log(Listings + "this is the listing");
    if (!Listings.owner.equals(req.user._id)) {  // this is for check the user is owner or not res.locals.currUser._id
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewAuther = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.auther.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
