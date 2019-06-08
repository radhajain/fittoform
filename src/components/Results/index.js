import React, { Component } from 'react';

class Results extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = this.props.location.state;
        console.log(this.state);
    }

    render() {
        return (
            <div>
            <h1>Results</h1>
            <p>Results for {this.state.height} in women that are size: {this.state.bust}, {this.state.waist}, {this.state.hips}</p>
          </div>
        );
    }
 }

export default Results;