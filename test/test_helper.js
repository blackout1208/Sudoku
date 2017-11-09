const Mongoose = require('mongoose');

before(done => {
    Mongoose.connect('mongodb://localhost/sudoku', { useMongoClient: true });
    Mongoose.connection
        .once('open', () => done())
        .on('error', err  => {
            console.warn('warning', err);
        });
});