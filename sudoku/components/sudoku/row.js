import React, { Component } from 'react';
import Cell from './cell';

class Row extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        var cells = [];
        var _id = this.props.id * 9;
        var val = this.props.sudoku;
        for (var i = 0; i < 9; i++) {
            if(this.props.sudoku !== null){
                cells[i] = <Cell key={i} id={_id} onSetValue={this.props.onSetValue}
                                    readOnly={val[_id] !== null ? true : false}
                                    value={val[_id] !== null ? val[_id] : ''}/>;
                _id++;
            }
        }
        var cellsElements = cells.map(function (value) {
            return value;
        });
        return (
            <tr>{cellsElements}</tr>
        );
    }
}

export default Row;