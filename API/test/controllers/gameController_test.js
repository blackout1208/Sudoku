const Assert = require('assert');
const Request = require('supertest');
const App = require('../../config/app');
const Mongoose = require('mongoose');
const Puzzle = Mongoose.model('puzzle');
const MongoDB = require('mongodb');
const Comparator = require('../../helpers/Comparator');

describe('Sudoku Controller', () => {
    it('Generates a sudoku: /sudoku', (done) => {
        Puzzle.count()
            .then(count => {
                Request(App)
                    .get(`/sudoku/${3}`)
                    .end((err, response) => {
                        Assert(response.status === 200, response.error);
                        Assert(response.body.sudoku !== undefined);
                        Assert(response.body.sudoku.difficulty !== undefined);
                        Assert(response.body.sudoku.puzzleBoard.length !== 0);
                        Puzzle.count()
                            .then(newCount => {
                                Assert(count + 1 === newCount);
                                done();
                            });
                    })
                    .on("error", (err) => {
                        console.log("Error: " + err.message);
                    });
            });

    });

    it('Checks if a proposal it\'s the solution: /sudoku/checksolution/:id', done => {
        var id = '5a033f4ac1e6c425e6f60487';
        Request(App)
            .post(`/sudoku/checksolution/${id}`)
            .send({
                proposal: [5, 3, 8, 2, 6, 7, 0, 1, 4, 7, 2, 1, 0, 3, 4, 8, 5, 6, 0, 4, 6, 1, 8, 5, 3, 2, 7, 3, 5, 7, 4, 2, 0, 1, 6, 8, 1, 6, 4, 5, 7, 8, 2, 0, 3, 2, 8, 0, 6, 1, 3, 7, 4, 5, 8, 0, 2, 3, 4, 6, 5, 7, 1, 4, 7, 5, 8, 0, 1, 6, 3, 2, 6, 1, 3, 7, 5, 2, 4, 8, 0]
            })
            .end((err, response) => {
                Assert(response.status === 200, response.error);
                Assert(response.body.solved === true);
                done();
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });

    it('Gets the solution of sudoku: /sudoku/getsolution/:id', done => {
        var id = '5a033f4ac1e6c425e6f60487';
        Request(App)
            .get(`/sudoku/getsolution/${id}`)
            .end((err, response) => {
                Puzzle.findById(id)
                    .then((value) => {
                        Assert(response.status === 200, response.error);
                        var getDBsolution = Comparator.ArrayComparator(value.solution, response.body.puzzle);
                        Assert(getDBsolution === true);
                        done();
                    });
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });

    it('Gets a hint for the given position: /sudoku/hint/:id', done => {
        var id = '5a033f4ac1e6c425e6f60487';
        Request(App)
            .post(`/sudoku/hint/${id}`)
            .send({ userSolution: [null, null, 8, 2, null, null, 0, null, 4, null, null, 1, 0, 3, null, null, null, null, null, null, null, null, null, 5, null, 2, 7, null, 5, null, null, 2, null, null, null, null, null, 6, null, null, 7, null, null, null, null, null, null, 0, 6, null, null, null, 4, null, null, null, 2, null, null, null, 5, null, null, 4, null, null, 8, null, 1, 6, null, null, null, null, null, null, null, null, null, null, 0] })
            .end((err, response) => {
                Puzzle.findById(id)
                    .then((value) => {
                        Assert(response.status === 200, response.error);
                        const hintValue = response.body.hintValue;
                        const hintPosition = response.body.hintPosition;
                        const realHintValue = value.solution[hintPosition];
                        Assert(hintValue === realHintValue);
                        done();
                    });
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });

    it('Saves the game: /sudoku/save', done => {
        var id = '5a0349cd49ad1d2675e4e64d';
        Request(App)
            .post('/sudoku/save')
            .send({ id: id })
            .end(() => {
                Puzzle.findById({ _id: id })
                    .then(value => {
                        Assert(value.saved === true);
                        done();
                    });
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });

    it('Loads the game: /sudoku/load/:id', done => {
        var id = '5a0349cd49ad1d2675e4e64d';
        Request(App)
            .get(`/sudoku/load/${id}`)
            .end((err, response) => {
                Assert(response.body.sudoku !== undefined)
                done();
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });

    it('Loads all games: /sudoku/listgames', done => {
        Request(App)
            .post('/sudoku/listgames')
            .end((err, response) => {
                console.log(response.body);
                Assert(response.body.obj !== undefined);
                done();
            })
            .on("error", (err) => {
                console.log("Error: " + err.message);
            });
    });
});