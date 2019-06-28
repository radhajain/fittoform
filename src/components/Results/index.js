import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';
import './Results.css';
import { tsConstructorType } from '@babel/types';
import { FooterSmall } from '../Footer';

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
            exactMatch: false,
            dresses: [],
        };
        console.log(this.state);
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
        this.getDressesInfo = this.getDressesInfo.bind(this);
        this.getDressInfo = this.getDressInfo.bind(this);
        this.goToItemView = this.goToItemView.bind(this);
        this.getHeightStr = this.getHeightStr.bind(this);
    }

    componentDidMount() {
        // this.getBestDressGroupID().then(() => this.getBestDressesID());
        this.getBestDressGroupID().then(result => {
            console.log(result);
            this.setState({closestMeasurements: result[0]});
            if (result[2] === 0) {
                this.setState({exactMatch: true});
            }
            this.setState({dressGroupID: result[1]}, () => {
                this.getBestDressesID();
            });
        });
    }
 

    getBestDressGroupID() {
        //Gets the ID of a group corresponding to an array of dress IDs. Populates this.state.closestMeasurements 
        // and this.state.dressGroupId
        var lowestDiff = Number.MAX_VALUE;
        var closestMeasurements, dressGroupID;
        var measurementsRef = firebase.database().ref('measurements');
        return new Promise((resolve, reject) => {
            measurementsRef.once('value').then((snapshot) => {
                snapshot.forEach(measurement => {
                    console.log("getting differences!")
                    var values = measurement.val();
                    console.log(values);
                    var heightDiff = (Math.abs(values.height - this.state.height) < 1) ? 0 : (Math.abs(values.height - this.state.height) - 1);
                    var diffSq = Math.pow((heightDiff),2) + Math.pow((values.waist - this.state.waist),2) + Math.pow((values.bust - this.state.bust),2) + Math.pow((values.hips - this.state.hips),2);
                    console.log(diffSq);
                    if (Math.sqrt(diffSq) < lowestDiff) {
                        lowestDiff =  Math.sqrt(diffSq);
                        console.log("updating state");
                        closestMeasurements = values;
                        dressGroupID = values.dressGroupID;
                    }
                });
                resolve([closestMeasurements, dressGroupID, lowestDiff]);
            });
        });
    }

        
    //TODO: getBestDressesID and getDressesInfo can be condensed into one

    getBestDressesID() {
        //Gets the array of dress IDs from the groupID. Populates this.dressesIDs
        var dressGroupIDRef = firebase.database().ref('dressGroup').child(this.state.dressGroupID);
        dressGroupIDRef.once('value', snapshot => {
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



    //Using the dressesIDs populated by getBestDresses, gets information about each dress
    getDressesInfo() {
        var dressesRef = firebase.database().ref('dresses')
        dressesRef.once('value').then(snapshot => {
            return Promise.all(this.state.dressesIDs.map(dressID => {
                return dressesRef.child(`${dressID}`);
            }));
        }).then((dressesRefs) => {
            var promises = []
            for (const dressRef of dressesRefs) {
                promises.push(this.getDressInfo(dressRef));
            }
            Promise.all(promises).then((dresses) => {
                this.setState({dresses: dresses});
            })
        });
    }

    //Given the reference to a dress, gets information about the dress
    getDressInfo(dressRef) {
        return dressRef.once('value').then((snapshot) => {
            return snapshot.val();
        });
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
        //TODO: make results page responsive
        const imgClassName = (this.state.dresses.length === 1 ? "results-img-single" : "results-img");
        return (
        <div>
        <div className="results-container-outer">
                <div className="results-leftCol">
                    <div className="results-leftCol-inner">
                        <div className="results-grid">
                            {this.state.dresses.map((dress, key) => {
                                return (
                                    <div className="results-col" onClick={() => this.goToItemView(dress, key)} key={key}>
                                        <div className="results-item-div">
                                            <img src={dress.img} className={imgClassName}/>
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
                        <div className="results-name-div">
                            <p className="results-text" style={{textAlign: 'right'}}>Curated for:</p>
                            <form style={{textAlign: 'right'}}>
                                    <input
                                    name="name"
                                    type="text"
                                    className="results-input"
                                    onChange={this.handleInput} 
                                    placeholder="ADD YOUR NAME"/>
                                    
                            </form>
                        </div>
                        <div className="results-title-div">
                            <p className="results-title">Chosen for you</p>
                        </div>
                        <div className="results-right-flexCol">
                            <div className="results-text-div">
                                <p className="results-text">Recommended by other women that are {this.getHeightStr(this.state.closestMeasurements.height)}, bust {this.state.closestMeasurements.bust}, waist: {this.state.closestMeasurements.waist}, hips: {this.state.closestMeasurements.hips}</p>
                                <p className="results-text-small"><i>Your measurements: {this.getHeightStr(this.state.height)}, bust: {this.state.bust}, waist: {this.state.waist}, hips: {this.state.hips}</i> </p>
                                <p className="results-match">EXACT MATCH</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <FooterSmall />
        </div>
        
        );
    }
 }

export default withFirebase(Results);