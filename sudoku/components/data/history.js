import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import HistoryItem from './historyItem';

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gamesId_Date: undefined
        }
    }

    componentDidMount() {
        var self = this;
        Axios.get('http://localhost:8888/sudoku/listgames')
            .then(function (response) {
                self.setState({ gamesId_Date: response.data.values });
            })
            .catch(function (error) {
                self.setState({ gamesId_Date: '' });
            });
    }

    render() {
        var savedGames = undefined;
        if (this.state.gamesId_Date !== undefined) {
            var key = 0;
            savedGames = this.state.gamesId_Date.map(value => {
                return <HistoryItem key={key++} data={value} onClick={(value) => this.props.onClick(value)}/>
            });
        }
        return (
            <div className="col-md-4">
                <h4>Saved Games</h4>
                <ul>{savedGames !== undefined ? savedGames : ''}</ul>
            </div>
        );
    }
}

export default History;