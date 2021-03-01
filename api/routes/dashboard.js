const { render } = require('ejs');
var express = require('express');
var router = express.Router();
var dashboard = require('../controllers/dashboard');

router.get('/', dashboard.get_all_categories, (req, res, next) => {    
    res.render('index.ejs', {
            categoriesInfo : req.categories,
            productInfo: req.products
        }
    );
});


module.exports = router;