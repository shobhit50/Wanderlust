const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const path = require("path");
const wrapAsync = require("../utill/wrapAsync.js");
const ExpressEroor = require("../utill/expressErorr.js");
const Review = require("../models/reviews.js");
const { logedIn } = require("../miderware.js");


// app.use((req, res, next) => {
//     res.locals.current = req.user;
//     console.log(req.user);
//     next();
// });


// index Route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// -----------------------------------------------------------------//


//New Route
router.get("/new", logedIn, (req, res) => {

    // console.log(req.user)
    res.render("listings/new.ejs");
});

// Create Route
router.put("/new", logedIn, wrapAsync(async (req, res) => {
    try {
        let data = req.body;
        const newListing = new listing(data);
        newListing.owner = req.user._id;

        await newListing.save().catch(err => console.log(err));
        req.flash("success", "Successfully made a new listing!");
        res.redirect("/listings");

    } catch (error) {
        next(error)

    }

}));


// const port = process.env.PORT || 8080;


// -----------------------------------------------------------------//


// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allListings = await listing.findById(id).populate("rewiews").populate("owner");
    if (!allListings) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    console.log(allListings);
    res.render("listings/show.ejs", { allListings });
}));



// -----------------------------------------------------------------//

// Edit Route
router.get("/Edit/:id", logedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allListings = await listing.findById(id);
    if (!allListings) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/Edit.ejs", { allListings });
}));

//UPdate route

router.put("/Edit/:id", logedIn, wrapAsync(async (req, res, next) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let allListings = await listing.findByIdAndUpdate(id, data);
        if (!allListings) {
            throw new ExpressError(404, "Resource not found");
        }
        res.render("listings/show.ejs", { allListings });
    } catch (err) {
        next(err);
    }
}));


// router.put("/listings/Edit/:id", warpAsync(async (req, res) => {
//     let { id } = req.params;
//     let data = req.body;
//     let allListings = await listing.findByIdAndUpdate(id, data);
//     console.log({ allListings });
//     res.render("listings/show.ejs", { allListings });

// }));

// -----------------------------------------------------------------//


// Delete Route
router.delete("/:id", logedIn, wrapAsync(async (req, res) => {
    const { id } = req.params
    // console.log(id);
    let deletedListing = await listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Successfully Delete listing!");
    res.redirect("/listings");
}));



module.exports = router;