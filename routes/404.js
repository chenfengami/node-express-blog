const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
    res.status(404);
    res.render('404');
})

module.exports = router;