import React, { Component } from 'react';
import firebase from 'firebase';
import backBtn from '../../assets/images/back-btn.png';
import './Item.css';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.location.state;
        console.log(this.state);
        var review = {
            comment: '',
            size: '',
            rating: ''
        }
        this.state.review = review;
        this.getHeightStr = this.getHeightStr.bind(this);
        this.getReviewData = this.getReviewData.bind(this);
        this.goToResultsView = this.goToResultsView.bind(this);

    }

    getHeightStr() {
        var heightFt = Math.floor(this.state.height / 12);
        var heightIn = this.state.height % 12;
        return heightFt + "'" + heightIn;
    };

    getReviewData() {
        const reviewsRef = firebase.database().ref('reviews');
        var mmts = this.state.closestMeasurements;
        reviewsRef.orderByChild('dressID').equalTo(this.state.dressID).on('value', snapshot => {
            console.log(snapshot.val());
            snapshot.forEach(data => {
                console.log(data.val().userInfo);
                var reviewerMmts = data.val().userInfo;
                if (mmts.height == reviewerMmts.height && mmts.bust == reviewerMmts.bust && mmts.waist == reviewerMmts.waist && mmts.hips == reviewerMmts.hips) {
                    console.log("match found!");
                    var review = {
                        comment: data.val().comment,
                        size: data.val().size,
                        rating: data.val().rating
                    }
                    this.setState({review: review}, () => {
                        return true;
                    })
                }
            });
        });
    }

    componentDidMount() {
        this.getReviewData();
    }

    goToResultsView() {
        this.props.history.push({
            pathname: '/results',
            state: {
                height: this.state.height,
                waist: this.state.waist,
                hips: this.state.hips,
                bust: this.state.bust,
                size: this.state.size,
                closestMeasurements: this.state.closestMeasurements,
            }
        });
    }

    render() {
        //TODO: add reviews for each user and recommended size 
        //TODO: fix back button to results
        return (
        <div className="itemView">
            <div className="itemView-c1">
                <div className="itemView-c1-inner">
                    <div className="itemView-c1-left">
                        <div className="itemView-c1-text">
                            
                            <div className="itemView-titleBtn-div">
                                <div className="itemView-title-div">
                                    
                                    <button className="itemView-backbtn" onClick={() => this.goToResultsView()} >
                                        <img src={backBtn} style={{paddingRight: 15, width: 25 }} />
                                        Back to all results
                                    </button>
                                    <p className="itemView-item-title">{this.state.item.name}</p>
                                </div>
                                <a href={this.state.item.dressLink} style={{display: "table-cell"}} target="_blank">
                                <button className="itemView-shop-btn">SHOP</button>
                                </a>
                            </div>
                            <p className="itemView-item-brand" style={{marginTop: 0}}>{this.state.item.brand}</p>
                            <p className="itemView-item-brand">Available in {this.state.item.color}</p>
                            <p className="itemView-item-size">Recommended size: {this.state.review.size}</p>
                            <p className="itemView-item-price">${this.state.item.price}</p>


                            {/* { isSaved(this.selectedItem.name)
                            ? <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Removed from Saved</button>
                            : <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Save for later</button>
                            } */}
                        
                            <p className="itemView-review-title"> <i>See what other people with your measurements have to say</i></p>
                            <p className="itemView-item-measurements"><i>Showing women that are {this.getHeightStr()}, waist: {this.state.waist}", hips: {this.state.hips}", bust: {this.state.bust}" </i></p>
                            <hr />

                            <div className="itemView-review">
                                {/* <p className="itemView-numRating">10/10</p> */}
                                <p className="itemView-numRating">{this.state.review.rating}/10</p>
                                <div>
                                    <p className="itemView-comment">{this.state.review.comment}</p>
                                    {/* <p className="itemView-comment">I tried the XS too and this fits much better! I love this print and fit for summer! It's a cute length too, would definitely recommend!</p> */}
                                    <p className="itemView-review-name"> - Alina</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="itemView-c1-right">
                        <img alt={this.state.item.name} src={this.state.item.img} className="itemView-img"/>
                    </div>
                </div>
            </div>
        </div>
        );
    }
 }

export default Item;