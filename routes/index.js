var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users')


router.get('/', function (req, res) {
    res.render('index', { currentUser: req.user })
});


//Auth Routes

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Signed Up Successfully')
            res.redirect('/posts');
        });
    });

});

router.get('/login', function (req, res) {
    res.render('login');
})

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function (req, res) {   
    })

router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfully")
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router