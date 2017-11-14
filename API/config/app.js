const Express = require('express');
const Routes = require('./routes');
const App = Express();
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const Cors = require('cors')

Mongoose.Promise = global.Promise; // Para que serve?
Mongoose.connect('mongodb://localhost/sudoku', { useMongoClient: true });

App.use(Cors());
App.use(BodyParser.urlencoded({extended: true}));
//says to app parse any object in an json
App.use(BodyParser.json());

Routes(App);

module.exports = App;