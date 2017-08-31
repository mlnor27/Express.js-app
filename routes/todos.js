var express = require('express');
var router = express.Router();
var elmomento = require('moment');

var Todo = require('../models/todo');

function ensureAuth(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/users/login');
  }
}


/* GET home page. */
router.get('/create', ensureAuth, function(req, res) {
    res.render('./todos/create', { title: 'Create Todo' });
  
});

router.post('/create', (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  var priority = req.body.priority;
  var dueDate = req.body.dueDate;
  var creationDate = Date();

  // Validation
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('priority', 'Priority is required').notEmpty();
  req.checkBody('dueDate', 'Due date is required').notEmpty();
  
  var errors = req.validationErrors();

  if (errors){
    console.log(errors);
    res.render('./todo/create', {errors: errors});
  }
  else
  {
    var newTodo = new Todo({
      title: title,
      description: description,
      priority: priority,
      due_date: dueDate,
      creation_date: creationDate

    });

    Todo.createTodo(newTodo, function(err, user){
      if (err) throw err;
  
    });

    req.flash('success_msg', 'Todo created');

    res.redirect('/');

  }
});

router.get('/details/:_id', ensureAuth, function(req, res){
  Todo.getTodoById(req.params._id, function(err, td){
    if (err) throw err;

    res.render('./todos/details', {title: 'Details - ' + td.title, tdo: td});
  });
});

router.get('/edit/:_id', ensureAuth, (req, res) => {
  Todo.getTodoById(req.params._id, function(err, td){
    if (err) throw err;

    res.render('./todos/create', {title: 'Edit - ' + td.title, todo: td});
  });
});

router.post('/edit/:_id', ensureAuth, (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  var priority = req.body.priority;
  var dueDate = req.body.dueDate;

  // Validation
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('priority', 'Priority is required').notEmpty();
  req.checkBody('dueDate', 'Due date is required').notEmpty();
  
  var errors = req.validationErrors();

  if (errors){
    console.log(errors);
    res.render('./todo/edit', {errors: errors});
  }
  else
  {
    //console.log(Date(dueDate));
    var udate = elmomento(Date(dueDate)).toISOString();
    //console.log(udate);

    var editTodo = {
      title: title,
      description: description,
      priority: priority,
      due_date: udate
    };

    Todo.updateTodo(req.params._id, editTodo, {}, function(err, user){
      if (err) throw err;
  
    });

    req.flash('success_msg', 'Todo edited');

    res.redirect('/');

  }
});

router.get('/delete/:_id', ensureAuth, (req, res) => {
  Todo.removeTodo(req.params._id, function(err, user){
    if (err) throw err;

  });

  req.flash('success_msg', 'Todo deleted');

  res.redirect('/');
});



module.exports = router;