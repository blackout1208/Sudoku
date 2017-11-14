import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Puzzle from './sudoku/puzzle';
import History from './data/history';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedGame: null
        };
    }

    loadSavedGame(element){
        var self = this;
        Axios.get(`http://localhost:8888/sudoku/load/${element}`)
            .then((response) => {
                self.setState({ loadedGame: response.data.sudoku });
            })
            .catch((error) => {
                alert(error);
            });
    }

    render() {
        return (
            <div>
                <Puzzle game={this.state.loadedGame}/>
                <History onClick={value =>{this.loadSavedGame(value)}}/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('.container'));