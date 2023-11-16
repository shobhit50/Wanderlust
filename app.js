if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utill/wrapAsync.js");
const ExpressEroor = require("./utill/expressErorr.js");
const Review = require("./models/reviews.js");
const cookiesParser = require("cookie-parser");

const listings = require("./routes/listings.js");// this is for listing route
const reviews = require("./routes/reviews.js"); // this is for review route
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");        // this is for user model
const userRoutes = require("./routes/user.js");  // this is for user route



const port = process.env.PORT || 3001;
const dbpass = process.env.DB_PASS || "";

// data_Base Conection
main().then((res) => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airBnb');
}



// async function main() {
//     const uri = "mongodb+srv://shobhit:" + dbpass + "@cluster0.snn3wbn.mongodb.net/airBnb?retryWrites=true&w=majority";
//     await mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     console.log('Connected to MongoDB Atlas');
// }

// main().catch((err) => console.log(err));

app.use(cookiesParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: "thisisnotagoodsecrate",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1000ms * 60sec * 60min * 24hr * 7days
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }

}

// Root_Path
app.get("/", (req, res) => {
    console.log(req.cookies.username);
    res.cookie("name", "shobhit");
    res.send('<h3>hello im root</h3> <br> <form action="/listings"><button>go all listing</button></form>')
}
);


app.use(session(sessionOptions));
app.use(flash());


// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoutes);


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

// this is for review route and delete route----------------------------------//
// rating 

// -----------------------------------------------------------------//

app.get("/Search/:category", async (req, res) => {
    try {
        const category = req.params.category; // Access the 'category' property
        console.log(category);

        const allListings = await listing.find({ category: category });
        res.render("listings/index.ejs", { allListings });

        // console.log("All Listings:", allListings);
        console.log("All Listings2:");

        // Uncomment the following line if you want to send the listings as a JSON response
        // res.status(200).json(allListings);
    } catch (error) {
        console.error("Error fetching city listings:", error);
        res.status(500).send("Internal Server Error");
    }
});





app.all("*", (req, res, next) => {
    next(new ExpressEroor(400, "page not found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("listings/eroor.ejs", { message });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


