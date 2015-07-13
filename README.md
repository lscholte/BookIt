# BookIt
#### Repository for UVic SENG 299 Project
---
This project implements a web application running on node.js, express.js, angular.js, and mongoose.js. To run the contents of this repository, install node from [https://nodejs.org](https://nodejs.org "Install Node.js"). The run the following commands:
```bash
> npm install
> node server.js
```
___
The web application will be accessable through your modern browser, at __http://localhost:8080__. This repository currently has a database key and secret assocaited with it. These are both included in the repository. However, should they be removed, the following database link and secret will give access to a testing database used during development. These keys need to be represented in config.js for the application to function properly.
```
	'database': 'mongodb://admin:nodejs@ds043942.mongolab.com:43942/bookit',
	'secret': 'Bookitsecret'
```
In general any relational database can be used to run this application.

___
Some users are available for testing. Use any of the following username password pairs to login to the bookit system.

| Username      | Password      | User Type     |
| ------------- | ------------- | ------------- |
| mithrandir    | secret        | Admin         |
| alphabet      | radar         | staff_faculty |
| nomnomnom     | ILOVECOOKIES  | student       |
| garbageman    | lifeofaslob   | student       |