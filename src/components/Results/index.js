import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class Results extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = this.props.location.state;
        console.log(this.state);
    }

    componentDidMount() {
        // this.props.firebase.items().on('value', snapshot => {
        // console.log(snapshot);
        //   this.setState({
        //     items: snapshot.val(),
        //   });
        // });
    }

    render() {
        const users = this.state;
        return (
            <div>
            <h1>Results</h1>
            <p>Results for {this.state.height} in women that are size: {this.state.bust}, {this.state.waist}, {this.state.hips}</p>
            <div className="results-grid">
                <div className="results-col"></div>

            </div>
          </div>
        );
    }
 }

export default withFirebase(Results);