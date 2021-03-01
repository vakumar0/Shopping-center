var connection = require('../../config/mySqlConnection');

exports.get_all_products = (req, res, next) => {
  const queryString = "SELECT * FROM `products.product_catalogue` WHERE is_active = 1 AND stock_availability > 0";
  connection.query( queryString, (err, rows, fields) => {
    if(err) {
      throw err;
    } else {
      res.send(rows);
    }
  });
}

exports.get_products_for_dashboard = (req, res, next) => {
  let categories = req.params.categoryIds.split(',');
  const queryString = getQueryForDashboardProducts(categories);
  connection.query(queryString, (err, rows, fields) => {
    if(err) {
      throw err;
    } else {
      res.send(rows);
    }
  });
}

exports.get_single_product = (req, res, next) => {
  let params = req.params.productInfo.split(',');
  console.log('params: ', params);
  const queryString = "SELECT category_id, reference_table FROM `products.product_categories` WHERE category_id = ?";
  connection.query(queryString, [params[1]], (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else {           
      if(rows.length == 0) {
        res.send('No record found');
      } else {
        return getCompleteProductsDetails(rows, res, params[0]);
      }      
    }
  }); 
}

exports.get_products_by_category =  (req, res, next) => {
  //const queryString = "SELECT category_id, reference_table FROM `products.product_categories` WHERE category_id = ?";
  const queryString = "SELECT product_id, t1.category_id, product_name, price, discount, icon, t2.category_name, rating \n" +
                      "FROM `products.product_catalogue` t1 \n"+
                      "INNER JOIN `products.product_categories` t2 \n" + 
                      "ON t1.category_id = t2.category_id \n" +
                      "WHERE t1.category_id = " + [req.params.categoryId] + " AND t1.is_active = 1 AND stock_availability > 0";
  connection.query(queryString, [req.params.categoryId], (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else {           
      if(rows.length == 0) {
        res.send('No record found');
      } else {
        res.render('productsSummary.ejs', {productInfo: rows});
      }      
    }
  });  
}

function getCompleteProductsDetails(rows, res, productId){  
  let categoryId = rows[0].category_id;
  let referenceTable = rows[0].reference_table;
  const query = "SELECT T1.*, T2.category_name, T3.* \n" +
                  "FROM `products.product_catalogue` T1 \n" + 
                  "INNER JOIN `products.product_categories` T2 \n" + 
                  "ON T1.category_id = T2.category_id \n" +
                  "INNER JOIN " + [referenceTable] + "T3 \n" +               
                  "ON T1.product_id = T3.product_id \n" +
                  "WHERE T1.category_id = " + [categoryId] +  " \n" +
                  "AND T1.is_active = 1  AND stock_availability > 0 AND T2.is_active = 1 AND T1.product_id = " + [productId];  
  connection.query(query, (err, rows, fields) => {
    if(err) throw err 
    else {       
      //res.send(rows);
      res.render('productDetails.ejs', {productInfo: rows});
    }
  });
}

exports.get_products_by_sorting =  (req, res, next) => {      
  let params = req.params.sortBy.split(',');
  const queryString = "SELECT product_id, t1.category_id, product_name, price, discount, icon, t2.category_name, rating \n" +
                      "FROM `products.product_catalogue` t1 \n" +
                      "INNER JOIN `products.product_categories` t2 \n" +
                      "on t1.category_id = t2.category_id \n" +
                      "WHERE t1.category_id = " + [params[0]] + " AND t1.is_active = 1  AND stock_availability > 0\n" +
                      "ORDER BY " + [params[1]] +" " +[params[2]];
  connection.query(queryString, (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else {           
      if(rows.length == 0) {
        res.send('No record found');
      } else {
        res.render('productsSummary.ejs', {productInfo: rows});
      }      
    }
  });  
}


exports.search_product = (req, res, next ) => {  
  console.log('Here top');
  const queryString = "SELECT product_id, product_name, price, discount, icon rating FROM `products.product_catalogue` WHERE stock_availability > 0 AND is_active = 1 AND product_name like '%" + [req.params.productName] + "%'";
  connection.query(queryString, (err, rows, fields) =>{
    if(err) {      
      throw err;
    } else {           
      if(rows.length == 0) {
        res.send('No record found');
      } else {
        console.log('Im here');
        //res.send(rows)
        res.render('productsSummary.ejs', {productInfo: rows});
      }      
    }
  }); 
}

/* For Admin */
exports.save_products = (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  };
  res.status(201).json({
    message: 'Handling POST request in products!!',
    product: product
  });
}

exports.delete_product = (req, res, next) => {
  let id = req.params.productId;
  res.send('Deleting a product: ' + id);
}


/* Helper functions */
function getQueryForDashboardProducts(categories) {
  let queryArr = [];
  for(let i=0 ; i < categories.length; i++) {
    let query = "";
    if(i == categories.length - 1) {
      query = "( SELECT product_id, category_id, product_name, price, discount, icon rating FROM `products.product_catalogue` WHERE category_id = " + categories[i] + " AND is_active = 1  AND stock_availability > 0 LIMIT 5); \n";
    } else {
      query = "( SELECT product_id, category_id, product_name, price, discount, icon rating FROM `products.product_catalogue` WHERE category_id = " + categories[i] + " AND is_active = 1  AND stock_availability > 0 LIMIT 5 )\n UNION ALL \n";
    }
    queryArr.push(query);
  }  
  const queryString = queryArr.join('\n');
  return queryString;
}