const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/userControllers');

const passport = require('passport');
const { storeReturnTo } = require('../middlewares');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;