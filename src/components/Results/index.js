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
            closestMeasurementsID: '',
            dressGroupID: null,
            dressesIDs: [],
            dresses: [],
            // dresses: [
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            //     {
            //         img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
            //         price: '$50',
            //         name: 'T-shirt dress',
            //         brand: 'superdown',
            //         link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
            //     },
            // ]
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
        var dressGroup
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
                    this.setState({closestMeasurementsID: measurement.key});
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
            <div>
            <h1>Results</h1>
            <p>Results for {this.state.height} in women that are size: {this.state.bust}, {this.state.waist}, {this.state.hips}</p>
            <div className="results-grid">
                {this.state.dresses.map((dress, key) => {
                    return (
                        <div className="results-col" onClick={() => this.goToItemView(dress)} key={key}>
                            <img src={dress.img} className="results-img" />
                            <p>${dress.price}</p>
                        </div>
                    );
                })}
               
            </div>
          </div>
        );
    }
 }

export default withFirebase(Results);