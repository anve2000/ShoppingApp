const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const { validateReview } = require('../middleware')

router.post('/products/:productid/review', validateReview, async (req, res) => {
    try {
        const { productid } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productid);

        const review = new Review({ rating, comment });
        console.log(req.body);

        product.reviews.push(review);
        // hmne to pura ka pura review push krdiya
        // but backend me actually mongo ne sirf is review ki id push ki hai products array ke andar

        await review.save();
        await product.save();

        // await product.populate('reviews');

        // res.send('Review Route');
        // res.render('products/show',{product});
        req.flash('success','Added review')
        res.redirect(`/products/${productid}`)
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }

})

module.exports = router;