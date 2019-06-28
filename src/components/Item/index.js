import React, { Component } from 'react';
import firebase from 'firebase';
import backBtn from '../../assets/images/back-btn.png';
import './Item.css';
import { FooterSmall } from '../Footer';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.location.state;
        console.log(this.state);
        var review = {
            comment: '',
            size: '',
            rating: '',
        }
        this.state.reviews = [review];
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
        var reviews = []
        var reviewQuery = reviewsRef.orderByChild('dressID').equalTo(this.state.dressID);
        return new Promise((resolve, reject) => {
            reviewQuery.once("value").then((snapshot) => {
                snapshot.forEach(data => {
                    var reviewerMmts = data.val().userInfo;
                    if (mmts.height == reviewerMmts.height && mmts.bust == reviewerMmts.bust && mmts.waist == reviewerMmts.waist && mmts.hips == reviewerMmts.hips) {
                        var review = {
                            comment: data.val().comment,
                            size: data.val().size,
                            rating: data.val().rating
                        };
                        reviews.push(review);
                    }
                });
                resolve(reviews);
            });
        });
    }

    componentDidMount() {
        this.getReviewData().then(reviews => {
            this.setState({reviews: reviews});
        });
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
                            {this.state.reviews && 
                                <p className="itemView-item-size">Recommended size: {this.state.reviews[0].size}</p>
                            }
                            <p className="itemView-item-price">${this.state.item.price}</p>


                            {/* { isSaved(this.selectedItem.name)
                            ? <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Removed from Saved</button>
                            : <button className="itemView-save-btn" onClick={() => saveImage(this.selectedItem)} >Save for later</button>
                            } */}
                        
                            <p className="itemView-review-title"> <i>See what other people with your measurements have to say</i></p>
                            <p className="itemView-item-measurements"><i>Showing women that are {this.getHeightStr()}, waist: {this.state.waist}", hips: {this.state.hips}", bust: {this.state.bust}" </i></p>
                            <hr />
                            {this.state.reviews && this.state.reviews.map((review, key) => {
                                return (
                                    <div className="itemView-review" key={key}>
                                        <p className="itemView-numRating">{review.rating}/10</p>
                                        <div>
                                            <p className="itemView-comment">{review.comment}</p>
                                            <p className="itemView-review-name"> - Alina</p>
                                        </div>
                                    </div>
                                );
                            })}
                         
                        </div>
                        
                    </div>
                    <div className="itemView-c1-right">
                        <img alt={this.state.item.name} src={this.state.item.img} className="itemView-img"/>
                    </div>
                </div>

            </div>
            <FooterSmall />
        </div>
        );
    }
 }

export default Item;