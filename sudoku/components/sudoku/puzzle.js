import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Row from './row';
import Button from '../actions/button';
import Axios from 'axios';

class Puzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: null,
            sudoku: props.game
        }
    }
    componentWillReceiveProps(props) {
        this.setState({ sudoku: props.game });
    }

    componentWillMount() {
        this.setState({ loading: "Loading..." });
    }

    componentDidMount() {
        if (this.state.sudoku === null) {
            var self = this;
            Axios.get('http://localhost:8888/sudoku/')
                .then(function (response) {
                    self.setState({ loading: null, sudoku: response.data.sudoku });
                })
                .catch(function (error) {
                    self.setState({ sudoku: '' });
                });
        }
    }

    buildGrid() {
        var rows = [];
        var grid = this.state.sudoku.userSolution;
        for (var i = 0; i < 9; i++) {
            rows[i] = <Row key={i} id={i} onSetValue={(value, elemID) => this.onSetValue(value, elemID)}
                sudoku={grid !== undefined ? grid : ''} />;
        }
        return rows.map((value) => {
            return value;
        });
    }

    onSetValue(newValue, cellId) {
        var _sudoku = this.state.sudoku;
        newValue = parseInt(newValue);
        if (parseInt(_sudoku.solution[cellId]) === newValue) {
            _sudoku.userSolution[cellId] = newValue;
            this.setState({ sudoku: _sudoku });
        }
        else {
            this.buildGrid();
        }
    }

    newGame(newGame) {
        if (newGame !== undefined) {
            this.setState({ sudoku: newGame.sudoku });
        }
    }

    restartGame(value) {
        var _sudoku = this.state.sudoku;
        _sudoku.userSolution = _sudoku.puzzleBoard;
        this.setState({ sudoku: _sudoku });
    }

    solveSudoku() {
        var _sudoku = this.state.sudoku;
        _sudoku.userSolution = _sudoku.solution;
        this.setState({ sudoku: _sudoku });
    }

    checkSolution(isSolved) {
        if (isSolved !== undefined) {
            if (isSolved === true) {
                alert("You Won");
            }
            else {
                alert("Not correct!");
            }
        }
    }

    addHintValue(hintData) {
        if (hintData !== undefined) {
            var sudoku = this.state.sudoku;
            sudoku.userSolution[hintData.hintPosition] = hintData.hintValue;
            this.setState({ sudoku: sudoku });
        }
    }

    render() {
        if (this.state.loading !== null) {
            return this.state.loading;
        }
        var id;
        var rowsElements
        var saveGameButton;
        var hintButton;
        var solutionButton;
        var solveButton;
        var restartGameButton;

        if (this.state.sudoku !== null) {
            id = this.state.sudoku._id;
            rowsElements = this.buildGrid();
            saveGameButton = <Button text="Save Game" action="savegame"
                identifier={this.state.sudoku._id} userSolution={this.state.sudoku.userSolution} />;
            restartGameButton = <Button text="Restart Game" action="restartgame" identifier={this.state.sudoku._id}
                 restartGame={value => this.restartGame(value)} />;
            hintButton = <Button text="Hint" identifier={this.state.sudoku._id}
                userSolution={this.state.sudoku.userSolution}
                action="hint"
                addHint={this.addHintValue.bind(this)} />;
            solutionButton = <Button text="Check Solution" action="checksolution"
                identifier={this.state.sudoku._id} userSolution={this.state.sudoku.userSolution}
                checkSolution={this.checkSolution.bind(this)} />;
            solveButton = <Button text="Solve Solution" action="solvesudoku"
                solveSudoku={this.solveSudoku.bind(this)} />;
        }

        return (
            <div className="col-md-8" id={id}>
                <table><tbody>{rowsElements}</tbody></table>
                <Button text="New Game" action="newgame"
                    newGame={this.newGame.bind(this)} />
                {saveGameButton}
                {restartGameButton}
                <br />
                {hintButton}
                {solutionButton}
                {solveButton}
            </div>
        );
    }
}

export default Puzzle;