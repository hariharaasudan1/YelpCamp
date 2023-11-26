const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
    const selectedCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    selectedCampground.reviews.push(newReview);
    await newReview.save();
    await selectedCampground.save();
    req.flash('success', "Review added");
    res.redirect(`/campgrounds/${selectedCampground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', "Review deleted");
    res.redirect(`/campgrounds/${id}`);
}