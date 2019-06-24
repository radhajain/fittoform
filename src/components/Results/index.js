import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import './Results.css';
import { tsConstructorType } from '@babel/types';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bust: this.props.location.state.bust,
            height: this.props.location.state.height,
            hips: this.props.location.state.hips,
            waist: this.props.location.state.waist,
            size: this.props.location.state.size,
            closestMeasurements: '',
            dressGroupID: null,
            dressesIDs: [],
            dresses: [],
        };
        console.log(this.state);
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
        this.getDressesInfo = this.getDressesInfo.bind(this);
        this.goToItemView = this.goToItemView.bind(this);
    }

    componentDidMount() {
        this.getBestDressGroupID();
    }

    getBestDressGroupID() {
        //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements 
        // and this.state.dressGroupId
        var lowestDiff = Number.MAX_VALUE;
        this.props.firebase.measurements().on('value', snapshot => {
            snapshot.forEach(measurement => {
                //gets measurements with the minimum difference to current user
                console.log("getting differences!")
                var values = measurement.val();
                console.log(values);
                var heightDiff = (Math.abs(values.height - this.state.height) < 1) ? 0 : (Math.abs(values.height - this.state.height) - 1);
                var diffSq = Math.pow((heightDiff),2) + Math.pow((values.waist - this.state.waist),2) + Math.pow((values.bust - this.state.bust),2) + Math.pow((values.hips - this.state.hips),2);
                console.log(diffSq);
                if (Math.sqrt(diffSq) < lowestDiff) {
                    lowestDiff =  Math.sqrt(diffSq);
                    console.log("updating state");
                    this.setState({closestMeasurements: values});
                    this.setState({dressGroupID: values.dressGroupID})
                }
            });
            console.log("after loop")
            this.getBestDressesID();
        });
    }

        
    

    getBestDressesID() {
        console.log(this.state.dressGroupID);
        //Gets the array of dress IDs from the groupID. Populates this.dressesIDs
        firebase.database().ref('dressGroup').child(this.state.dressGroupID).on('value', snapshot => {
            var dressIDs = []
            snapshot.forEach(dress => {
                console.log(dress.val());
                dressIDs.push(dress.val().dress);
            })
            console.log(dressIDs);
            this.setState({dressesIDs: dressIDs}, () => {
                console.log(this.state);
                this.getDressesInfo();
            });
        });
    }

    getDressesInfo() {
        var dresses = [];
        var allDresses;
        firebase.database().ref('dresses').once('value', snapshot => {
            allDresses = snapshot.val();
            console.log(allDresses);
            for (const dressID of this.state.dressesIDs) {
                console.log(allDresses[dressID]);
                var dressInfo = allDresses[dressID];
                console.log(dressInfo);
                dresses.push(dressInfo);
            }
            console.log(dresses);
            this.setState({dresses: dresses});
        }) ;
        
    }


    goToItemView(selectedItem) {
        // this.props.history.push({
        //     pathname: '/item',
        //     item: {selectedItem},
        //     // height: this.state.height,
        //     // waist: this.state.waist,
        //     // hips: this.state.hips,
        //     // bust: this.state.bust,
        //     // size: this.state.size,
        //     // closestMeasurements: this.state.closestMeasurements,
        //     // dresses: this.state.dresses
        // });

        this.props.history.push({
            pathname: '/item',
            state: {
                item: selectedItem,
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bust: this.state.bust,
                size: this.state.size
            }
        });
    }

    render() {
        const users = this.state;
        return (
        <div className="results-container-outer">
            <div className="results-container-inner">
                <p>Dresses that will look good on you</p>
                <p>Picked for your measurements:{this.state.height} inches tall, {this.state.bust}B, {this.state.waist}W, {this.state.hips}H</p>
                <p>Recommended by other women that are {this.state.closestMeasurements.height} inches tall, {this.state.closestMeasurements.bust}B, {this.state.closestMeasurements.waist}W, {this.state.closestMeasurements.hips}H</p>
                <div className="results-grid">
                    {this.state.dresses.map((dress, key) => {
                        return (
                            <div className="results-col" onClick={() => this.goToItemView(dress)} key={key}>
                                <div>
                                    <img src={dress.img} className="results-img" />
                                    <p className="results-price">${dress.price}</p>
                                </div>
                            </div>
                        );
                    })}
                
                </div>
            </div>
        </div>
        );
    }
 }

export default withFirebase(Results);