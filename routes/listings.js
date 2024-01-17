const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const path = require("path");
const wrapAsync = require("../utill/wrapAsync.js");
const ExpressEroor = require("../utill/expressErorr.js");
const Review = require("../models/reviews.js");
const { logedIn, isOwner } = require("../miderware.js");
const multer = require("multer");
const { storage } = require("../coludinaryConfig.js");
const { log } = require("console");
const upload = multer({ storage });


// app.use((req, res, next) => {
//     res.locals.current = req.user;
//     console.log(req.user);
//     next();
// });


// index Route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await listing.find({}).populate("rewiews");
    res.render("listings/index.ejs", { allListings });
    try {

        for (const list of allListings) {
            const populatedList = await listing.findById(list._id).populate("rewiews");
            const reviews = populatedList.rewiews;
            if (reviews.length != 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                avgRating = totalRating / reviews.length;
            } else {
                avgRating = 0;
            }
            avgRating = parseFloat(avgRating.toFixed(2))
        }
    }
    catch (error) {
        console.log(error);

    }
}));

// -----------------------------------------------------------------//


//New Route
router.get("/new", logedIn, (req, res) => {

    // console.log(req.user)
    res.render("listings/new.ejs");
});

// Create Route
router.put("/new", logedIn, upload.single('image'), wrapAsync(async (req, res) => {
    try {

        let { path, filename } = req.file;
        let data = req.body;
        const newListing = new listing(data);
        newListing.owner = req.user._id;
        newListing.image.url = path;
        newListing.image.filename = filename;

        await newListing.save().catch(err => console.log(err));
        req.flash("success", "Successfully made a new listing!");
        res.redirect("/listings");

    } catch (error) {
        next(error)

    }
    console.log(req.file);

}));


// const port = process.env.PORT || 8080;


// -----------------------------------------------------------------//


// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allListings = await listing.findById(id).populate({ path: "rewiews", populate: "auther" }).populate("owner");
    let avg = 0;
    for (let i = 0; i < allListings.rewiews.length; i++) {
        avg += allListings.rewiews[i].rating;
    }
    avg = avg / allListings.rewiews.length;
    avg = parseFloat(avg.toFixed(2))
    console.log(avg);

    if (!allListings) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    // console.log(allListings);
    res.render("listings/show.ejs", { allListings, avg });
}));

// -----------------------------------------------------------------//





// -----------------------------------------------------------------//

// Edit Route
router.get("/Edit/:id", logedIn, isOwner, upload.single('image'), wrapAsync(async (req, res) => {
    let { id } = req.params;

    let allListings = await listing.findById(id);
    if (!allListings) {
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/Edit.ejs", { allListings });
}));

//UPdate route

router.put("/Edit/:id", logedIn, isOwner, upload.single('image'), wrapAsync(async (req, res, next) => {
    try {
        let { id } = req.params;
        let data = req.body;

        console.dir(req.body);
        // this is the new image 
        let allListings = await listing.findByIdAndUpdate(id, data);
        console.log({ allListings });
        if (!allListings) {
            throw new ExpressError(404, "Resource not found");
        }
        if (typeof req.file !== "undefined") {
            let { path, filename } = req.file;
            allListings.image.url = path;
            allListings.image.filename = filename;
            await allListings.save();
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
router.delete("/:id", logedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params
    // console.log(id);
    let deletedListing = await listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Successfully Delete listing!");
    res.redirect("/listings");
}));



module.exports = router;