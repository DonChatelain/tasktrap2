//======================================== configuration ===============================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var backup = require('./model/tasks-backup.json');
var todoList = backup.Task[1].groupArray;

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

mongoose.connect('mongodb://donchatelain:spiral1@jello.modulusmongo.net:27017/abaxI5ti');
var Todo = mongoose.model('Todo', {
	text : String
});

//===================================    =====================

app.get('/', function(req, res) {
	res.sendFile('./public/index.html');
});
app.get('/admin', function(req, res) {
	res.sendFile('./public/admin.html');
});
app.get('/api/todos', function(req, res) {
	// res.json(todoList);
	Todo.find(function(err, todos) {
		if (err) {
			res.send(err);
		}
		res.json(todos);
	});
});

app.post('/api/todos', function(req, res) {
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err);

		Todo.find(function(err, todos) {
			if (err)
				res.send(err);

			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});




//===================================  listen - start app with >$ node server.js  =====================

app.listen(3000, function() {
	console.log('app starting on Port 3000');
});
