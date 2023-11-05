module.exports.logedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }

    next();
};

module.exports.redirect = (req, res, next) => {
    console.log(req.session.returnTo);
    if (req.session.returnTo) {
        res.locals.redirect = req.session.returnTo;
    }
    next();
}
