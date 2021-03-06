var server = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var jsdom = require('jsdom');

var JSDOM = jsdom.JSDOM;
var VirtualConsole = jsdom.VirtualConsole;

var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
    describe('/randompage', function() {
        it('should send you to /todo', function(done) {
            chai.request(server)
                .get('/randompage')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.req.path.should.be.equal('/todo');
                    done();
                });
        });
    });

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

        it('should not add a todo if ToDo item is empty', function(done) {
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': ''})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-2'), null);
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

        it('should not delete anything if ToDo ID is invalid', function(done) {
            chai.request(server)
                .get('/todo/delete/blarg')
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // we now confirm that the 2nd ToDo is now the first ToDo
                    dom.window.document.getElementsByClassName("edit-todo-form").length.should.be.equal(1);
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
                    // console.log(res.text);
                    dom.window.document.getElementById('span-todo-0').innerHTML.should.be.equal('UpdatedToDo');
                    done();
                });
        });

        it('should not be able to edit a non-existant ToDo item', function(done) {
            chai.request(server)
                .post('/todo/edit/123')
                .type('form')
                .send({'edittodo': 'UpdatedToDo123'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // console.log(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-123'), null);
                    done();
                });
        });

        it('should ignore string IDs for edit', function(done) {
            chai.request(server)
                .post('/todo/edit/blarg')
                .type('form')
                .send({'edittodo': 'UpdatedToDoBlarg'})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var dom = new JSDOM(res.text);
                    // console.log(res.text);
                    should.equal(dom.window.document.getElementById('span-todo-blarg'), null);
                    done();
                });
        });
    });

    describe('XSS attacks should not work', function() {
        it('should not allow XSS when adding a ToDo item', function(done) {
            var theScript = '<script>alert("you have been pwned")</script>';
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': theScript})
                .end(function(err, res) {
                    res.should.have.status(200);
                    var virtualConsole = new VirtualConsole();
                    virtualConsole.on("jsdomError", function() { chai.assert.fail(Error, null, 'Error was thrown by JSDOM'); });
                    var dom = new JSDOM(res.text, { virtualConsole: virtualConsole, runScripts: "dangerously" });
                    // this will confirm that HTML encoding has happened.
                    dom.window.document.getElementById("span-todo-1").should.not.equal(theScript);
                    done();
                });
        });

        it('should not allow XSS when adding a ToDo item, 2nd test', function(done) {
            var theScript = '<script>window.onload = function() {document.getElementById("newtodo").value = "You got pwned!";document.getElementById("new-submit").click();};</script>';
            chai.request(server)
                .post('/todo/add')
                .type('form')
                .send({'newtodo': theScript})
                .end(function(err, res) {
                    res.should.have.status(200);
                    // console.log(res.text);
                    var virtualConsole = new VirtualConsole();
                    virtualConsole.on("jsdomError", function() { chai.assert.fail(Error, null, 'Error was thrown by JSDOM'); });
                    var dom = new JSDOM(res.text, { virtualConsole: virtualConsole, runScripts: "dangerously" });
                    // this will confirm that HTML encoding has happened.
                    dom.window.document.getElementById("span-todo-2").should.not.equal(theScript);
                    done();
                });
        });
    });
});
