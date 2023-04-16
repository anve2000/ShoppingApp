const express = require('express');
const router = express.Router();
const Review = require('../models/review')



const Joi = require('joi');

const Product = require('../models/product');
const { validateProduct, isLoggedIn} = require('../middleware');

router.get('/products', async (req, res) => {
    try {
        // console.log(req.flash('success'));
        // console.log('inside products', req.session.id);

        const products = await Product.find({});
        res.render('products/index', { products });
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

router.get('/products/new', isLoggedIn, (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error','You need to login first');
        return res.redirect('/login');
    }
    try {
        res.render('products/new');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})


router.post('/products', isLoggedIn, validateProduct, async (req, res) => {
    try {
        // console.log('Andar ke params : -- ', req.params, ' -->Itne hi the params');
        // if(!req.xhr){
        //     res.send('This request not allowed')
        // }
        const { name, img, price, desc } = req.body;
        // const productSchema = Joi.object({
        //     name: Joi.string().required(),
        //     img: Joi.string().required(),
        //     price: Joi.number().min(0).required(),
        //     desc: Joi.string().required()
        // });
        // const { error } = productSchema.validate({ name, price, img, desc },(value)=>{
        //     console.log('GOT THAT ',value);
        // })
        // console.log(error);
        // console.log('Okayy from joi')
        await Product.create({ name, img, price, desc });
        req.flash('success','Successfully added new product')
        res.redirect('/products');
    }
    catch (e) {
        console.log(e);
        res.status(500).render('error', { err: e.message + '  mkjnhbgv' });
    }

})

router.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        await product.populate('reviews');
        res.render('products/show', { product});
        // res.render('products/show', { product,success:req.flash('success'), error:req.flash('error') });
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }



})

router.get('/products/:id/edit',isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product })
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
})

router.patch('/products/:id', isLoggedIn, validateProduct, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, img, desc } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, img });
        req.flash('success','edit your product successfully');
        res.redirect(`/products/${id}`)
    }
    catch (e) {
        // with e.message, only e, this prints :
        // CastError: Cast to ObjectId failed for value "flower" (type string) at path "_id" for model "Product"
        res.status(500).render('error', { err: e.message });
    }
})

router.delete('/products/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;

        // const product = await Product.findById(id);

        // for(let id of product.reviews){
        //     await Review.findByIdAndDelete(id);
        // }

        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

module.exports = router;