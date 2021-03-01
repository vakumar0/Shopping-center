var connection = require('../../config/mySqlConnection');

exports.get_all_categories = (req, res, next)=>{
    console.log('get_all_categories started');
    connection.query("SELECT * FROM `products.product_categories` WHERE is_active = '1'", (err, rows, fields)=>{
        if(err) {
            throw err;
        } else {         
            res.send(rows);
        }
    });    
}

exports.get_category = (req, res, next) => {
    connection.query("SELECT * FROM `products.product_categories` WHERE is_active = '1' AND category_id = ?", [req.params.categoryId], (err, rows, fields) => {
        if(err) {
            throw err;
        } else {            
            res.send(rows);
        }
    });
}