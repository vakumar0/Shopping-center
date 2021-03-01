var express = require('express');
const { query } = require('../../config/mySqlConnection');
var router = express.Router();
var connection = require('../../config/mySqlConnection');
var ordersController = require('../controllers/orders');


router.get('/', ordersController.get_cart_records);

router.post('/', ordersController.save_to_cart, (req, res, next) => {
  const queryString = "SELECT *, sum(price) as total_price , count(product_id) AS total_items FROM `user.cart` WHERE user_id = 'admin' group by product_id;" ;
  connection.query(queryString, [req.body.product_name, req.body.category_id, req.body.price, req.body.user_id, req.body.product_id], (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else { 
      res.render('orders.ejs', {productInfo : rows});    
    }
  }); 
});

router.post('/purchaseCartItems', ordersController.checkValidPurchase,  (req, res, next) => {
  console.log('inside purchase route');
  console.log(req.params);
  let newStockAvailability = req.params.stock_availability - req.params.cart_count
  const queryString = "UPDATE `products.product_catalogue` \n" +
                      "SET stock_availability = " + newStockAvailability + "\n" +
                       "WHERE product_id = " + req.params.product_id +";" ;
  
  connection.query(queryString,  (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else { 
      //res.render('purchaseSuccess.ejs'); 
      ordersController.updateCart(req, res, next);
    }
  }); 
});


module.exports = router;
