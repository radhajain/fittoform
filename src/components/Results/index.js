import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.location.state;
        this.setState({
            closestMeasurements: [],
            dressGroupId: null,
            dressesIDs: [],
            dresses: []
        });
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
    }

    componentDidMount() {
        this.getBestDressGroupID();
        this.getBestDressesID();
        var dressesInfo = []
        // for(dressID in this.state.dressesIDs) {
        //     currDressInfo = this.getDressesInfo(dressID);
        //     dressesInfo.push(currDressInfo);
        // }


        this.state.dressesID.forEach(id => {
            const dress = {}
            this.props.firebase.dresses(id).on('value', snapshot => {
                dress = snapshot.val();
            });
            dressesInfo.push(dress);
        })
        this.setState({dresses: dressesInfo});
    }

    getBestDressGroupID() {
        //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements 
        // and this.state.dressGroupId
        var lowestDiff = Number.MAX_VALUE;
        this.props.firebase.measurements().on('value', snapshot => {
            snapshot.forEach(measurement => {
                //gets measurements with the minimum difference to current user
                var values = measurement.key.split(',');
                var diffSq = (values[0] - this.state.height)^2 + (values[1] - this.state.waist)^2 + (values[2] - this.state.bust)^2 + (values[3] - this.state.hips)^2;
                if (Math.sqrt(diffSq) < lowestDiff) {
                    lowestDiff =  Math.sqrt(diffSq);
                    this.setState({closestMeasurements: values});
                    this.setState({dressGroupId: measurement.val()});
                }
            })
        });
    }

    getBestDressesID() {
        //Gets the array of dress IDs from the groupID. Populates this.dressesIDs
        this.props.firebase.dressgroup(this.dressGroupId).on('value', snapshot => {
            this.setState({dressesIDs: snapshot.val()});
        });
    }

    getDressesInfo(dressID) {
        this.props.firebase.dresses(dressID).on('value', snapshot => {
            return snapshot.value();
        });
    }

    // componentDidMount() { 

    //     this.getBestDressGroup();

    //     this.getBestDressesID();

        
        
    //     //For all measurements of that height:
    //         //Find min difference squared
    //     //Get group id of dress collection with those measurements
    //     //For each dress id in group id
    //         //Populate state with dress object



    //     // this.props.firebase.items().on('value', snapshot => {
    //     // console.log(snapshot);
    //     //   this.setState({
    //     //     items: snapshot.val(),
    //     //   });
    //     // });
    // }

    render() {
        const users = this.state;
        return (
            <div>
            <h1>Results</h1>
            <p>Results for {this.state.height} in women that are size: {this.state.bust}, {this.state.waist}, {this.state.hips}</p>
            <div className="results-grid">
                <div className="results-col">
                    <img src='https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg' />
                    <p>$50</p>
                </div>

            </div>
          </div>
        );
    }
 }

export default withFirebase(Results);