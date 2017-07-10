var server = require('../app').server;
var chai = require('chai');
var phantom = require('phantom');

var should = chai.should();

describe('App in Headless mode', function() {
    var sitepage = null;
    var phInstance = null;
    var page = null;
    var app = null;
    var catchFunction = function(err) {
        console.log(err);
        phInstance.exit();
        server.close();
    };

    // setup the phantom site and load the server's url.
    before(function(done) {
        phantom.create().then(function(instance) {
            phInstance = instance;
            return instance.createPage();
        }).then(function(localPage) {
            page = localPage;
            app = page.open('http://localhost:8080').catch(catchFunction);
            done();
        }).catch(catchFunction);
    });

    after(function() {
        phInstance.exit();
    });

    describe('Test App Load in headless mode', function() {
        // confirm the server is up and running
        it('Check TodoList Title', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    return document.title;
                }).then(function(res) {
                    res.should.be.equal('My todolist');
                    done();
                }).catch(catchFunction);
            });
        });
    });

    describe('Add new ToDo Item', function() {
        // do the actual add
        before(function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    document.getElementById('newtodo').value = 'NewToDo';
                    document.getElementById('new-submit').click();
                }).then(function() {
                    done();
                }).catch(catchFunction);
            });
        });

        // do the assertion
        it('should see new ToDo item', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    return document.getElementById('span-todo-0').innerHTML;
                }).then(function(res) {
                    res.should.be.equal('NewToDo');
                    done();
                }).catch(catchFunction);
            });
        });
    });

    describe('Edit ToDo Item', function() {
        // do the actual update
        before(function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    document.getElementById('edittodo-0').value = 'UpdatedToDo';
                    document.getElementById('edit-submit-0').click();
                }).then(function() {
                    done();
                }).catch(catchFunction);
            });
        });

        // do the assertion
        it('should see updated ToDo item', function(done) {
            app.then(function(res) {
                page.evaluate(function() {
                    // return document.all[0].innerHTML;
                    return document.getElementById('span-todo-0').innerHTML
                }).then(function(res) {
                    // console.log(res);
                    res.should.be.equal('UpdatedToDo');
                    done();
                }).catch(catchFunction);
            });
        });
    });
});
