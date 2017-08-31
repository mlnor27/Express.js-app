var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodetraining', { 
    useMongoClient: true
});
var db = mongoose.connection;

var TodoSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    due_date: {
        type: Date
    },
    creation_date: {
        type: Date
    }
});

var Todo = module.exports = mongoose.model('Todo', TodoSchema);

module.exports.getTodos = function(callback){
    Todo.find(callback);
}

module.exports.getTodoById = function(elid, callback){
    Todo.findById(elid, callback);
}

module.exports.createTodo = function(newTodo, callback){
    Todo.create(newTodo, callback);
}

module.exports.updateTodo = function(id, updateTodo, option, callback){
    Todo.findOneAndUpdate({ _id: id}, updateTodo, option, callback);
}


module.exports.removeTodo = function(id, callback){
    Todo.remove({ _id:id }, callback);
}
