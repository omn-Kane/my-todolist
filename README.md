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
4. Display test coverage after tests are executed
5. Find and fix the XSS vulnerability in the application. Also make sure that it wont happen again by including a test.

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


Explain what you have done here and why...
