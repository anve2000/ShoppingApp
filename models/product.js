const mongoose = require('mongoose');
const Review = require('./review')


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    img:{
        type:String,
        trim:true,
        default:'/images/product.jpg'
    },
    price:{
        type:Number,
        min:10,
        default:0
    },
    desc:{
        type:String,
        trim:true
    },
    reviews:[
        {
           type:mongoose.Schema.Types.ObjectId,
        //   object id is not a  'string' its a schema type
             //obect id is not a primary data type like String,number, text etc.
           ref:'Review' // mention this bcoz we are using 'populate'
           //bas ek string ki form me naam bata diya hai refernce ka databse ko, 'Review' koi value nahi hai,bas string hai, hence require krne ki zarurat nahi hai
           //ref == Review collection
        }
    ]
});

// function that u want to run before the 'findOneAndDelete' method runs
productSchema.pre('findOneAndDelete',async function(data){ //<== 'data' jo delete hua wo return krta hai 'findOneAndDelete', delete hone ke baad agar koi middleware isse call kre to, but becoz delete hone se pehle ye middleware call hua hai, the data is NULL right noww.

    console.log('Pre Middleware Function');
    console.log(data);
});



// ye 'findOneAndDelete' middleware chalne ke baad ye wala middleware call hoga
// productSchema.post('findOneAndDelete',async function(data){
//     console.log('Post Middleware Function');
//     console.log(data);
// });

productSchema.post('findOneAndDelete',async function(product){
    // console.log(product);
    if(product.reviews.length>0){
        await Review.deleteMany({_id:{$in:product.reviews}});
    }
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;