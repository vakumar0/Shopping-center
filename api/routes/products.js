var express = require('express');
var router = express.Router();
var connection = require('../../config/mySqlConnection');
var productsController = require('../controllers/products')

// router.get('/', (res, req, next) => {
//     res.sender('index.ejs');
// })

/* params: category_id => (1) */
router.get('/getProductsByCategory/:categoryId', productsController.get_products_by_category);

/* params: category_id & sort by columnName => (1,price) */
router.get('/getProductsByOrder/:sortBy', productsController.get_products_by_sorting);

/* params: all categories => (1,11,21,31) */
router.get('/dashboard/:categoryIds', productsController.get_products_for_dashboard);

/* params: product_id & category_id => (5,11) */
router.get('/getProductInfo/:productInfo', productsController.get_single_product);

/* params: product_name => (iphone) */
router.get('/search/:productName', productsController.search_product);

router.get('/getAllProducts', productsController.get_all_products);

/* not implemented */
router.post('/', productsController.save_products);

/* not implemented */
router.delete('/:productId', productsController.delete_product);

module.exports = router;
