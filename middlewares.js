const Campground = require("./models/campground");
const Review = require("./models/reviews");
const { reviewSchema, campgroundSchema } = require('./joiSchemas');
const ExpressError = require('./utilities/expressError');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Log in to create or edit campgrounds');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isOwner = async(req, res, next) => {
    const {id} = req.params;
    const selectedCampground = await Campground.findById(id);
    if(!selectedCampground.owner.equals(req.user._id)) {
        req.flash('error', "You do not have permission to edit or delete the campground");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const isReviewAuthor = async(req, res, next) => {
    const {id, reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to delete the review");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
} 

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports = { isLoggedIn, storeReturnTo, isOwner, isReviewAuthor, validateCampground, validateReview };