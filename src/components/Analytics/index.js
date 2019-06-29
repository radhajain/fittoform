import React from 'react';
import firebase from 'firebase';
import * as CONST from '../../constants/shoppingConstants';


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Analytics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measurements: null,
        }
        this.addNamesToReviews = this.addNamesToReviews.bind(this);
        this.getMeasurements = this.getMeasurements.bind(this);
        this.getNumChildren = this.getNumChildren.bind(this);
    }

    componentDidMount() {
        // Run this function when we need to add names to reviews
        // this.addNamesToReviews();
        this.getMeasurements().then((mmt) => {
            this.setState({
                measurements: mmt
            });
            console.log(this.state.measurements);
        });
        
    }

    addNamesToReviews() {
        var reviewsRef = firebase.database().ref('reviews');
        reviewsRef.once('value').then((snapshot) => {
            snapshot.forEach((child) => {
                child.ref.child('userInfo').update({
                    name: CONST.names[getRandomInt(0, 414)]
                })
            });
        });

    }

    getNumChildren(dressGroupID) {
        var dressGroupRef = firebase.database().ref('dressGroup');
        return dressGroupRef.child(dressGroupID).once('value').then((snapshot) => {
            var numChildren = snapshot.numChildren();
            return numChildren;
        })
    }

    getMeasurements() {
        var measurementsRef = firebase.database().ref('measurements');
        return measurementsRef.once('value').then((snapshot) => {
            var measurements = []
            snapshot.forEach((child) => {
                var mmt = {}
                var concatMtms = child.val().concatMtms;
                this.getNumChildren(child.val().dressGroupID).then(numChildren => {
                    mmt.children = numChildren;
                    mmt.measurement = concatMtms;
                    measurements.push(mmt);
                });
            });
            return measurements;
        });
    }

    


    render() {
        return (
            <div>
                <p>Analytics</p>
                {this.state.measurements && this.state.measurements.map((measurement, key) => {
                    return (
                        <div key={key}>
                            <p>{measurement.measurement}</p>
                            <p>{measurement.children}</p>
                        </div>
                    );
                })}
            </div> 
        );
    }
}

export default Analytics;