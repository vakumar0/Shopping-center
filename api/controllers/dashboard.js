var connection = require('../../config/mySqlConnection');

exports.get_all_categories = (req, res, next) => {
    console.log("Get request get_all_categories start");
    console.log("fetching records for get_all_categories");
    connection.query("SELECT * FROM `products.product_categories` WHERE is_active = '1'", (err, rows, fields)=>{
        if(err) {
            throw err;
        } else {                               
            req.categories = rows;    
            get_products_for_dashboard(req, res, next);
        }
    });    
}

function get_products_for_dashboard (req, res, next) {
    console.log("Get request get_products_for_dashboard start");
    let categories = [];

    Object.keys(req.categories).forEach(function(key){
            let row = req.categories[key] 
            categories.push(row.category_id);            
    });

    const queryString = getQueryForDashboardProducts(categories);
     connection.query(queryString, (err, rows, fields) => {
        if (err) {
            throw err;
        } else {
            req.products = rows;   
            next()         
        }
    });
}

function getQueryForDashboardProducts(categories) {
    let queryArr = [];
    console.log("Get request getQueryForDashboardProducts start");
    for(let i=0 ; i < categories.length; i++) {
      let query = "";
      if(i == categories.length - 1) {
        query = "( SELECT product_id, t1.category_id, product_name, price, discount, rating, category_name, icon FROM `products.product_catalogue` t1 INNER JOIN `products.product_categories` t2 ON t1.category_id = t2.category_id WHERE t1.category_id = " + categories[i] + " AND t1.is_active = 1 LIMIT 5); \n";
      } else {
        query = "( SELECT product_id, t1.category_id, product_name, price, discount, rating, category_name, icon FROM `products.product_catalogue` t1 INNER JOIN `products.product_categories` t2 ON t1.category_id = t2.category_id WHERE t1.category_id = " + categories[i] + " AND t1.is_active = 1 LIMIT 5)\n UNION ALL \n";
      }
      queryArr.push(query);
    }  
    const queryString = queryArr.join('\n');
    console.log("Query create : " + queryString);
    return queryString;
}