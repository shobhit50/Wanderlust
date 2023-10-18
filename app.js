const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utill/wrapAsync.js");
const ExpressEroor = require("./utill/expressErorr.js");


// data_Base Conection
main().then((res) => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airBnb');
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));



// testing data
// app.get("/chat", async (req, res) => {
//     const samplelisting = new listing({
//         title: "Air bnb",
//         description: "this is aaa fist hotel",
//         price: 8000,
//         location: "utter pradesh",
//         country: "India"
//     })
//     await samplelisting.save().catch(err => console.log(err));
//     // console.log(samplelisting);
// })



// Root_Path
app.get("/", (req, res) => {
    res.send("hi im shobhit")
}
);

// index Route
app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// -----------------------------------------------------------------//


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.put("/listings/new", wrapAsync(async (req, res) => {
    try {
        let data = req.body;
        const newListing = new listing(data);
        await newListing.save().catch(err => console.log(err));
        res.redirect("/listings");

    } catch (error) {
        next(error)

    }

}));


// -----------------------------------------------------------------//


// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allListings = await listing.findById(id);
    res.render("listings/show.ejs", { allListings });
}));



// -----------------------------------------------------------------//

// Edit Route
app.get("/listings/Edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allListings = await listing.findById(id);
    res.render("listings/Edit.ejs", { allListings });
}));

//UPdate route

app.put("/listings/Edit/:id", wrapAsync(async (req, res, next) => {
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


// app.put("/listings/Edit/:id", warpAsync(async (req, res) => {
//     let { id } = req.params;
//     let data = req.body;
//     let allListings = await listing.findByIdAndUpdate(id, data);
//     console.log({ allListings });
//     res.render("listings/show.ejs", { allListings });

// }));

// -----------------------------------------------------------------//


// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params

    console.log(id);
    let deletedListing = await listing.findByIdAndDelete(id);

    console.log(deletedListing);
    res.redirect("/listings");
}));




app.all("*", (req, res, next) => {
    next(new ExpressEroor(400, "page not found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("listings/eroor.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is started successfully");
});
