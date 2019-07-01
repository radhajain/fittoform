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
            heights: null,
            waist: null,
            hips: null,
            bust: null,
        }
        console.log(CONST.ages);
        this.addNamesToReviews = this.addNamesToReviews.bind(this);
        this.getMeasurements = this.getMeasurements.bind(this);
        this.getNumChildren = this.getNumChildren.bind(this);
        this.addAgesToReview = this.addAgesToReview.bind(this);
    }

    componentDidMount() {
        // Run this function when we need to add names to reviews
        this.addNamesToReviews();
        // this.addAgesToReview();
        this.getMeasurements().then((mmts) => {
            this.setState({
                measurements: mmts[0],
                heights: mmts[1],
                waist: mmts[2],
                hips: mmts[3],
                bust: mmts[4]
            });
            console.log(this.state);
            
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

    addAgesToReview() {
        var reviewsRef = firebase.database().ref('reviews');
        reviewsRef.once('value').then((snapshot) => {
            snapshot.forEach((child) => {
                child.ref.child('userInfo').update({
                    age: CONST.ages[getRandomInt(0, 10)]
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
            var heights =  {
                60: 0,
                61: 0,
                62: 0,
                63: 0,
                64: 0,
                65: 0,
                66: 0,
                66.5: 0,
                67: 0,
                68: 0,
                69: 0,
                70: 0,
                71: 0,
                72: 0,
                73: 0,
                74: 0,
            };
            var waist = {
                22: 0,
                23: 0,
                24: 0,
                25: 0,
                25.5: 0,
                26: 0,
                27: 0,
                28: 0,
                28.5: 0,
                29: 0,
                30: 0,
                31: 0,
                32: 0,
                33: 0,
                34: 0,
                35: 0,
                35.5: 0,
                36: 0,
                37: 0,
                38: 0,
                39: 0,
                40: 0,
                41: 0,
                42: 0
            }

            var hips = {
                22.5: 0,
                27: 0,
                32: 0,
                33: 0,
                34: 0,
                35: 0,
                35.5 : 0,
                36: 0,
                37: 0,
                38: 0,
                38.5: 0,
                39: 0,
                40: 0,
                41: 0,
                41.5: 0,
                42: 0,
                43: 0,
                44: 0,
                45: 0,
                47: 0,
                49: 0,
                51: 0
            }
            var bust = {
                32: 0,
            }
            snapshot.forEach((child) => {
                var mmt = {}
                var concatMtms = child.val().concatMtms;
                var waistMt = child.val().waist;
                var newWaist = waist[waistMt] + 1;
                waist[waistMt] = newWaist;
                var hipsMt = child.val().hips;
                var newHips = hips[hipsMt] + 1;
                hips[hipsMt] = newHips;
                var heightMt = child.val().height;
                var newHeight = heights[heightMt] + 1;
                heights[heightMt] = newHeight;
                heights[heightMt] = newHeight;
                var bustMt = child.val().bust;
                if (bustMt > 300) {
                    console.log(child.key);
                }
                if (bust[bustMt] === undefined) {
                    bust[bustMt] = 1
                } else {
                    var newBust = bust[bustMt] + 1;
                    bust[bustMt] = newBust;
                }
                this.getNumChildren(child.val().dressGroupID).then(numChildren => {
                    mmt.children = numChildren;
                    mmt.measurement = concatMtms;
                    measurements.push(mmt);
                });
            });
            return [measurements, heights, waist, hips, bust];
        });
    }

    


    render() {
        return (
            <div>
                <p>Analytics</p>
                {/* {this.state.measurements && this.state.measurements.map((measurement, key) => {
                    return (
                        <div key={key}>
                            <p>{measurement.measurement}</p>
                            <p>{measurement.children}</p>
                        </div>
                    );
                })} */}
            </div> 
        );
    }
}

export default Analytics;