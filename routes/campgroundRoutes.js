const express = require('express');
const router = express.Router();
const multer = require('multer');

const catchAsync = require('../utilities/catchAsync');
const campgrounds = require('../controllers/campgroundControllers');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateCampground } = require('../middlewares');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgrounds.createCampground));
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isOwner, upload.array('images'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm));

module.exports = router;