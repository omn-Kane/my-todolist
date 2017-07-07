var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

var todolist = [];

/* The to do list and the form are displayed */
app.get('/todo', function(req, res) {
    res.render('todo.ejs', { todolist: todolist, clickHandler: "func1();" });
})

/* Adding an item to the to do list */
.post('/todo/add/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})


/* Edits an item from the to do list */
.post('/todo/edit/:id', urlencodedParser, function(req, res) {
    if (req.params.id != '') {
        todolist[req.params.id] = req.body['edittodo']
    }
    res.redirect('/todo');
})

/* Redirects to the to do list if the page requested is not found */
.use(function(req, res, next){
    res.redirect('/todo');
})

.listen(8080);

module.exports = app;
