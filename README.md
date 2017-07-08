# Todo list exercise

## Install

- Install https://nodejs.org/en/
- Download archive from link provided
- Unzip file and cd into it
- run `npm install`

## Run
`node app.js`

Visit http://localhost:8080 in your browser

## High level application requirements
1. Multiple users should be able to view the shared public todo list
2. Should be able to add items
3. Should be able to delete items
4. Should be able to edit items (Missing feature)
5. Must be able to deploy in docker (Missing feature)

## Tasks
1. Add missing requirement #4 to the application (Done)
2. Add sufficient test coverage to the application and update readme on howto run the tests (Done)
3. Add missing requirement #5 to the application (Dockerfile and update readme with instructions) (Done)

## Bonus
4. Display test coverage after tests are executed (Done)
5. Find and fix the XSS vulnerability in the application. Also make sure that it wont happen again by including a test. (Done)

> ## Notes
> - Update the code as needed and document what you have done in the readme below
> - Will be nice if you can git tag the tasks by number

## Solution
Starting Updates:
- Fixed a spelling mistake, 'What shoud I do?' to 'What should I do?'

### Task 1:
Updates:
- front-end - Converted all todos that gets generated, from plain text into forms, allowing each todo to updated(be edited) via a basic form post.
- back-end - Added a post handler for edits of a specific todo item, this handler will replace the existing item's value with the new value.

### Task 2:
To run tests:
- `npm install`
- `npm test`

Updates:
- Added Mocha to add BDD.
- Added Chai to do assertions.
- Added Chai HTTP to do requests to the server in a headless mode.
- Added JSDOM to interpret the response from the server.
- Updated the app to make it a slight bit easier to test.
- Added tests to test the API's responses for all 4 request types ('/todo', '/todo/add', '/todo/delete/:id', '/todo/edit/:id').

### Task 3:
Instructions:
- Install Docker: https://docs.docker.com/engine/installation/.
- To build docker image: `docker build -t nodejs-todo .`
- To run docker image: `docker run -p 8080:8080 -d nodejs-todo`
- Navigate to `http://localhost:8080` to see the app running under docker.
- To stop docker image: `docker ps` grab the Container ID corresponding with the 'nodejs-todo' image then `docker stop ${ContainerID}`

Updates:
- Updated package.json to have the start script.
- Added the Dockerfile with instructions to run app.

### Task 4:
Instructions:
- `npm install`
- `npm test`

Updates:
- Added istanbul to add code coverage.
- Updated `npm test` command to run tests and produce code coverage report.
- Added more tests to test all areas of app.js.
- Updated app.js to have better if checks inside of /todo/delete/:id and /todo/edit/:id to ensure that non-existant ToDos can't be removed or edited.

### Task 5:
Instructions:
- `npm install`
- `npm test` this will show that 2 new tests were added to test XSS.
- `npm start`
- Enter `<script>alert("you have been pwned")</script>` into the ToDo list. No Popup should appear.
- Enter `<script>window.onload = function() {document.getElementById("newtodo").value = "You got pwned!";document.getElementById("new-submit").click();};</script>`.
The page should NOT go into an infinite loop adding 'you have been pwned' to your ToDo list.
- Edit the todo.ejs's `<%= todo %>` to `<%- todo %>` and repeat above tests to see the XSS happen.

Updates:
- Added helmet which does a couple of security updates to the headers.
- Updated the .ejs to use <%= (which does a proper HTML encoding) instead of <%- inside of the span element.
- Fixed a bug where you could no longer edit your ToDo items on the front-end, even though the response in npm tests were correctly editing the ToDo.
- Added 2 tests that checks if the `new JSDOM()` throws an error, which means you are trying to do 'window.alert' or other things. Also confirmed that the response does not contain the above 2 scripts.

### Task 6:
This is a self imposed task based on the fact that there was a bug inside of the .ejs file relating to the editing of a ToDo.

Instructions:
- `npm install`
- `npm run test:integration` This might fail, continue running until you see success.*
- Revert the bugfix done in Task 5: Edit todo.ejs `name=edittodo` to `name=edittodo-<%= index %>`
- `npm run test:integration` This will fail stating `expected '' to equal 'UpdatedToDo'`, because the app expects the body of the /todo/edit/:id post to contain `edittodo` and not `edittodo-<%= index %>`.

Updates:
- Added phantom to assist with integration testing.
- Added app.integration.js which runs a couple of phantom tests.
- Updated the app to export the listener so that we can open & close the app inside of the integration tests.

Notes:
- The Tasks before this was correct in stating that there was no problems when doing the tests, because chai-http tests the API and NOT the front-end.
- *The phantom tests will sometimes fail because of out of order execution of the commands/tests. Currently I have not found a way to ensure that the phantom tests runs in the correct order/timing, which is the reason it fails sometimes.
- Phantom allows us to be able to do front-end tests (full integration tests), which is able to pickup bugs like the one fixed inside of todo.ejs.

## Notes:
- Currently there is still a need for the normal `npm run test:mocha` which uses chai-http & JSDOM, as it consistent.
- In the future I will look more into phantom to resolve the out of order execution of commands/tests.
