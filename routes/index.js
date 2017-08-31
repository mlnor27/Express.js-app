var express = require('express');
var router = express.Router();

var Todo = require('../models/todo');


/* GET home page. */
router.get('/', ensureAuth, function(req, res) {
  Todo.getTodos((err, results) => {
    if (err) throw err;
    //console.log(results);
    res.render('index', { title: 'Dashboard', todos: results });
  });
  
});

function ensureAuth(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/users/login');
  }
}

module.exports = router;
