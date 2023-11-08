const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utill/wrapAsync.js");
const passport = require("passport");
const { redirect } = require("../miderware.js");
const { compile } = require("ejs-mate");




router.get("/singup", (req, res) => {
    res.render("user/singup.ejs");
});


router.post("/singup", wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash("success", "welcome to airbnb");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }


}));


// login route
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});


router.post("/login", redirect, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    req.flash("success", "Welcome back");
    console.log(res.locals.redirect + "this is redirect");
    res.redirect(res.locals.redirect || "/listings");
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    });
    req.flash("success", "goodbye");
    res.redirect("/listings");
});





module.exports = router;