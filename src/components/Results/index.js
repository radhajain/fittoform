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
            dressRatings: [],
            dressesLoaded: false,
            dresses: [],
        };
        console.log(this.state);
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
        this.getDressesInfo = this.getDressesInfo.bind(this);
        this.goToItemView = this.goToItemView.bind(this);
        this.getHeightStr = this.getHeightStr.bind(this);
    }

    componentDidMount() {
        // this.getBestDressGroupID().then(() => this.getBestDressesID());
        this.getBestDressGroupID();
    }

    //UPdate rating isn't working as intended 

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
        //TODO: This is problematic -- sometimes isn't populated ******
        console.log(this.state.dressGroupID);
        //Gets the array of dress IDs from the groupID. Populates this.dressesIDs
        firebase.database().ref('dressGroup').child(this.state.dressGroupID).on('value', snapshot => {
            var dressIDs = []
            var dressRatings = []
            snapshot.forEach(dress => {
                console.log(dress.val());
                dressIDs.push(dress.val().dress);
                dressRatings.push(dress.val().rating);
            })
            console.log(dressIDs);
            this.setState({dressRatings: dressRatings});
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
            this.setState({dressesLoaded: true});
        }) ;
        
    }


    goToItemView(selectedItem, key) {
        var dressID = this.state.dressesIDs[key];
        this.props.history.push({
            pathname: '/item',
            state: {
                item: selectedItem,
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bust: this.state.bust,
                size: this.state.size,
                closestMeasurements: this.state.closestMeasurements,
                dressID: dressID,
            }
        });
    }

    getHeightStr() {
        var heightFt = Math.floor(this.state.height / 12);
        var heightIn = this.state.height % 12;
        return heightFt + "'" + heightIn;
    };


    render() {
        const users = this.state;
        return (
        <div className="results-container-outer">
                <div className="results-leftCol">
                    <div className="results-leftCol-inner">
                        <div className="results-grid">
                            {this.state.dresses.map((dress, key) => {
                                return (
                                    <div className="results-col" onClick={() => this.goToItemView(dress, key)} key={key}>
                                        <div className="results-item-div">
                                            <img src={dress.img} className="results-img"/>
                                            <p className="results-rating">Rated {this.state.dressRatings[key]}/10 by women like you</p>
                                            <p className="results-price">${dress.price}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="results-rightCol">
                    <div className="results-rightCol-inner">
                        <div>
                            <p className="results-text" style={{textAlign: 'right'}}>Curated for:</p>
                            <form style={{textAlign: 'right'}}>
                                    <input
                                    name="name"
                                    type="text"
                                    className="results-input"
                                    onChange={this.handleInput} 
                                    placeholder="YOUR NAME"/>
                                    
                            </form>
                        </div>
                        <div className="results-title-div">
                            <p className="results-title">Chosen for you</p>
                        </div>
                        <div className="results-right-flexCol">
                            <div className="results-text-div">
                                <p className="results-text">Recommended by other women that are {this.getHeightStr(this.state.closestMeasurements.height)}, bust {this.state.closestMeasurements.bust}, waist: {this.state.closestMeasurements.waist}, hips: {this.state.closestMeasurements.hips}</p>
                                <p className="results-text" style={{fontSize: '0.75em' , color: '#652D2D'}}><i>Your measurements: {this.getHeightStr(this.state.height)}, bust: {this.state.bust}, waist: {this.state.waist}, hips: {this.state.hips}</i> </p>

                            </div>
                        </div>
                    </div>
                </div>
                
        </div>
        );
    }
 }

export default withFirebase(Results);