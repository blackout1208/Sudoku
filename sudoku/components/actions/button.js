import React, { Component } from 'react';
import Axios from 'axios';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    request() {
        switch (this.props.action) {
            case 'newgame': this.newGameRequest(); break;
            case 'savegame': this.saveGameRequest(); break;
            case 'restartgame': this.restartRequest(); break;
            case 'hint': this.hintRequest(); break;
            case 'checksolution': this.checkSolutionRequest(); break;
            case 'solvesudoku': this.props.solveSudoku(); break;
            default: console.log('Action not defined');
        }
    }

    newGameRequest() {
        Axios.get('http://localhost:8888/sudoku/')
            .then((response) => {
                this.props.newGame(response.data);
            })
            .catch((error) => {
                return undefined;
            });
    }

    saveGameRequest() {
        Axios.put(`http://localhost:8888/sudoku/save/${this.props.identifier}`, {
            userSolution: this.props.userSolution
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Saved");
                }
                else {
                    alert(response.status);
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    checkSolutionRequest() {
        Axios.post(`http://localhost:8888/sudoku/checksolution/${this.props.identifier}`, {
            proposal: this.props.userSolution
        })
            .then((response) => {
                this.props.checkSolution(response.data.solved);
            })
            .catch((error) => {
                return undefined;
            });
    }

    restartRequest() {
        Axios.put(`http://localhost:8888/sudoku/restart/${this.props.identifier}`)
            .then(response => {
                if (response.data.isRestarted === true) {
                    this.props.restartGame(true);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    hintRequest() {
        Axios.post(`http://localhost:8888/sudoku/hint/${this.props.identifier}`, {
            userSolution: this.props.userSolution
        })
            .then((response) => {
                this.props.addHint(response.data);
            })
            .catch((error) => {
                return undefined;
            });
    }
    render() {
        return (
            <input type="button" value={this.props.text} onClick={this.request.bind(this)} />
        )
    }
}
export default Button;