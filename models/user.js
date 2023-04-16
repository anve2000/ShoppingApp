const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



const userSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required: true
    },
    
    // username,hash,salt apne ap add krdega passportLocalMongoose

});

console.log(userSchema);

userSchema.plugin(passportLocalMongoose); //schema is now ready to harness the power of  passportLocalMongoose, username and password fields add krdega and password ko hash bhi krdega

const User = new mongoose.model('User',userSchema);

module.exports = User;