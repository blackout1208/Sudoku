const Puzzle = require('../models/puzzle');
const Sudoku = require('sudoku');
const Assert = require('assert');
const Comparator = require('../helpers/Comparator');

module.exports = {
    //API to return a Sudoku board
    index(req, resp) {
        var puzzle = Sudoku.makepuzzle();
        var solution = Sudoku.solvepuzzle(puzzle);
        var level = Sudoku.ratepuzzle(puzzle, req.params.level);

        const newSudoku = new Puzzle({
            difficulty: level
            , puzzleBoard: puzzle
            , solution: solution
        });
        Puzzle.create(newSudoku)
            .then(createdSudoku => {resp.send({ sudoku: createdSudoku })});
    },
    //API to check if a Sudoku is valid
    checker(req, resp) {
        const sudokuId = req.params.id;
        const userSolution = req.body.proposal;
        Puzzle.findById(sudokuId)
            .then(value => {
                var isSolved = Comparator.ArrayComparator(userSolution, value.solution);
                resp.send({ solved: isSolved });
            });
    },
    //API to solve Sudoku
    solution(req, resp) {
        const sudokuId = req.params.id;
        Puzzle.findById(sudokuId)
            .then(value => {resp.send({ puzzle: value.solution })});
    },
    //API to give an hint
    hint(req, resp) {
        const sudokuId = req.params.id;
        const userSolution = req.body.userSolution;
        if (sudokuId === undefined || userSolution === undefined) {
            resp.status(400).send({ error: 'Bad Request' });
        }
        else {
            var indexForHint = -1;
            for (var i = 0; i <= userSolution.length; i++) {
                if (userSolution[i] === null) {
                    indexForHint = i;
                    break;
                }
            }
            Puzzle.findById(sudokuId)
                .then(value => {
                    const hint = value.solution[indexForHint];
                    console.log(hint);
                    value.puzzleBoard[indexForHint] = hint;

                    Puzzle.update(value)
                        .catch(next);

                    resp.send({
                        hintValue: hint
                        , hintPosition: indexForHint
                    });
                });
        }
    },

    //API to save sudoku
    save(req, resp) {
        const id = req.body.id;
        Puzzle.findByIdAndUpdate({ _id: id }, { saved: true })
            .then(() => Puzzle.findById({ _id: id }))
            .then(value => {resp.send(value)})
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
            });
    },

    //API to load all save games
    savedGames(req, resp) {
            var MongoClient = require('mongodb').MongoClient;
            var url = 'mongodb://localhost/sudoku';
    
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                db.collection("puzzles").find({}).toArray(function (err, result) {
                    if (err) throw err;
                    resp.send({ obj: result });
                    db.close();
                });
            });
    }
};