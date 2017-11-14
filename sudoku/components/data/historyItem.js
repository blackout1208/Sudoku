import React, { Component } from 'react';

class HistoryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="list-group-item" onClick={() => this.props.onClick(this.props.data._id)}>
                <div className="history-list media">
                    <div className="media-left">
                        {this.props.data.date}
                    </div>
                </div>
            </li>
        );
    }
}

export default HistoryItem;