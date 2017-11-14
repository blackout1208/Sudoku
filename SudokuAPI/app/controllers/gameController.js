const Puzzle = require('../models/puzzle');
const Sudoku = require('sudoku');
const Assert = require('assert');
const Comparator = require('../helpers/Comparator');

module.exports = {
    //API to return a Sudoku board
    index(req, resp, next) {
        var puzzle = Sudoku.makepuzzle();
        var solution = Sudoku.solvepuzzle(puzzle);
        var level = Sudoku.ratepuzzle(puzzle, 4);
        puzzle = puzzle.map(function (item) {
            if (item !== null) {
                return item + 1;
            }
            return null;
        });
        solution = solution.map(function (item) {
            return item + 1;
        });
        const newSudoku = new Puzzle({
            difficulty: level
            , puzzleBoard: puzzle
            , userSolution: puzzle
            , solution: solution
        });
        Puzzle.create(newSudoku)
            .then(createdSudoku => { resp.send({ sudoku: createdSudoku }) })
            .catch(next);
    },

    //API to check if a Sudoku is valid
    checker(req, resp, next) {
        const sudokuId = req.params.id;
        const userSolution = req.body.proposal;
        Puzzle.findById(sudokuId)
            .then(value => {
                var isSolved = Comparator.ArrayComparator(userSolution, value.solution);
                if (isSolved === true) {
                    value.userSolution = userSolution;
                    value.saved = false;
                    value.save((err, saved) => {
                        if (err) {
                            resp.status(500).send(err);
                        }
                        resp.status(200).send({solved: isSolved, obj: saved});
                    });
                }
            })
            .catch(next);
    },

    //API to give an hint
    hint(req, resp, next) {
        const sudokuId = req.params.id;
        const userSolution = req.body.userSolution;
        if (sudokuId === undefined) {
            resp.status(400).send({ error: 'Bad Request' });
        }
        else {
            Puzzle.findById(sudokuId)
                .then(value => {
                    var indexForHint = -1;
                    for (var i = 0; i <= userSolution.length; i++) {
                        if (userSolution[i] === null) {
                            indexForHint = i;
                            break;
                        }
                    }
                    const hint = value.solution[indexForHint];
                    value.userSolution[indexForHint] = hint;

                    Puzzle.findByIdAndUpdate({ _id: sudokuId }, value)
                        .catch(next);

                    resp.send({
                        hintValue: hint
                        , hintPosition: indexForHint
                    });
                })
                .catch(next);
        }
    },

    //API to save sudoku
    save(req, resp, next) {
        const id = req.params.id;
        Puzzle.findByIdAndUpdate({ _id: id }, { saved: true, userSolution: req.body.userSolution })
            .then(() => Puzzle.findById({ _id: id }))
            .then(value => { resp.send(value) })
            .catch(next);
    },

    //API to restart sudoku
    restart(req, resp, next){
        const id = req.params.id;
        Puzzle.findById({ _id: id })
            .then(value => {
                value.userSolution = value.puzzleBoard;
                value.save()
                    .then(value => resp.status(200).send({ isRestarted: true }));
            })
            .catch(next);
    },

    //API to load sudoku
    load(req, resp, next) {
        const id = req.params.id;
        Puzzle.findById({ _id: id })
            .then(value => {
                if (value.saved === true) {
                    resp.send({ sudoku: value });
                }
                else {
                    resp.send({ sudoku: null });
                }
            })
            .catch(next);
    },

    //API to load all save games
    savedGames(req, resp) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost/sudoku';


        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            db.collection("puzzles").find({saved: true}, {date: 1}).toArray((err, result) => {
                if (err) throw err;
                resp.send({ values: result });
                db.close();
            });
        })
    }
};