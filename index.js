const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const hrRoutes = require('./routes/hr-routes');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const path = require('path');
const app = express();
const cookieSession = require("cookie-session");
const keys = require('./config/keys')

app.use(passport.initialize());

// set up view engine
app.set('view engine', 'ejs');

// set up cookie-session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);
app.use('/hr',hrRoutes);

// create home route
app.get('/', (req, res)=>{
    res.render('home');
});


// listen to requests
app.listen(3000, ()=> {
    console.log('app now listening for requests on port 3000');
});