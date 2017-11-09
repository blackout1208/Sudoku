const Express = require('express');
const Routes = require('./routes');
const App = Express();
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise; // Para que serve?
Mongoose.connect('mongodb://localhost/sudoku', { useMongoClient: true });

//says to app parse any object in an json
App.use(BodyParser.json());
Routes(App);

//Layer that intercepts any error
App.use((err, req, resp, next) => {
    //422 UNPROCESSABLE ENTITY -> client error
    resp.status(422).send({ error: err._message });
});

module.exports = App;