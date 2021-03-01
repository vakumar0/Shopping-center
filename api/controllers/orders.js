const { NotExtended } = require('http-errors');
var connection = require('../../config/mySqlConnection');

exports.save_to_cart =  (req, res, next) => {   
  const queryString = "INSERT INTO `user.cart` (product_name, category_id, price, user_id, product_id ) VALUES( ? , ?, ? , ? , ?)";
  connection.query(queryString, [req.body.product_name, req.body.category_id, req.body.price, req.body.user_id, req.body.product_id], (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else {           
      next();
    }
  });   
}

exports.get_cart_records = (req, res, next) => {
  const queryString = "SELECT *, sum(price) as total_price , count(product_id) AS total_items FROM `user.cart` WHERE user_id = 'admin' group by product_id;" ;
  connection.query(queryString, (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else { 
      res.render('orders.ejs', {productInfo : rows});    
    }
  }); 
}

exports.checkValidPurchase = (req, res, next) => {
  
  const queryString = "SELECT t1.product_id, t1.stock_availability, count(t2.product_id) AS cart_count\n" +
                      "FROM `products.product_catalogue` t1\n" +
                      "INNER JOIN `user.cart` t2\n" +
                      "ON t1.product_id = t2.product_id\n" +
                      "WHERE t1.is_active = 1 AND t2.user_id = 'admin' AND t2.product_id = "+ [req.body.product_id] +";"                      

  connection.query(queryString, (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else { 
      console.log(req.params);    
      if(rows[0].stock_availability < rows[0].cart_count) {
        res.render('outOfStock.ejs');        
      } else {           
        req.params.stock_availability = rows[0].stock_availability;
        req.params.cart_count = rows[0].cart_count;
        req.params.product_id = rows[0].product_id;
        next();
      }    
    }
  }); 
}

exports.updateCart = (req, res, next) => {
  const queryString = "DELETE FROM `user.cart` \n" +
                      "WHERE product_id = " + req.params.product_id +";" ;

  connection.query(queryString,  (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else { 
      res.render('purchaseSuccess.ejs'); 
    }
  }); 
}
