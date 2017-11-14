// BASE SETUP
// ==================================================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./config/routes');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sudoku', { useMongoClient: true }); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 8888;

// ROUTES FOR OUR API
// ===================================================
var router = express.Router(); // get an instance of the express Router

// var headers = cors({
//     "origin": "http://localhost:8081",
//     "methods": "GET,PUT,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
// });
// router.use(headers);

// middleware to use for all requests
// Add headers
router.use((req, resp, next) => {

    // Website you wish to allow to connect
    resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');

    // Request methods you wish to allow
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    resp.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    resp.setHeader('Access-Control-Allow-Credentials', true);

    // do logging
    console.log('Response taking action...');
    next(); // make sure we go to the next routes and don't stop here
});

routes(router);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /sudoku
app.use('/sudoku', router);

// START THE SERVER
// ===================================================
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});