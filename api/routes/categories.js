var express = require('express');
var router = express.Router();
var categories = require('../controllers/categories');

router.get('/', categories.get_all_categories);

router.get('/:categoryId', categories.get_category);

router.post('/', (req, res, next) => {
    res.send('categories was created!!');
});

module.exports = router;