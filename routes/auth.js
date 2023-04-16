const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');





// static methods =>   

router.get('/fakeuser', async (req, res) => {
    const user = {
        email: 'anvesha2405@gmail.com',
        username: 'anvesha'
    }
    const newUser = await User.register(user, 'anu12');
    // we havent defined username and passwrod fields in out User Schema, but passwordlocalmongoose plugin automatically adds these fields in the 'Object'
    res.send(newUser);
});


router.get('/register', (req, res) => {
    res.render('auth/signup');
})


// default names for a field can be chnaged, like username-is->email and password->is->password


router.post('/register', async (req, res) => {

    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const newUser = await User.register(user, password);

        req.login(newUser, function (err) {  //<- prvoided by passprt to login when user signUps
            if (err) {
                return next(err);
            }
            req.flash('success', 'Registered Successfully');
            return res.redirect('/products');
        })

        // req.flash('success','You have registered Successfully');
        // res.send(newUser);
        // res.redirect('/products'); <-- to check flash
    }
    catch (e) {
        req.flash('error', e.message);
        console.log(e);
        res.redirect('/register');
    }


})



router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login',
    //using middleware (of passport Package) going to call User.authenticate() jo actually database me credentials verifu krega, both are diffrent things, with same name method
    passport.authenticate('local', {
        failureRedirect: '/login', failureFlash: true //<-- allows us to use flash messages to Use
    }), (req, res) => {
        console.log(req.user); //req.user() property add krdeta hai passprt req ke andar, jab ap login krte ho
        req.flash('success', `Welcome Back Again!!  ${req.user.username}`);
        console.log('Logged In Successfully!');
        console.log('when logged in ', req.session.id)
        res.redirect('/products');
    });

router.get('/logout', async (req, res, next) => {
    console.log('Inside logout')
    req.flash('success', 'GoodBye');
    req.logout((err) => {
        if (err)
            console.log(err);
        next();
    });
    req.flash('error', 'Not able to');
    console.log('when logged out', req.session.id);
    console.log(req.flash('success'));
    res.redirect('/products');
})

module.exports = router;