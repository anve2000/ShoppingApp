const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const flash = require('connect-flash');


const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: 'false',
    saveUninitialiszed: true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7*1, // <== 1 week from now ==> post which my sesssion will expire if we dont remove the session the other ways and it is ONN
        maxAge: 1000*60*60*24*7*1
    }
}

app.use(session(sessionConfig));
app.use(flash());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//initialise middleware for using passport
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    // res.locals.user='Anvesha';
    res.locals.currentUser = req.user;
    //if a current user  loggen in doesnt exit, undefine pass krdega
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//1.22.23

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));

const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth')



app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);


passport.use(new LocalStrategy(User.authenticate()));  //<- provided by password Local mongoose





app.listen(5001, () => {
    console.log('server running at port 5001');
})

mongoose.connect('mongodb://127.0.0.1:27017/shoppingApp').then(() => console.log('connected database')).catch((err) => {
    console.log(err);
})

