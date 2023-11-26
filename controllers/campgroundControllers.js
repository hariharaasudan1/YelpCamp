const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', { allCampgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.owner = req.user._id;
    await newCampground.save();
    req.flash('success', "New campground created!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const selectedCampground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');
    res.render('campgrounds/show', { selectedCampground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const toBeEditedCampground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { toBeEditedCampground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    editedCampground.images.push(...newImages);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await editedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await editedCampground.save();
    req.flash('success', "Campground updated successfully!");
    res.redirect(`/campgrounds/${editedCampground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Campground deleted successfully!");
    res.redirect('/campgrounds');
}