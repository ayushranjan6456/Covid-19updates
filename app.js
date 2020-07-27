const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/users.js')
var Post = require('./models/posts.js')
var Comment = require('./models/comments.js')
var indexRoutes = require('./routes/index')
var postRoutes = require('./routes/posts')
var helplineRoutes = require('./routes/helpline')
var casesRoutes = require('./routes/cases')
var contactRoutes = require('./routes/contact')
//seedDB = require('./seed.js')

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); ''
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://User:admin@cluster0.laclp.mongodb.net/new_database?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
//seedDB();

//Passport config
app.use(require('express-session')({
    secret: "Jon Snow kills Danny",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use(indexRoutes);
app.use(postRoutes);
app.use(helplineRoutes);
app.use(casesRoutes);
app.use(contactRoutes);

app.listen(process.env.PORT || 5000, function () {
    console.log("Server has Started at port 3000");
});
