import React, { Component } from 'react';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    updateValue(event) {
        if (event.target.value.length === 1 || event.target.value.length === 0)
        {
            this.setState({ value: event.target.value });
            this.props.onSetValue(event.target.value, event.target.id);
        }
    }

    renderLayout() {
        var tdClassName = '';
        if (this.props.id % 9 === 2 || this.props.id % 9 === 5) {
            tdClassName = 'ColumnLimit';
        }

        if ((this.props.id >= 18 && this.props.id <= 26) ||
            (this.props.id >= 45 && this.props.id <= 53)) {
            tdClassName += ' RowLimit';
        }
        return tdClassName;
    }

    render() {
        var tdClassName = this.renderLayout();

        var val = this.props.value;
        if (val === '' && this.state.value !== this.props.value) {
            val = this.state.value;
        }
        
        var _class;
        if (this.props.readOnly !== false && this.props.readOnly !== null) {
            _class = "Closed";
        }

        return (
            <td className={tdClassName}>
                <input type="number" className={_class}
                    id={this.props.id} max="9" min="1"
                    value={val !== '' ? val : ''} readOnly={this.props.readOnly}
                    onChange={(e) => this.updateValue(e)} />
            </td>);
    }
}

export default Cell;