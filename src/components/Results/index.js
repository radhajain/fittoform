import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import './Results.css';

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bust: this.props.location.state.bust,
            height: this.props.location.state.height,
            hips: this.props.location.state.hips,
            waist: this.props.location.state.waist,
            size: this.props.location.state.size,
            closestMeasurements: [],
            dressGroupId: null,
            dressesIDs: [],
            // dresses: [],
            dresses: [
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
                {
                    img: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg',
                    price: '$50',
                    name: 'T-shirt dress',
                    brand: 'superdown',
                    link: 'https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg'
                },
            ]
        };
        console.log(this.state);
        this.getBestDressGroupID = this.getBestDressGroupID.bind(this);
        this.getBestDressesID = this.getBestDressesID.bind(this);
        this.goToItemView = this.goToItemView.bind(this);
    }

    componentDidMount() {
        // this.getBestDressGroupID();
        // this.getBestDressesID();
        // var dressesInfo = []

        // this.state.dressesID.forEach(id => {
        //     const dress = {}
        //     this.props.firebase.dresses(id).on('value', snapshot => {
        //         dress = snapshot.val();
        //     });
        //     dressesInfo.push(dress);
        // })
        // this.setState({dresses: dressesInfo});
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
        this.props.firebase.dressGroup(this.dressGroupId).on('value', snapshot => {
            this.setState({dressesIDs: snapshot.val()});
        });
    }

    getDressesInfo(dressID) {
        this.props.firebase.dresses(dressID).on('value', snapshot => {
            return snapshot.value();
        });
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
                            <img src='https://is4.revolveassets.com/images/p4/n/c/BTWR-WD407_V1.jpg' className="results-img" />
                            <p>$50</p>
                        </div>
                    );
                })}
               
            </div>
          </div>
        );
    }
 }

export default withFirebase(Results);