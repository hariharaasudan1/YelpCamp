const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviewControllers');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;