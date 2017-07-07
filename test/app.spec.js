var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var JSDOM = require('jsdom').JSDOM;

var should = chai.should();
chai.use(chaiHttp);

describe('App', function() {
    describe('/todo/add', function() {
        it('should have the add ToDo item input', function(done) {
            chai.request(server)
                .get('/todo')
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    dom.window.document.getElementById('newtodo').name.should.be.a('string'); // confirming it exists
                    done();
                });
        });

        it('should be able to add ToDo item', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': 'testTodo'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    dom.window.document.getElementById('span-todo-0').innerHTML.should.be.equal('testTodo');
                    done();
                });
        });

        it('should be able to add a second ToDo item', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': 'testTodo2'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    dom.window.document.getElementById('span-todo-1').innerHTML.should.be.equal('testTodo2');
                    done();
                });
        });
    });

    describe('/todo/delete', function() {
        it('should be able to delete a ToDo item', function(done) {
            chai.request(server)
                .get('/todo/delete/0')
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // we now confirm that the 2nd ToDo is now the first ToDo
                    dom.window.document.getElementById('span-todo-0').innerHTML.should.be.equal('testTodo2');
                    done();
                });
        });
    });

    describe('/todo/edit', function() {
        it('should be able to update a ToDo item', function(done) {
            chai.request(server)
                .post('/todo/edit/0')
                .type('form')
                .send({'edittodo': 'UpdatedToDo'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // we now confirm that the 2nd ToDo is now the first ToDo
                    dom.window.document.getElementById('span-todo-0').innerHTML.should.be.equal('UpdatedToDo');
                    // console.log(res.text);
                    done();
                });
        });
    });


    // for later use
    // const dom = new JSDOM(`<body><script>document.body.appendChild(document.createElement("hr"));</script></body>`, { runScripts: "dangerously" });
});
