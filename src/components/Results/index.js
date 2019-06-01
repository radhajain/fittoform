import React, { Component } from 'react';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCategory: this.props.location.state.itemCategory,
            colorValue: this.props.location.state.color,
            lengthValue: this.props.location.state.length,
        }
    }

    render() {
        return (
            <div>
            <h1>Results</h1>
            <p>Results for {this.state.itemCategory} that are {this.state.colorValue} and {this.state.length}</p>
          </div>
        );
    }
 }

export default Results;