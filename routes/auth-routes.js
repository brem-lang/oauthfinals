const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login',(req, res)=>{
    res.render('login');
});

// auth logout
router.get('/logout',(req, res)=>{
    // handle with passport
    // res.send('logging out');
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google',passport.authenticate('google',{
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/callback',passport.authenticate('google'),(req, res)=>{
    // res.send('you reached the callback URI');
    res.redirect('/profile/');
});
// auth git
router.get('/github', passport.authenticate('github'));
router.get('/github/callback',passport.authenticate('github', { failureRedirect: '/login' }),(req, res) => {
    	res.redirect('/profile');
});

//auth with spotify
router.get('/spotify', passport.authenticate('spotify'), function(req, res) {});
router.get('/spotify/callback',passport.authenticate('spotify', { failureRedirect: '/login' }),function(req, res) {
    res.redirect('/profile/');
});

// auth with fb
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),(req, res)=>
{
   	res.redirect('/profile/');
});  


module.exports = router;